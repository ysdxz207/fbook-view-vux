<template>
  <div>
    <x-header title="登录"
              :left-options="{
                showBack: false,
                preventGoBack: true
              }"></x-header>
    <group>
      <x-input title="用户名" v-model="user.uname"></x-input>
      <x-input title="密码" v-model="user.upass" type="password"></x-input>
      <x-input title="验证码" v-model="user.captcha">
        <img slot="right-full-height" :src="captchaImg" @click="refreshCaptcha">
      </x-input>
    </group>
    <group>
      <x-button text="登录"
                type="primary"
                action-type="button"
                :gradients="['#FFBD17', '#FFC92A']"
                @click.native="login"
                :show-loading="showBtnLoading"
                style="width: 94%;"></x-button>
    </group>
    <group title="没有账号？">
      <box gap="10px 10px">
        <router-link :to="{ name: 'register'}" >
          去注册
        </router-link>
      </box>
    </group>

    <toast v-model="showTip" type="text">{{ tipMsg }}</toast>
  </div>
</template>

<script>
  import { XHeader, Group, XInput, XButton, Box, Toast } from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      XInput,
      XButton,
      Box,
      Toast
    },
    data () {
      return {
        user: {
          uname: '',
          upass: '',
          captcha: ''
        },
        captchaImg: this.ajax.defaults.baseURL + '/captcha.jpg',
        showBtnLoading: false,
        showTip: false,
        tipMsg: ''
      }
    },
    methods: {
      login () {
        let _this = this
        _this.showBtnLoading = true
        _this.ajax.post('/login', this.user)
          .then(function (response) {
            _this.showBtnLoading = false
            switch (response.data.statusCode) {
              case 200:
                localStorage.setItem('isLogin', true)
                _this.$router.push({path: '/'})
                break
              case 300:
                _this.user.captcha = ''
                if (response.data.errorCode === 'LOGIN_WRONG_CAPTCHA') {
                  // 刷新验证码
                  _this.refreshCaptcha()
                }
                _this.tipMsg = response.data.message
                _this.showTip = true
            }
          }).catch(function (error) {
            if (error) {
              console.log(error)
            }
            _this.showBtnLoading = false
          })
      },
      refreshCaptcha () {
        this.captchaImg = this.ajax.defaults.baseURL + '/captcha.jpg?' + new Date().getTime()
      }
    }
  }
</script>

<style lang="less">
  .vux-demo {
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px
  }
</style>
