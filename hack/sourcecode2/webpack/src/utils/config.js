import axios from "axios";
import service from "./request";
let GET_CONFIG = () => {
  if(process.env.NODE_ENV === 'production'){
    return new Promise((resolve, reject)=>{
      axios({
        url: 'serverconfig.json',
        method: 'get',
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject()
      })
    })
    // axios({
    //   url: 'serverconfig.json',
    //   method: 'get',
    // }).then((res) => {
    //   let rs = res.data
    //   if(rs.schoolCode){
    //     sessionStorage.setItem('schoolCode',rs.schoolCode)
    //   }
    //   //H5
    //   if(rs.ApiUrl && rs.SelectUrl){
    //     sessionStorage.setItem('isConfig',1)
    //     service.defaults.baseURL = rs.ApiUrl
    //     sessionStorage.setItem('SelectUrl',rs.SelectUrl)
    //   }
    //   // 获取菜单url
    //   sessionStorage.setItem('ApiPro',rs.ApiPro)
    //   //上传
    //   if(rs.UploadUrl){
    //     sessionStorage.setItem('uploadUrl',rs.UploadUrl)
    //   }
    //   //.net微信登录
    //   if(rs.weChatUrl){
    //     sessionStorage.setItem('weChatUrl',rs.weChatUrl)
    //   }
    // }).catch((err) => {
    //   console.log(err);
    // })
  }else{
    // 开发环境
    sessionStorage.setItem('schoolCode',"10013") 
  }
}

export {
  GET_CONFIG
}


// WEBPACK FOOTER //
// ./src/utils/config.js