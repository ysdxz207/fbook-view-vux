// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Axios from 'axios'
import { ToastPlugin, LoadingPlugin, AlertPlugin } from 'vux'
import vuescroll from 'vuescroll'

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(vuescroll)

const Home = () => import('./components/Home.vue').then(m => m.default)
const Login = () => import('./components/Login.vue').then(m => m.default)
const Register = () => import('./components/Register.vue').then(m => m.default)
const Book = () => import('./components/Book.vue').then(m => m.default)
const Search = () => import('./components/Search.vue').then(m => m.default)
const User = () => import('./components/User.vue').then(m => m.default)
const Read = () => import('./components/Read.vue').then(m => m.default)
const Test = () => import('./components/Test.vue').then(m => m.default)

Vue.use(VueRouter)

const routes = [{
  name: 'home',
  path: '/',
  component: Home
},
{
  name: 'login',
  path: '/login',
  component: Login
},
{
  name: 'register',
  path: '/register',
  component: Register
},
{
  name: 'book',
  path: '/book',
  component: Book
},
{
  name: 'search',
  path: '/search',
  component: Search
},
{
  name: 'user',
  path: '/user',
  component: User
},
{
  name: 'read',
  path: '/read',
  component: Read
},
{
  name: 'test',
  path: '/test',
  component: Test
}]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')

/// /////////////////
// axios
const ajax = Axios.create({
  baseURL: process.env.BASE_URI,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Accept': 'application/json'
  },
  params: {},
  transformRequest: [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }],
  withCredentials: true// 解决跨域session不一致问题
})

Vue.prototype.ajax = ajax

/**
 *
 * @param params
 *      {
 *          bookId: '',
 *          lastChapterNum: 1000,
 *          direction: '',//可选
 *          chapterNum: 3,//可选
 *          lastReadingChapterNum: 1//可选
 *      }
 * @param callback
 */
Vue.prototype.getChapterInfo = function (args, callback) {
  this.$vux.loading.show({
    text: '加载中...'
  })
  let _this = this
  args = Vue.util.extend({lastReadingChapterNum: 1}, args)

  if (args.lastReadingChapterNum === 0 &&
    args.direction === -1) {
    _this.$vux.toast.text('已经是第一章了', 'top')
    return
  }

  if (args.lastReadingChapterNum ===
    args.lastChapterNum &&
    args.direction === 1) {
    _this.$vux.toast.text('已经是最后一章了', 'top')
    return
  }

  let params = {}
  if (args.direction &&
    args.direction !== 0) {
    params.chapter = args.lastReadingChapterNum + args.direction
  } else if (args.direction === undefined) {
    params.chapter = args.chapterNum
  }

  params.bookId = args.bookId
  params.preLoad = args.preLoad

  _this.ajax({
    method: 'post',
    url: '/chapter',
    data: params

  }).then(function (response) {
    _this.$vux.loading.hide()
    switch (response.data.statusCode) {
      case 200:
        let data = response.data.data
        callback(data)
        break
      case 300:
        _this.$vux.alert.show({
          title: '提示',
          content: '错误:' + response.data.message
        })
    }
  }).catch(function (error) {
    _this.$vux.loading.hide()

    _this.$vux.alert.show({
      title: '提示',
      content: '服务器异常:' + JSON.stringify(error)
    })
  })
}

Vue.prototype.preFetchChapterInfo = function (args, callback) {
  let _this = this
  args = Vue.util.extend({lastReadingChapterNum: 1}, args)

  if (args.lastReadingChapterNum === 1 &&
    args.direction === -1) {
    localStorage.setItem('fbook_is_first_page', 'true')
    return
  }

  if (args.lastReadingChapterNum ===
    args.lastChapterNum &&
    args.direction === 1) {
    localStorage.setItem('fbook_is_last_page', 'true')
    return
  }

  let params = {}
  if (args.direction &&
    args.direction !== 0) {
    params.chapter = args.lastReadingChapterNum + args.direction
  } else if (args.direction === undefined) {
    params.chapter = args.chapterNum
  }

  params.bookId = args.bookId
  params.preLoad = args.preLoad

  _this.ajax({
    method: 'post',
    url: '/chapter',
    data: params

  }).then(function (response) {
    switch (response.data.statusCode) {
      case 200:
        let data = response.data.data
        callback(data)
        break
      default:
        localStorage.removeItem('fbook_next_chapter')
    }
  }).catch(function (ignore) {
    localStorage.removeItem('fbook_next_chapter')
  })
}

// 保存配置
Vue.prototype.saveReadSetting = function (bookReadSetting, callback) {
  let _this = this
  _this.ajax({
    method: 'post',
    url: '/saveReadingSetting',
    data: bookReadSetting

  }).then(function (response) {
    switch (response.data.statusCode) {
      case 200:
        if (callback) {
          callback()
        }
        break
      case 300:
        _this.$vux.toast.text('保存读书配置错误:' + response.data.message, 'top')
    }
  }).catch(function (error) {
    _this.$vux.toast.text('保存读书配置错误(服务器):' + JSON.stringify(error), 'top')
  })
}
// 创建一个事件中转站，便于组件之间传递数据
Vue.prototype.bus = new Vue()
