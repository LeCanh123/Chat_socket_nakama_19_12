import React, { useEffect, useState } from 'react';
import { Client, Session } from '@heroiclabs/nakama-js';
import { Button, message, Space } from 'antd';


export default function CreateGroup() {
    const [messageApi, contextHolder] = message.useMessage();
    const [isCreateGroup,setIsCreateGroup]=useState(false)
    const [groupInfo,setGroupInfo]=useState(null)
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


    const [client,setClient]= useState(null)
    useEffect(() => {
        // khởi tạo client
        var client1 = new Client("defaultkey", "127.0.0.1", 7350, false);
        if(client1){
          setClient(client1);
        }
      }, []);

      useEffect(()=>{
        const authtoken = localStorage.getItem("nkauthtoken");
        const refreshtoken = localStorage.getItem("nkrefreshtoken");
        if(authtoken&&refreshtoken){
          let session =Session.restore(authtoken, refreshtoken);
       
         }  
    
      },[client])

      async function handleCreateGroup(){
        console.log("đã nhấn");
        const name = document.getElementById('name').value;
        const description = name;
        const authtoken = localStorage.getItem("nkauthtoken");
        const refreshtoken = localStorage.getItem("nkrefreshtoken");
        if(!authtoken && !refreshtoken){
        return 
        }  
        let session =Session.restore(authtoken, refreshtoken);
        try {
            var group =await client?.createGroup(session,{ name, description});
            console.log("Tạo nhóm thành công:", group);
            success("Tạo nhóm thành công");
            setIsCreateGroup(true)
            setGroupInfo(group)
          } catch (err) {
            console.error("Lỗi khi tạo nhóm:", err);
            error('Tên nhóm bị trùng')
          }

      }

  return (
    <div>
        {contextHolder}
        <div style={{textAlign:'center',color:"#33CCFF",fontSize:"20px",fontWeight:'bold',marginBottom:"10px"}}>CreateGroup</div>
        <div className='mt-5' style={{width:"30%",margin:'auto',backgroundColor:"#EEEEEE",padding:"20px"}}>
            <div style={{color:"#6666FF"}}>Nhập tên nhóm</div>
            <input id='name' className='mt-2' placeholder='Nhập tên nhóm' style={{border:"1px solid #6699FF",width:"90%",borderRadius:"3px"}}></input>
            <div  className='mt-2'><button onClick={()=>{handleCreateGroup();
            
            }}>Tạo Nhóm</button></div>

            {isCreateGroup?
            <div className='mt-5'>
            <div>Tạo Nhóm Thành Công</div>
            <div>Tên Nhóm: {groupInfo?.name}</div>
            <div>Id nhóm: {groupInfo?.id}</div>
            
            </div>
            :
            <></>
            }
        </div>


    </div>
  )
}
