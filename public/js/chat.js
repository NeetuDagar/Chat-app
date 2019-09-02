

const socket=io()



// elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')


// templates

const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

// options
const {username,room}=  Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

  const autoscroll=()=>{
    //   New Message element
    const $newMessage=$messages.lastElementChild
    // height of the new message
    const $newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt($newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

    // visible height
    const visibleHeight=$messages.offsetHeight
    
    // height of message container
     const containerHeight=$messages.scrollHeight

    //  how far have i scrolled

       const scrolOffset=$messages.scrollTop+visibleHeight

       if(containerHeight-newMessageHeight <=scrolOffset){
          $messages.scrollTop=$messages.scrollHeight
       }
  }
// client receive
    // socket.on("countUpdated",(count)=>{
    // console.log('this count an updated',count)
    // for message render template 
    socket.on("message",(message)=>{
        console.log(message)
        const html=Mustache.render(messageTemplate,{
            username:message.username,
            message:message.text,
            createdAt:moment(message.createdAt).format('h:mm a')
        })
        $messages.insertAdjacentHTML('beforeend',html)
        autoscroll()
   })


        //for location render template    
     socket.on('locationMessage',(message)=>{
         console.log(message)
         const html=Mustache.render( locationMessageTemplate,{
            username:message.username,
            url:message.url,
            createdAt:moment(message.createdAt).format('h:mm a')
        })
        $messages.insertAdjacentHTML('beforeend',html)
        autoscroll()
   })
         
    

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
            room,
            users
    })
    document.querySelector('#sidebar').innerHTML=html
})

// });

// // document.querySelector('#increment').addEventListener('click',()=>{
// //        console.log('clicked')
// //     //    client emits
// //      socket.emit('increment')
      

// })
$messageForm.addEventListener('submit',(e) => {
 e.preventDefault()
// disable button
$messageFormButton.setAttribute('disabled','disabled')
 //  const message=document.querySelector('input').value
//  client send aknowledment to server that message is delivered
const message=e.target.elements.message.value

 socket.emit('sendMessage',message,(error)=>{
// enable button
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()

     if(error){
         return console.log(error)
     }
     console.log("the message was delivered!")
 })

})

// send current location and aknowledgment msg to server for location was shared
 $sendLocationButton.addEventListener('click',() => {
    if(!navigator.geolocation){
    return alert("geolocation is not supported by your browser")
    }

    $sendLocationButton.setAttribute('disabled','disabled') 

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);
       
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log("Location is shared")
        })
        })
    
    })
     socket.emit("join",{username,room},(error)=>{
         if(error){
             alert(error)
             location.href='/'
         }
             })