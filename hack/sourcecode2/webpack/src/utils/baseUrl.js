import service from './request'
const baseURL = process.env.NODE_ENV === 'production' ? service.defaults.baseURL : 'apis'
// const baseURL_PRO = process.env.NODE_ENV === 'production' ? process.env.API_ROOT_PRO : 'apiPro'
const baseURL_PRO = process.env.NODE_ENV === 'production' ? (sessionStorage.getItem('ApiPro') ? sessionStorage.getItem('ApiPro') : process.env.API_ROOT_PRO) : 'apiPro'
const baseURL_SEL = process.env.NODE_ENV === 'production' ? sessionStorage.getItem('SelectUrl') : 'select'
const uploadUrl = process.env.NODE_ENV === 'production' ? sessionStorage.getItem('uploadUrl') : 'upload'
const pwdUrl = process.env.NODE_ENV === 'production' ? service.defaults.baseURL : 'pwd'
export {
  baseURL,
  baseURL_PRO,
  uploadUrl,
  pwdUrl,
  baseURL_SEL
}


// WEBPACK FOOTER //
// ./src/utils/baseUrl.js