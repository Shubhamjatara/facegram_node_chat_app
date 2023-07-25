// const { io } = require("socket.io-client");

const socket = io('http://localhost:8000', { transports: ['websocket'] })

var MessagesMap = new Map();

let Info = {
    UserArry:[],
    Current_Send_User_Id:null,
    Current_logged_User_id:null

}


const UserName = prompt('Enter the UserName')
console.log(UserName)

socket.emit('GettingUserName', (UserName));


// Event Handling for Button
document.getElementById('button').addEventListener('click', (e) => {
    e.preventDefault();
    var msg = document.getElementById('input').value;
    document.getElementById('input').value = '';
    console.log(msg);
    window.scrollTo(0, document.getElementById('messages').scrollHeight);// Fix this
    document.getElementById('messages').innerHTML +=   "<div class='d-flex justify-content-end'>"+
            "<span class='px-3  mt-5  text-break d-block border border-dark rounded-pill'>"+msg+
            "</span>"+
          "</div>"

          //creating payload
    let data = {
        SenderId: Info.Current_logged_User_id,
        ReceiverId:Info.Current_Send_User_Id,
        Message:msg
    }

    MessagesMap.get(Info.Current_Send_User_Id).push(data);
    console.log(MessagesMap)
    socket.emit('chat message', data);
    //socket.emit('ack','Received');



})

//Getting mine Socket Id from Server

socket.on('myId',(Id)=>{
    Info.Current_logged_User_id = Id;
    console.log( 'My Socked Id' +' : ' +Id)
})

//receving messages from user
socket.on('receiveMassgeFromUser',(data)=>{
    console.log('Data from AnotherUser'+' : '+ data.Message)
    if(!MessagesMap.has(data.SenderId))
    {
        console.log('Map set')
        MessagesMap.set(data.SenderId,[]);
    }
    MessagesMap.get(data.SenderId).push(data);
    console.log(MessagesMap)

    
    
    if(Info.Current_Send_User_Id == data.SenderId) 
        RenderCurrentMessage(data,Info.Current_logged_User_id);
        else
         setNotification(data.SenderId);

    
})



socket.on('chat message', (msg) => {

    // var item = document.createElement('li');
    // item.textContent = msg;
    // messages.appendChild(item);
    //console.log('Recieved from Server')
    console.log('Data Revived from User'+' : '+ msg)
    //window.scrollTo(0, document.body.scrollHeight);
    window.scrollTo(0, document.getElementById('messages').scrollHeight);
    socket.emit('ack', 'Received');


})


//Receving Filter Messages from Server

socket.on('ArrayMessagesReceived',(dataArray)=>{

  //  document.getElementById('messages').innerHTML = '';
    
    
    // for(let i=0; i<dataArray.length; i++)
    // {
    //     if(dataArray[i].SenderId == Info.Current_logged_User_id)
    //     {
    //         document.getElementById('messages').innerHTML +=   "<div class='d-flex justify-content-end'>"+
    //         "<span class='px-3  mt-5  text-break d-block border border-dark rounded-pill'>"+dataArray[i].Message+
    //         "</span>"+
    //       "</div>"
    //     }
    //     else if (dataArray[i].SenderId != Info.Current_logged_User_id)
    //      {

    //         document.getElementById('messages').innerHTML += "<div class='d-flex justify-content-start'>"+
    //         "<span class='px-3  mt-5  text-break d-block border border-dark rounded-pill'>"+dataArray[i].Message+
              
    //         "</span>"+
    //       "</div>"

    //     }

       
    // }

    console.log('Filter Array Recived')
    console.log(dataArray)
})

//check this // refactor this code
socket.on('userarray', (clientarr) => {

    Info.UserArry = clientarr;

    console.log(clientarr);
    let userlist = clientarr;
    let client_Id = true;
       for(let i=0;i<userlist.length;i++)
       {
            if(UserName == userlist[i].Name)
            {
                userlist.splice(i,1);
                console.log("User Poped")
                client_Id = true;
                break;
            }
       }

       if(client_Id)
       {
        client_Id = false;
    document.getElementById('userlist').innerHTML = '';
    for (let i = 0; i < userlist.length; i++) {
        document.getElementById('userlist').innerHTML += '<tr class="userslist">' + '<th class="table-dark">' + (i + 1) + '</th>'
            + ' <th class="table-dark overflow-hidden">' + userlist[i].Name + '</th>' + '</tr>';


    }

    var client_rendered_user_list = document.getElementsByClassName('userslist');
    console.log(Array.from(client_rendered_user_list).length)




    for (let i = 0; i < Array.from(client_rendered_user_list).length; i++) {
        document.getElementsByClassName('userslist')[i].addEventListener('click', () => {
            console.log('Clicked ' + i)
            Info.Current_Send_User_Id = userlist[i].Id;
            console.log(Info.Current_Send_User_Id)

            //Apply Conditon here to prevent unwanted fetching
            // socket.emit('GiveMeMessagesOfUser',({
            //     Sender:Info.Current_logged_User_id,
            //     Receiver:Info.Current_Send_User_Id
            // }));

            if(!MessagesMap.has(Info.Current_Send_User_Id))
            {
                console.log('Map set')
                MessagesMap.set(Info.Current_Send_User_Id,[]);
            }
            
            RenderMessages(MessagesMap.get(Info.Current_Send_User_Id),Info.Current_logged_User_id);

            const renderForm = document.getElementById('inputToggle');
            if(renderForm.classList.contains('d-none'))
            {
                renderForm.classList.remove('d-none');
               
            }

           

        })
    }




       }
})



function setNotification(ReceiverID)
{
    //seraching username for receiverId
    let users = Info.UserArry;
    let getuser;
    for(let i=0; i < users.length;i++)
    {
        if(users[i].Id == ReceiverID)
        {
            getuser = users[i].Name;
            break;
        }
    }
 let getting_user_list =  document.getElementsByClassName('table-dark');
    for(let i=0;i<Array.from(getting_user_list).length;i++)
    {
        if(String(getting_user_list[i].innerHTML) == getuser)
        {
            let redothtml =  "<span class='text-danger fs-3'> . </span>";
            getting_user_list[i].innerHTML+=redothtml;

            //Event handling for removing notification
            getting_user_list[i].addEventListener('click',()=>{
                getting_user_list[i].innerHTML = getuser;
            })
            break;
        }
    }

}

//Rendering messages of array from MessagesMap
//Current_logged_User_id is clinet current socket id 
//Info object is mentioned top of the code
function RenderMessages(dataArray,Current_logged_User_id)
{
    document.getElementById('messages').innerHTML = '';
    
    
    for(let i=0; i<dataArray.length; i++)
    {
        //Simple logic for where to place message
        if(dataArray[i].SenderId == Current_logged_User_id)
        {
            document.getElementById('messages').innerHTML +=   "<div class='d-flex justify-content-end'>"+
            "<span class='px-3  mt-5  text-break d-block border border-dark rounded-pill'>"+dataArray[i].Message+
            "</span>"+
          "</div>"
        }
        else if (dataArray[i].SenderId != Current_logged_User_id)
         {

            document.getElementById('messages').innerHTML += "<div class='d-flex justify-content-start'>"+
            "<span class='px-3  mt-5  text-break d-block border border-dark rounded-pill'>"+dataArray[i].Message+
              
            "</span>"+
          "</div>"

        }
}
}

//Render Current received Message
function RenderCurrentMessage(data,Current_logged_User_id)
{
    if(data.SenderId == Current_logged_User_id)
    {
        document.getElementById('messages').innerHTML +=   "<div class='d-flex justify-content-end'>"+
        "<span class='px-3  mt-5  text-break d-block border border-dark rounded-pill'>"+data.Message+
        "</span>"+
      "</div>"
    }
    else if (data.SenderId != Current_logged_User_id)
     {

        document.getElementById('messages').innerHTML += "<div class='d-flex justify-content-start'>"+
        "<span class='px-3  mt-5  text-break d-block border border-dark rounded-pill'>"+data.Message+
          
        "</span>"+
      "</div>"

    }

}