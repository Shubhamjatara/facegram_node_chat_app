const io = require('socket.io')(8000);
var USERS = [];
var MessagesArray = [];




io.on('connection', (socket) => {
  //inserting new user in array as object
  
    

  io.emit('Give your id');

  



  io.to(socket.id).emit('myId',(socket.id));

   socket.on('GettingUserName',(UserName)=>{
    let User = new Object();
    User.Id = socket.id;
    User.Name = UserName;
    USERS.push(User);
    console.log(USERS)

//Sending users array to all connected users
// console.log(socket)
  io.emit('userarray', USERS);

   })



  //Fitering Messages Here
  // socket.on('GiveMeMessagesOfUser',async (dataForFilter)=>{
  //   let temp = await FilterMessages(dataForFilter);
  //   io.to(dataForFilter.Sender).emit('ArrayMessagesReceived',temp);
  // })

//Printing User socket id
  console.log('User Connected' + ' : ' + socket.id)



  //Receiving msg from users 
  socket.on('chat message', (data) => {
    console.log(data)
  
    //Store messages in Messages array
    // MessagesArray.push(data);
    // console.log('Array Pushed')
    console.log(MessagesArray)

    
    // io.emit('chat message',msg)
    io.to(data.ReceiverId).emit('receiveMassgeFromUser',data);


  })

  socket.on('ack', (msg) => {
    console.log('Server handle' + ' msg :  ' + msg)
    console.log('User Id' + ' ' + socket.id)
  })



  socket.on('disconnect',()=>{
    for(let i = 0; i< USERS.length;i++)
    {
      if(socket.id == USERS[i].Id)
      {
        console.log(USERS[i].Name + ' : ' +'Disconnected');
        USERS.splice(i,1);
        io.emit('userarray', USERS); 
      //  console.log(USERS)
        break;
      }
    }
  })



})



// function  FilterMessages(dataForFilter)
// {
    
//   let i = -1;
//     return MessagesArray.filter((dataForFilter)=>{
//       i++;
//         return (MessagesArray[i].SenderId == dataForFilter.SenderId && MessagesArray[i].ReceiverId == dataForFilter.ReceiverId) || 
//        ( MessagesArray[i].SenderId == dataForFilter.ReceiverId && MessagesArray[i].ReceiverId == dataForFilter.SenderId)
//     })

    

// }




