<template>
	<div id="wrap">
		<NavMenu />
		<div class="wrap-right">
			<Header></Header>
			<div class="v3-main">
				<el-main class="v3-content-main">
					<keep-alive :include="navTagIndexs">
						<router-view></router-view>
					</keep-alive>
					<!--  <DefaultMain></DefaultMain>   TODO 默认打开页面 总量 ，新增量，版本数，图表展示 -->
				</el-main>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import NavMenu from './nav-menu'
import Header from './header'
import DefaultMain from './default-main'
export default {
  name: 'layout',
  components: {
    NavMenu, Header, DefaultMain
  },
  computed: {
    ...mapGetters(['navTagIndexs']),
    ...mapState(['isNavMenuOpen'])
  }
}
</script>

<style lang="less">
.v3-header {
	height: 40px;
	border-bottom: 1px solid #eee;
	background: #fff
}
.v3-main {
  	flex: 1; overflow: auto; background: #f7f9fc; box-shadow: 0px 3px 18px rgba(24,41,82,0.08) inset;
}
.v3-content-main {
	background: #fff;
	margin: 20px;
}
#app #wrap, #app #wrap .wrap-left{ display: flex;}
#app{
    width: 100%; height: 100%;
    #wrap{
        width: 100%; height: 100%;
        .wrap-left{
            display: flex; flex-direction: column; align-items: center; background-color: #545c64;
            .el-menu{ background-color: #646b72 !important; border-right:0; width: 150px; }
            .el-menu-item{ padding: 0; min-width: 0; padding-left:0 !important; background-color: #646b72 !important; text-align: center;}
            .el-menu-item-group__title{ display: none;}
			.el-menu--collapse{ width: 64px;}
			.v3-tabs{
				text-align: center;
				.el-button{ padding: 5px 15px; margin-top: 15px; margin-bottom: 8px; background: none; color: #ffffff;}
			}
        }
        .wrap-right{
			flex: 1; overflow: auto; display: flex; flex-direction: column; overflow-x: hidden;
			.el-main{ padding: 15px;}
            .el-row{
                height: 50px; box-sizing: border-box; background: #fff; border-bottom: 1px solid #ededed; display: flex; align-items: center; justify-content: space-between; padding: 0 0 0 14px;
			}
			.myTable{ border: 1px solid #dfe2ea;}
			.searchInfo{ background-color: #f4f4f4; border-bottom: none;}
			.tableStyle{ border: none;}
        }
    }
}
</style>
