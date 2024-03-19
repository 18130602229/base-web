<template>
  <div>
    <div>修改密码</div>
    <el-form>
        <el-form-item label="原始密码">
          <el-input v-model="obj.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="obj.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="confirmPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editPassword">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {axios} from '../../config/axios'
  export default {
    data() {
      return {
          obj:{
              account:localStorage.getItem('blackview-account'),
              oldPassword:'',
              newPassword:'',
          },
          confirmPassword:'',
      }
    },
      methods: {
          validate(){
              let flag = true;
              let msg  = "";
              if (this.obj.oldPassword.trim() === ""){
                  flag = false;
                  msg = " 原始密码不能为空！ "
              }else if(this.obj.newPassword.trim() === ""){
                  flag = false;
                  msg = " 新密码不能为空！ "
              }else if(this.confirmPassword.trim() !== this.obj.newPassword.trim() ){
                  flag = false;
                  msg = " 新密码和确认密码不一致！ "
              }
              return {code:flag,msg:msg}
          },
          editPassword() {
              let valid =this.validate();
              if (valid.code){
                  axios.put('user', this.obj).then(result => {
                      if (result.code !== 200){
                          console.log(result);
                          this.$message({
                              type: 'error',
                              message: "原始密码输入有误"
                          });
                          return;
                      }
                      this.$message({
                          type: 'success',
                          message: ' 密码修改成功!'
                      });
                      this.clearObj(this.obj);
                      this.confirmPassword = '';
                  }).catch(err => {
                      console.log(err);
                      this.loading=false;
                  });
              } else{
                  this.errorMsg(valid.msg);
              }
          }
      }
  }
</script>
