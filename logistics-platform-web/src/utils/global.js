import axios from "axios";

const global = {
    // 本地路径
    // baseURL:'http://localhost:7070/vision/',
    baseURL:'http://106.15.66.130:7070/vision/',
    //验证上传
    beforeAvatarUpload: function(file) {
        let _type = false;
        if(file.type === 'image/jpeg' || file.type === 'image/png'){
            _type = true;
        }
        let _size = file.size / 1024 / 1024 < 4;

        if(!_type) this.$message.error('上传头像图片只能是JPG/PNG格式');

        if(!_size) this.$message.error('上传头像图片大小不能超过4MB');
        return _type && _size;
    },
    //日期格式化
    dateFormatter: function(){
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    msg:function(val){
        this.$notify.info({
            title: '提示',
            duration: 2000,
            message: val
        });
    },
    errorMsg:function(val){
        this.$notify.error({
            title: '提示',
            duration: 2000,
            message: val
        });
    },
    clearObj(obj){
        for(let key in obj){
            obj[key]=''
        }
    },
    isAdmin(){
        let role = localStorage.getItem("blackview-user");
        return JSON.parse(role).role === "admin";
    }
}
export default global;
