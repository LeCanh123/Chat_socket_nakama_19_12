import React from 'react'

export default function UpdateAccount() {
    
    useEffect(()=>{

        async function updateAccount(){
          const authtoken = localStorage.getItem("nkauthtoken");
          const refreshtoken = localStorage.getItem("nkrefreshtoken");
          let session = Session.restore(authtoken, refreshtoken);
        
          const displayName = "Lê Ngọc Cảnh";
          const avatarUrl = "https://api.theinfluencer.vn/uploads/2022/09/qDvekDw4onPwlU5xrkaUTzDP108Y6y5NpI1w6fBI.jpg";
          const location = "San Francisco";
          // let updateResult= await client?.UpdateAccountAsync(session, null, displayName, avatarUrl, null, location);
          // console.log("updateResult",client);
          client?.updateAccount(session, { display_name: displayName, avatar_url: avatarUrl })
          .then(response => {
            console.log("Tài khoản đã được cập nhật thành công:", response);
          })
          .catch(error => {
            console.error("Lỗi khi cập nhật tài khoản:", error);
          });
        }
        updateAccount()
        
        
        },[client])
  return (
    <div>
        
        <div>UpdateAccount</div>


        
    </div>
  )
}
