import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Client, Session } from '@heroiclabs/nakama-js';
import { Button, message, Space } from 'antd';

export default function Addfriend() {
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


    const navigate = useNavigate();
    const [client,setClient]= useState(null)


    useEffect(() => {
        // khởi tạo client
        var client1 = new Client("defaultkey", "127.0.0.1", 7350, false);
        if(client1){
          setClient(client1);
        }
      }, []);


    async function addFriend(){
      const authtoken = localStorage.getItem("nkauthtoken");
      const refreshtoken = localStorage.getItem("nkrefreshtoken");
      if(!authtoken && !refreshtoken){
      // getSocket(session)
      // getAccount(session)
      return
      }
      try{
        let session =Session.restore(authtoken, refreshtoken);

        let ids=[document.getElementById("iduser").value]
        let usernames=[document.getElementById("username").value]
        let addFriendResult = await client?.addFriends(session, ids, usernames);
        // const friends = await client?.listFriends(session); 
        console.log("addFriendResult",addFriendResult);
        if(addFriendResult==true){
          success("Thêm bạn thành công")
        }

      }
      catch(err){
        error("Thêm bạn thất bại")
        console.log(err);
      }

    }

    // useEffect(()=>{


    // },[])
      

  return (
    <div>
       {contextHolder}
        <div>Addfriend</div>
        <div>Nhập Id</div>
        <input id='iduser'></input>
        <div>Nhập UserName</div>
        <input id='username'></input>
        <button onClick={()=>{addFriend()}}>Kết bạn</button>

        
    </div>
  )
}
