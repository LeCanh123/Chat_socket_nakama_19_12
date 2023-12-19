import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Client, Session } from '@heroiclabs/nakama-js';
import { Button, message, Space } from 'antd';

export default function Listfriend() {
    const [messageApi, contextHolder] = message.useMessage();
    const [listUserFriend,setListUserFriend]=useState([])

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


    async function listFriend(){
      const authtoken = localStorage.getItem("nkauthtoken");
      const refreshtoken = localStorage.getItem("nkrefreshtoken");
      if(!authtoken && !refreshtoken){
      // getSocket(session)
      // getAccount(session)
      return
      }
      try{
        let session =Session.restore(authtoken, refreshtoken);

        // let ids=[document.getElementById("iduser").value]
        // let usernames=[document.getElementById("username").value]
        // let addFriendResult = await client?.addFriends(session, ids, usernames);
        const friends = await client?.listFriends(session); 
        console.log("addFriendResult",friends);
        if(friends.friends){
          success("Lấy danh sách bạn bè thành công")
          setListUserFriend(friends.friends?friends.friends:[])

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
        <button onClick={()=>{listFriend()}}>Xem Danh Sách Bạn Bè</button>
{listUserFriend.map((item,index)=>{
    return <div>
        <div>STT: {index+1}</div>
        <div>Id:{item.user?.id}</div>
        <div>UserName:{item.user?.username}</div>
        <button onClick={()=>{navigate(item.user?.id)}}>Chat ngay</button>
    </div>
})}
        
    </div>
  )
}
