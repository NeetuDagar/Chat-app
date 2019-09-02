const users=[]

// need four functions  1.addUsers 2.removeUsers 3.getUsers 4.getsUsersInRoom

// addUsers
const addUser=({id,username,room})=>{
// clear the data
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()

// validate the user data 
    if(!username || !room){
        return {
            error:'Username and room are required!'
        }
    }
    // check foe existing User
    const existUser=users.find((user)=>{
         return user.room === room && user.username===username
    })
    // validate username
    if(existUser){
        return {
            error:'Username is an use!'
        }
    }
    // store user
    const user ={id,username,room } 
    users.push(user)
    return { user }
 }


// remove users
        const removeUser = (id) => {
        const index = users.findIndex((user) => user.id === id)
    
        if (index !== -1) {
            return users.splice(index, 1)[0]
        }

  
    } 


    //   get Users
   const getUser = (id)=> {
       return users.find((user) => user.id==id)
   }



// getuser in a room 
 const getsUsersInRoom=(room)=>{
     room=room.trim().toLowerCase()
     return users.filter((user)=>user.room === room)
 }

module.exports={
    addUser,
    removeUser,
    getUser,
    getsUsersInRoom
}