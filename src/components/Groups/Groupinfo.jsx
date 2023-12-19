import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Client, Session } from '@heroiclabs/nakama-js';
import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from './counterSlice'
import { Button, message, Space } from 'antd';
import { useParams } from 'react-router-dom';


export default function Groupinfo(props) {
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const success = (content) => {
    messageApi.open({
      type: 'success',
      content: content,
    });
  };

  const error = (content) => {
    messageApi.open({
      type: 'error',
      content: content,
    });
  };

  const warning = (content) => {
    messageApi.open({
      type: 'warning',
      content: content,
    });
  };

  const setGroupId = useSelector((state) => state.groupSlice.setGroupId)
  console.log("count123",setGroupId);

    const navigate = useNavigate();
    const [loginState,setLoginState]= useState(false)
    const [client,setClient]= useState(null)
    const [account,setAccount]= useState(null)
    const [listGroup,setListGroup]=useState([])
    const [socket,setSocket]= useState(null)
    const [chanel,setChanel] = useState(null)
    const [chatList,setChatlist]=useState([])

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

    useEffect(()=>{
        const authtoken = localStorage.getItem("nkauthtoken");
        const refreshtoken = localStorage.getItem("nkrefreshtoken");
        if(authtoken&&refreshtoken){
          let session =Session.restore(authtoken, refreshtoken);
          getAccount(session)
         }  
    
      },[client])


    async function getUserList(){

        const authtoken = localStorage.getItem("nkauthtoken");
        const refreshtoken = localStorage.getItem("nkrefreshtoken");
      
        if(!authtoken && !refreshtoken){
          return 
        }else{
          try{
            let session =Session.restore(authtoken, refreshtoken);
      
            // let userId =account.user.id;
            // console.log("userId",userId);
            // console.log("session",session);
            // let findGroupResult=await client?.listUserGroups(session,String(account?.user?.id));

            var findGroupMember = await client.ListGroupUsers(session, id);
            // let findGroupResult=await client?.listUserGroups(session,{userid:"832f7ea7-3457-4f1a-9008-9662b05100f8", limit: 10, state: 10 });
            console.log("findGroupResult",findGroupMember);
            // setListGroup([...findGroupResult.user_groups])
          }
          catch(err){
            warning("Nhóm Chưa Có Thành Viên")
            console.log("Vào Lỗi",err);
          }
      
        }
      
      };

      useEffect(()=>{
        getUserList()
      },[])

      async function handleAddToGroup(){
        const authtoken = localStorage.getItem("nkauthtoken");
        const refreshtoken = localStorage.getItem("nkrefreshtoken");
      
        if(!authtoken && !refreshtoken){
          return 
        }else{
          try{
            let session =Session.restore(authtoken, refreshtoken);
            var addToGroupResult=  await client?.joinGroup(session, setGroupId);
            console.log("Vào thành công",addToGroupResult);
            success("Vào nhóm thành công")
          }
          catch(err){
            console.log("err",err);
          }
        }
      }

      async function getChanel( roomnid,type, persistence, hidden){
        const channel = await socket.joinChat(roomnid, type,  persistence, hidden);
        const message = { "hello": "world" };
        setChanel(channel)
        socket.writeChatMessage(channel.id, message);
      
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

        useEffect(()=>{
          if(!socket) return
          socket.onchannelmessage = (message) => {
            setChatlist(prevChatList => [message, ...prevChatList])
          };
      

          // # A chat room which can be created dynamically with a name.
          // Room = 1,
          // # A private chat between two users.
          // DirectMessage = 2,
          // # A chat within a group on the server.
          // Group = 3

          const type = 3;
          const roomid = id;
          const persistence= false;
          const hidden= false;
      
          getChanel(roomid,type,persistence,hidden)
      
        
      
        },[socket])

      async function handleSendtext(){
        // const message = { "hello": "world" };
        let message = document.getElementById('chatcontent').value;
        let name1 = account.user.username;
        let message2 = {[name1] :message}
        console.log("message2",message2);
        let sendMessage=await socket?.writeChatMessage(chanel.id, message2);
        
      
      }
  return (
    <div >
      {contextHolder}
      <div style={{textAlign:'center',color:"#33CCFF",fontSize:"20px",fontWeight:'bold',marginBottom:"10px"}}>Group Info</div>
      <button style={{marginLeft:"20px"}} onClick={()=>{navigate('/mygroup')}}>Quay lại</button>
      <button style={{marginLeft:"20px"}} onClick={()=>{handleAddToGroup()}}>Tham Gia Nhóm</button>
      <div>ID Nhóm : {id}</div>
      

      <div className='row mt-3' style={{width:"30%",margin:"auto"}}>
        <div className='col-6'>
          <div>Nhập Tin nhắn</div>
          <input style={{width:"100%"}} type="text" placeholder='Chat content' id='chatcontent' /><br></br>
          <button style={{width:"100%",marginTop:"5px"}}  onClick={   ()=>{handleSendtext()}}>Gửi tin nhắn</button>

        </div>
        <div className='col-6'>
        </div>
      </div>
      <div>
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


    </div>
  )
}
