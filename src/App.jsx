import React, { useEffect, useState } from 'react';
import './App.css';
import { Client, Session } from '@heroiclabs/nakama-js';
import { useNavigate } from "react-router-dom";


function App() {
  const navigate = useNavigate();
  const [loginState,setLoginState]= useState(false)
  const [client,setClient]= useState(null)
  const [account,setAccount]= useState(null)
  const [socket,setSocket]= useState(null)
  const [chanelCode,setChanelCode] = useState('general')
  const [chanel,setChanel] = useState(null)
  const [chatList,setChatlist]=useState([])
    // client.useSSL = false

    console.log("account",account);

  useEffect(() => {
    // khởi tạo client
    var client1 = new Client("defaultkey", "127.0.0.1", 7350, false);
    if(client1){
      setClient(client1);
    }
  }, []);

  async function getAccount(session){
      const account1 = await client?.getAccount(session);
      setAccount(account1)
  }

async function getSocket(session){
  const secure = false; // Enable if server is run with an SSL certificate
  const trace = false;
  if(!client){return}
  const socket = client.createSocket(secure, trace);
  if(!socket) return
  await socket.connect(session,false);
  setSocket(socket);
  setLoginState(true)
}

  useEffect(()=>{
    const authtoken = localStorage.getItem("nkauthtoken");
    const refreshtoken = localStorage.getItem("nkrefreshtoken");
    if(authtoken&&refreshtoken){
      let session =Session.restore(authtoken, refreshtoken);
      getSocket(session)
      getAccount(session)
     }  

  },[client])



  async function getChanel( roomname,type, persistence, hidden){
    const channel = await socket.joinChat(roomname,type,  persistence, hidden);
    const message = { "hello": "world" };
    setChanel(channel)
    socket.writeChatMessage(channel.id, message);
  
  }

  useEffect(()=>{
    if(!socket) return
    socket.onchannelmessage = (message) => {
      setChatlist(prevChatList => [message, ...prevChatList])
    };

    const type = 1;
    const roomname = chanelCode;
    const persistence= false;
    const hidden= false;

    getChanel(roomname,type,persistence,hidden)

  

  },[socket,chanelCode,])

async function handleSendtext(){
  // const message = { "hello": "world" };
  let message = document.getElementById('chatcontent').value;
  let name1 = account.user.username;
  let message2 = {[name1] :message}
  console.log("socket",socket);
  socket.writeChatMessage(chanel.id, message2);

}


// abc()

// useEffect(()=>{


  

// },[client])



  return (
    <div className="App">
    {loginState?
    <div className='' style={{backgroundColor:"#FFFFCC"}}>
      <div style={{backgroundColor:"#00FFFF"}}>Xin chào {account?.user?.username}
      <button style={{marginLeft:"10px"}} onClick={()=>{
          localStorage.removeItem("nkauthtoken");
          localStorage.removeItem("nkrefreshtoken");
          window.location.reload()
      }}>Đăng Xuất</button>
      
      
      </div>


      <div className='row mt-3' style={{width:"100%",margin:"auto"}}>
        <div className='col-3'>
          <button style={{width:"100%"}} onClick={()=>{ navigate('/creategroup')}}>Tạo Nhóm</button>
        </div>
        <div className='col-3'>
          <button onClick={()=>{navigate('/mygroup')}}>Xem Danh Sách Nhóm Của Tôi</button>
        </div>
        <div className='col-3'>
          <button onClick={()=>{navigate('/addfriend')}}>Thêm Bạn Bè</button>
        </div>
        <div className='col-3'>
          <button onClick={()=>{navigate('/listfriend')}}>Xem Danh Sách Bạn Bè</button>
        </div>
      </div>

      <div className='row mt-5' style={{width:"30%",margin:"auto",marginTop:"20px"}}>
        <div className='col-6'>
          <button style={{width:"100%"}}>Room chat: {chanelCode}</button>
        </div>
        <div className='col-6'>
          <button  style={{width:"100%"}} onClick={()=>{
            let newchanel=prompt("nhập tên kênh");
            setChanelCode(newchanel);
            setChatlist([])
            }}>Thay đổi kênh chat
          </button>
        </div>
      </div>


      <div className='row mt-3' style={{width:"30%",margin:"auto"}}>
        <div className='col-6'>
          <input style={{width:"100%"}} type="text" placeholder='Chat content' id='chatcontent' />
        </div>
        <div className='col-6'>
          <button style={{width:"100%"}}  onClick={   ()=>{handleSendtext()}}>Gửi tin nhắn</button>
        </div>
      </div>
    

    <div>
     
    </div>
  

    {chatList.map((item)=>{
      return <div style={{textAlign:'left',marginLeft:'50px'}}>
        <div style={{display:"inline-block",backgroundColor:"#FFCCFF",margin:"5px"}}>
          {item.username}:
        </div>
        <div style={{display:"inline-block"}}>
          {item.content[item.username]}
        </div>
      </div>
    })}
    </div>
    :
    <>
      <div style={{backgroundColor:"#99FFFF",fontSize:"30px",fontWeight:'bold'}}>WelCome To ChatBox</div>
      <div>
        <button style={{margin:"10px"}} onClick={()=>{navigate('login')}} >Login</button>
        <button onClick={()=>{navigate('register')}} >Register</button>
        <button style={{margin:"10px"}}  onClick={()=>{
                    localStorage.removeItem("nkauthtoken");
                    localStorage.removeItem("nkrefreshtoken");

        }} >Reset Data</button>
      </div>



    </>
    }
    </div>
  );
}

export default App;


