<template>
	<el-row class="wrap-left">
    <el-col class="v3-tabs"> <TopNav /> </el-col>
		<el-col :span="24" class="h100">
			<el-menu
			class="no-boarder el-menu-vertical-demo h100"
			router
			unique-opened
			@open="handleOpen"
			@close="handleClose"
			background-color="#545c64"
			text-color="#fff"
			:default-active="activeTag"
			ref="mySidemenu"
			:collapse="!isNavMenuOpen"
			active-text-color="#ffd04b">
				<el-submenu v-for="item in menus" :index="item.name" :key="item.name">
					<template slot="title">
						<i :class="item.meta.icon"></i>
						<span v-text="item.meta.title"></span>
					</template>
					<el-menu-item-group class="over-hide" v-for="sub in item.sub" :key="sub.name">
						<el-menu-item :index="sub.meta.index" v-text="sub.meta.title"></el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-col>
	</el-row>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import TopNav from './top-nav'
  import {axios} from '../config/axios'
  let oneMenuMap = new Map();
  // let menus = [];
  export default {
    components: {
			TopNav
		},
    data () {
      return {
          menus: [],
      }
    },created: function () {
		  this.getMenu();
      },
    computed: {
      ...mapGetters(['activeTag']),
      ...mapState(['isNavMenuOpen'])
    },
    watch: {
      activeTag: function (newValue, oldValue) {
        this.$nextTick(() => {
          this.$refs.mySidemenu.activeIndex = this.activeTag
        })
      }
    },
    methods: {
      handleOpen (key, keyPath) {
       // console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
       // console.log(key, keyPath)
      },
		getMenu(){
          	if (this.menus.length === 0){
                axios.get('/permission',{params:{type:0}}).then(result => {
                    if (result.code !== 200){
                        console.log(result);
                    }
                    let menuData = result.data;
                    menuData.forEach(item =>{
                        let oneMenu = {};
                        let meta = {};
                        if (item.parentId === 0){
							meta["icon"]=item.menuIcon;
                            meta["title"]=item.permission;
                            oneMenu["meta"] = meta;
                            oneMenu["name"]=item.permission;
                            oneMenu["sub"] = [];
                            oneMenuMap.set(item.id,this.menus.length);
                            this.menus.push(oneMenu);
                        }else {
                            const index = oneMenuMap.get(item.parentId);
                            let sub = this.menus[index].sub;
                            meta['icon'] = item.menuIcon;
                            meta['index'] = item.url;
                            meta['type'] = 'menu';
                            meta['active'] = false;
                            meta["title"]=item.permission;
                            oneMenu['meta'] = meta;
                            oneMenu['name'] =item.url;
                            sub.push(oneMenu);
                        }
                    })
                    localStorage.setItem("blackview-menu",this.menus);
                }).catch(err => {
                    console.log(err);
                });
			}
		}
    }
  }
</script>
