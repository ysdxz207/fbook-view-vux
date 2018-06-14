// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Axios from 'axios'

const Home = () => import('./components/Home.vue').then(m => m.default)
const Login = () => import('./components/Login.vue').then(m => m.default)
const Register = () => import('./components/Register.vue').then(m => m.default)
const Book = () => import('./components/Book.vue').then(m => m.default)
const Search = () => import('./components/Search.vue').then(m => m.default)
const User = () => import('./components/User.vue').then(m => m.default)

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
