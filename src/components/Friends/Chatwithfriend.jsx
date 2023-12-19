import React, { useEffect, useState } from 'react';
import { Client, Session } from '@heroiclabs/nakama-js';
import { useParams } from 'react-router-dom';
import { message } from 'antd';

export default function Chatwithfriend() {
    const [client,setClient]= useState(null)
    const { id } = useParams();
    const [account,setAccount]= useState(null)
    const [socket,setSocket]= useState(null)
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

      async function sendChatMessage(message1) {
        try {
            const authtoken = localStorage.getItem("nkauthtoken");
            const refreshtoken = localStorage.getItem("nkrefreshtoken");
            if(!authtoken&&!refreshtoken){
                return
            } 
            let session =Session.restore(authtoken, refreshtoken);
            let receiverId = '832f7ea7-3457-4f1a-9008-9662b05100f8';
            let subject = "You've unlocked level 100!";
            let content = {
              rewardCoins: 1000,
            }
            let code = 101;
            let senderId = 'e009a5c9-1d4d-4755-9c90-928cfa2b8973' // who the message if from
            let persistent = true;
            let sendresult = client?.NotificationSend(receiverId, subject, content, code, senderId, persistent);
            console.log("sendresult",sendresult);
        } catch (error) {
          console.error('Lỗi khi gửi tin nhắn:', error);
        }
      }
      
      // Nhận và in ra các tin nhắn mới của người dùng có ID là 'user_id'
      async function receiveChatMessages() {
        try {

            const authtoken = localStorage.getItem("nkauthtoken");
            const refreshtoken = localStorage.getItem("nkrefreshtoken");
            if(!authtoken&&!refreshtoken){
                return
            } 
            let session =Session.restore(authtoken, refreshtoken);
            let messageResult= await client?.listChannelMessages(session);
            console.log("messageResult",messageResult);
        } catch (error) {
          console.error('Lỗi khi nhận tin nhắn:', error);
        }
      }

      useEffect(()=>{
        receiveChatMessages()
      },[client])

  return (
    <div>Chatwithfriend

<button onClick={()=>{sendChatMessage("message1")}}> Gửi đi</button>
    </div>

  )
}
