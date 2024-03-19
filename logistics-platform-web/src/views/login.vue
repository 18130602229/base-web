<template>
	<div style="height:100%; background-color: #1b1b1b;">
		<div :style ="note">
			<el-container>
				<el-header></el-header>
				<el-main class="main">
					<h1 class="logo">大智视觉平台</h1>
					<el-form ref="form" :model="form" class="z-depth-2">
						<el-form-item>
						<el-input v-model="form.account" autofocus  maxlength="24" placeholder="请输入用户名称"></el-input>
						</el-form-item>
						<el-form-item>
						<el-input v-model="form.password" maxlength="18" placeholder="请输入登录密码" type="password" @keyup.enter.native="login" ></el-input>
						</el-form-item>
						<el-form-item>
						<el-input  style=" width: 60%;" class="icon-code" v-model="form.codeNumber" @keyup.enter.native="login" id="codeNumber" placeholder="请输入验证码" autocomplete="off"></el-input>
						<div class="code" @click="refreshCode" style="    display: inline;float: right;">
							<s-identify :identifyCode="identifyCode"></s-identify>
						</div>
						</el-form-item>
						<el-form-item style="text-align:center;">
						<el-button type="primary" @click="login" @keyup.enter="login" style="width: 80px;">登录</el-button>
						<el-button type="primary" @click="cancelLogin" style="margin-left: 30px;width: 80px;">重置</el-button>
						</el-form-item>
					</el-form>
				</el-main>
			</el-container>
		</div>
		<el-footer>© XXXXX 版权所有 粤ICP备20044473号 </el-footer>
	</div>
</template>

<script>
	import {axios} from "../config/axios";
	import qs from "qs";
	export default {
		name: 'login',
		data() {
			return {
				note: {
					backgroundImage: "url(" + require("../assets/img/loginBg.png") + ") ",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center center",
					backgroundSize: "cover",
					height: "800px"
				},
				form: {
					account: '',
					password: '',
					codeNumber:'',
				},
				identifyCodes: "1234567890",
				identifyCode: "", // 验证码
			}
		},
		mounted() {
			this.identifyCode = "";
			this.makeCode(this.identifyCodes, 4);
		},
		methods: {
			login () {
				localStorage.removeItem("blackview-token"); // 清除缓存影响
				axios.post('user/login',{
					account: this.form.account.trim(),
					password: this.form.password.trim()
				}).then(response => {
					const code = response.code;
					if (code === 200) {
						let role = response.data.role;
						// 获取用户基本信息
						let user = {role:role.role,roleDescription:role.description,account:this.form.account.trim()};
						localStorage.setItem("blackview-token",response.data.token);
						localStorage.setItem("blackview-user",JSON.stringify(user));
						//this.$router.push('/Home')
						this.$router.push({
							name: 'home-page',  // 路由的名称
						})
					}else  if(code === 1001){
						this.$message.error('账号不存在！');
					}else if(code === 1003){
						this.$message.error('账号已被禁用！');
					}else{
						this.$message.error('账号或者密码输入有误！');
					}
				})
				.catch(err => {
					console.log(err);
					this.alertMsg();
				});
			},
			cancelLogin(){
				for(let key in this.form){
					this.form[key]  = ''
				}
			},
			alertMsg() {
				this.$notify.error({
					title: '提示',
					message: '网络出现错误!'
				});
			},
			//图片验证码
			randomNum(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			},
			refreshCode() {
				this.identifyCode = "";
				this.makeCode(this.identifyCodes, 4);
			},
			makeCode(o, l) {
				for (let i = 0; i < l; i++) {
					this.identifyCode += this.identifyCodes[
						this.randomNum(0, this.identifyCodes.length)
					];
				}
			},
		}
	}
</script>
<style scoped>
	h1 {
		text-align: center;
		color: #606266;
	}
	.logo{
		text-align: center;
		color: #ea8e69;
		font-family: cursive;
		font-size: 50px;
	}
	form {
		padding: 20px;
		background: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		border-radius: 2px;
	}
	.main {
		width: 400px;
		padding-top: 50px;
		margin: 0px auto;
	}
	.code {
		width: 114px; height: 40px; border: 1px solid rgb(192, 192, 192); float: left;
	}
	.el-footer{ color: #858585; font-size: 15px; padding-top: 15px;}
</style>
