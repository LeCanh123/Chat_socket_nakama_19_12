import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Client, Session } from '@heroiclabs/nakama-js';
import "./../Css/Mygroup.css"
import { setGroupId } from '../../Redux/groupSlice';
import { useSelector, useDispatch } from 'react-redux'

export default function Mygroup() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [loginState,setLoginState]= useState(false)
    const [client,setClient]= useState(null)
    const [account,setAccount]= useState(null)
    const [listGroup,setListGroup]=useState([])

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
      
            let userId =account.user.id;
            console.log("userId",userId);
            console.log("session",session);
            let findGroupResult=await client?.listUserGroups(session,String(account?.user?.id));
            // let findGroupResult=await client?.listUserGroups(session,{userid:"832f7ea7-3457-4f1a-9008-9662b05100f8", limit: 10, state: 10 });
            console.log("findGroupResult",findGroupResult);
            setListGroup([...findGroupResult.user_groups])
          }
          catch(err){
            console.log("Vào Lỗi",err);
          }
      
        }
      
      };

  return (
    <div>
        <div style={{textAlign:'center',color:"#33CCFF",fontSize:"20px",fontWeight:'bold',marginBottom:"10px"}}>Danh Sách Nhóm Của tôi</div>
    
    <button style={{marginLeft:"100px",marginTop:"50px"}} onClick={()=>{getUserList()}}>Xem Danh Sách Group Của tôi</button>
    <button onClick={()=>{navigate('/')}} style={{margin:"10px"}}>Quay Về Trang Chủ</button>
    {listGroup.length!=0?
    <table className='mt-3' style={{marginLeft:"8%", border:"1px solid red"}}>
    <tr>
        <th style={{ border: "1px solid red", padding: "5px" }}>STT</th>
        <th style={{ border: "1px solid red", padding: "5px" }}>Avatar Url</th>
        <th style={{ border: "1px solid red", padding: "5px" }}>Create Time</th>
        <th style={{ border: "1px solid red", padding: "5px" }}>Id</th>
        <th style={{ border: "1px solid red", padding: "5px" }}>Group Name</th>
        <th style={{ border: "1px solid red", padding: "5px" }}>Max User Member</th>
        <th style={{ border: "1px solid red", padding: "5px" }}>Open</th>

    </tr>
    {listGroup.map((item,index)=>{
        return <tr className='hover' onClick={()=>{
          dispatch(setGroupId({id:item.group.id}));
          navigate(`/groupinfo/${item.group.id}`)}}>
            <td style={{ border: "1px solid red", padding: "5px" }}>{index+1}</td>
            <td style={{ border: "1px solid red", padding: "5px" }}>{String(item.group.avatar_url)}</td>
            <td style={{ border: "1px solid red", padding: "5px" }}>{item.group.create_time}</td>
            <td style={{ border: "1px solid red", padding: "5px" }}>{item.group.id}</td>
            <td style={{ border: "1px solid red", padding: "5px" }}>{item.group.name}</td>
            <td style={{ border: "1px solid red", padding: "5px" }}>{item.group.max_count}</td>
            <td style={{ border: "1px solid red", padding: "5px" }}>{String(item.group.open)}</td>
        </tr>
    })}
    </table>

    :
    <>
    </>
    }
    </div>
  )
}
