// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
Vue.prototype.$http = axios
//路由引入
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Recommend from './components/Recommend/Recommend'
import Disc from './components/disc/disc'
import Singer from './components/Singer/Singer'
import SingerDetail from './components/singer-detail/singer-detail'
import Rank from './components/Rank/Rank'
import Search from './components/Search/Search'
const router = new VueRouter({
  routes: [
    { path: '/recommend', component: Recommend,
	  children: [
		{		 
		   path: ':id',
		   component:Disc
		}
	  ]
	},
	{ path: '/singer', component:Singer,
	  children: [
		{		 
		   path: ':id',
		   component:SingerDetail
		}
	  ]	
	},
	{ path: '/rank', component:Rank},
	{ path: '/search', component: Search},
	{ path: '/', redirect: '/recommend'}
  ]
})

//vuex使用
import Vuex from 'vuex'
Vue.use(Vuex)
import {state,mutations,getters,actions} from './store/index.js'
const store = new Vuex.Store({
		state,
		mutations,
		getters,
		actions
})

Vue.config.productionTip = false
import './common/css/index.scss';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
