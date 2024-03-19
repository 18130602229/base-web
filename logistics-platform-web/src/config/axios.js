import Router from '../router'
import axios from 'axios'
import qs from 'qs'
axios.defaults.withCredentials = true;//跨域
   axios.defaults.baseURL = 'http://localhost:8888/logistics/';
   // axios.defaults.baseURL = 'http://106.15.66.130:7070/logistics/';
axios.defaults.headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}
axios.defaults.transformRequest = function(data){
    data = qs.stringify(data);
    return data;
}
axios.interceptors.request.use(
    config=>{
        let token = localStorage.getItem("blackview-token");
        if (!!token) {
            config.headers.Authorization = token;
        }
        if (config.method == 'get') {
            config.params == undefined && (config.params = {});
        } else {
            config.data == undefined && (config.data = {}) && (config.data = []);
        }
        return config;
    },
    error=>{
        return Promise.reject(error);
    });
axios.interceptors.response.use(
    response=>{
        let res = response.data;
        //未登录或者登录超时
        if(res.code == '90'){
            Router.push({path: '/login'});
            return Promise.reject('')
        }
        //权限不足
        if(res.code == '92'){
            Router.push({path: '/noRight'});
            return Promise.reject('')
        }
        response.data.code = Number(response.data.code);
        return response.data;
    },
    error=>{
        console.log("error;",error)
        if (error.message === "Network Error") {
           // alert("网络异常，请重新登录！");
            Router.push({path: '/'});
            return Promise.reject('')
        }
        return Promise.reject(error);
    });
export {axios}
