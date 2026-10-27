
// import axios from 'axios'

// // let api=axios.create({
// //     baseURL:"http://localhost:3000/api",
// //     withCredentials:true
// // })
// const api = axios.create({
//   baseURL: import.meta.env.PROD
//     ? "/api"
//     : "http://localhost:3000/api",
//   withCredentials: true
// });
// // api.interceptors.request.use((config)=>{
// //     let token=localStorage.getItem('token');
// //     if(token){
// //         config.headers.Authorization=`Bearer ${token}`
// //     }
// //     return config;
// // })

// export default api
// VITE_BACKEND_URL=https://your-backend-render-url.onrender.com/api
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true   // this is what sends cookies automatically with every request
});

// no interceptor needed anymore — cookie is sent automatically by browser
// no need to manually attach Authorization header

export default api