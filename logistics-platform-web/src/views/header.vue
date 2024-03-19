<template>
	<el-row>
		<el-col :span="2" class="header-wrap">
			<img style="margin-left: 8px;" src="../assets/img/lemon.png" @click="homePage" width="64px" />

		</el-col>
<!--		<el-col >
			<div>{{name}} </div>
		</el-col>-->
		<el-col :span="3" :offset="20" class="header-wrap text-r">
			<el-dropdown>
				<el-button class="no-b">
<!--				<el-col >{{name}}</el-col>-->
				<i class="fa fa-user-circle" aria-hidden="true"></i> <i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
				<el-dropdown-item>
					<div @click="userInfo"><i class="fa fa-address-card-o"></i>查看个人信息</div>
				</el-dropdown-item>
				<el-dropdown-item>
					<div @click="editPassword"><i class="fa fa-wrench"></i>修改密码</div>
				</el-dropdown-item>
				<el-dropdown-item>
					<div @click="loginOff"><i class="fa fa-power-off"></i>退出</div>
				</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</el-col>
	</el-row>
</template>

<script>
    export default {
        data() {
            return {
				name:'',
            };
        },
		created: function () {
			let user = localStorage.getItem("blackview-user");
			this.name = JSON.parse(user).account ;
		},
        methods: {
        	homePage(){
				this.$router.push({
					name: 'home-page',  // 跳转首页
				})
			},
            loginOff(){
                console.log("loginOff");
                this.$router.push('/');
            },
            editPassword(){
                this.$router.push({
                    name: 'edit-password',  // 路由的名称
                })
            },
            userInfo(){
                this.$router.push({
                    name: 'user-info',  // 路由的名称
                })
            }
        },
    }
</script>


<style lang="less">
  .no-b{
    border: none!important
  }
  .text-r {
    text-align: right
  }

  .el-header, .el-footer {
    // background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
