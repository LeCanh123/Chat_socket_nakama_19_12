import React, { useEffect, useState } from 'react';
import { Client, Session } from '@heroiclabs/nakama-js';
import { Button, message, Space } from 'antd';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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
  const [client,setClient]= useState(null)
  useEffect(() => {
    // khởi tạo client
    var client1 = new Client("defaultkey", "127.0.0.1", 7350, false);
    if(client1){
      setClient(client1);
    }
  }, []);


  async function registerUser() {
    try {
      let email=document.getElementById('form1Example1').value
      let password=document.getElementById('form1Example2').value
      let create =true
      let username = email
      function validatePassword(password1) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(password);
      }
      if(!validatePassword(password)){
        return warning("Mật khẩu phải có chữ hoa, chữ thường, số và trên 6 ký tự")
      }
      const session = await client.authenticateEmail(email,password);

  
      // const response = await client.AuthenticateEmailAsync(email, password)
      success("Đăng nhập thành công")
      localStorage.setItem("nkauthtoken",session.token);
      localStorage.setItem("nkrefreshtoken",session.refresh_token);

      navigate("/")
    } catch (error) {
      console.error("Lỗi khi đăng ký tài khoản:", error);
      return warning("Địa chỉ Email đã tồn tại")
    }
  }
  
  // Gọi hàm để đăng ký tài khoản
  // registerUser("super1@heroes8.com", "batsignal171", "canh12345");




  return (
    <div  style={{textAlign:''}}>
      {contextHolder}
      <div className='mt-5' style={{width:'400px',height:'400px',margin:'auto',backgroundColor:"#EEEEEE"}}>
        <div style={{textAlign:'center',color:"#33CCFF",fontSize:"20px",fontWeight:'bold',marginBottom:"10px"}}>Login</div>
          <form onSubmit={(e)=>{e.preventDefault()}}>
            {/* Email input */}
            <div data-mdb-input-init="" className="form-outline mb-4">
              <div style={{paddingLeft:'5px'}}>Email address</div>
              <input type="email" id="form1Example1" className="form-control" 
              style={{border:"1px solid #99CCFF",width:"98%",marginLeft:"5px"}}/>
         
            </div>
            {/* Password input */}
            <div data-mdb-input-init="" className="form-outline mb-4">
              <div style={{paddingLeft:'5px'}}>Password</div>
              <input type="password" id="form1Example2" className="form-control" 
              style={{border:"1px solid #99CCFF",width:"98%",marginLeft:"5px"}}
              />
     
            </div>
            {/* 2 column grid layout for inline styling */}
            <div className="row mb-4">
              <div className="col d-flex justify-content-center">
                {/* Checkbox */}
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="form1Example3"
                    defaultChecked=""
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    {" "}
                    Remember me{" "}
                  </label>
                </div>
              </div>
              <div className="col">
                {/* Simple link */}
                <a href="#!">Forgot password?</a>
              </div>
            </div>
            {/* Submit button */}
            <button
              data-mdb-ripple-init=""
              // type="submit"
              className="btn btn-primary btn-block"
              onClick={()=>{registerUser()}}
            >
              Login
            </button>
          </form>
      </div>
    </div>

  )
}
