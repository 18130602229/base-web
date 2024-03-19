import Vue from 'vue'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
import App from './App.vue'

import store from './store'
import global from './utils/global'

import SIdentify from './utils/identify'
import 'normalize.css'

import './assets/css/comment.less'
Vue.use(ElementUI);
Vue.config.productionTip = false


/*全局变量，方法*/
Object.keys(global).forEach(key => {
    Vue.prototype[key] = global[key];
});
Vue.component("s-identify",SIdentify);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
