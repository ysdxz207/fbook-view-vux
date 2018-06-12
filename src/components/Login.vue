<template>
  <div>
    <x-header style="background-color:#000;"
              title="登录"
              :left-options="{
                showBack: false,
                preventGoBack: true
              }"></x-header>
    <group>
      <x-input title="用户名"></x-input>
      <x-input title="密码"></x-input>
      <x-input title="验证码">
        <img slot="right-full-height" :src="captchaImg">
      </x-input>
    </group>
    <group>
      <x-button text="登录"
                type="primary"
                action-type="button"
                :gradients="['#FFBD17', '#FFC92A']"></x-button>
    </group>
    <group title="没有账号？">
      <box gap="10px 10px">
        <router-link :to="{ name: 'register'}" >
          去注册
        </router-link>
      </box>
    </group>
  </div>
</template>

<script>
  import {XHeader, Group, XInput, XButton, Box} from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      XInput,
      XButton,
      Box
    },
    data () {
      return {
        user: {
          uname: '',
          upass: '',
          captcha: '',
          captchaImg: this.ajax.defaults.baseURL + '/captcha.jpg'
        }
      }
    },
    methods: {
      login () {
        let _this = this
        _this.ajax.post('/login', this.user)
          .then(function (response) {
            switch (response.data.statusCode) {
              case 200:
                localStorage.setItem('isLogin', true)
                // $router.forward({path: '/'})
                break
              case 300:
                _this.user.captcha = ''
                if (response.data.errorCode === 'LOGIN_WRONG_CAPTCHA') {
                  // 刷新验证码
                  _this.refreshCaptcha()
                }
                // $dialog.alert({
                //   content: '错误:' + response.data.message,
                //   okTheme: 'energized'
                // })
            }
          }).catch(function (error) {
            if (error) {
              console.log(error)
            }
          })
      },
      refreshCaptcha () {
        this.captchaImg = this.ajax.defaults.baseURL + '/captcha.jpg?' + new Date().getTime()
      }
    }
  }
</script>

<style>
  .vux-demo {
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px
  }
</style>
