<template>
  <div>
    <x-header :left-options="{
                showBack: false,
                preventGoBack: true
              }"
              title="我的书架"></x-header>

    <flexbox :gutter="0"
             orient="horizontal"
             direction="row"
             wrap="wrap"
             align="center">
      <flexbox-item :span="1/3"
                    v-for="book in bookList"
                    @click.native="goBookDetail(book)">
        <div class="book-container">
              <img class="book-img" :src="book.faceUrl"/>
              <div class="book-title" :style="(book.useApi == bookReadSetting.useApi) ? 'color:#ff9407' : 'color: #ddd'">{{ book.name }}</div>
        </div>
      </flexbox-item>
    </flexbox>

    <toast v-model="showTipWarn" type="warn">{{ tipWarnMsg }}</toast>

    <x-dialog v-model="showDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
      <p style="color:#fff;text-align:center;" @click="showDialog = false">
        <span style="font-size:30px;">{{ dialogMsg }}</span>
        <br>
        <br>
        <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
      </p>
    </x-dialog>

    <loading :show="showLoading" :text="loadingText"></loading>
  </div>
</template>

<script>
  import {XHeader, Box, Flexbox, FlexboxItem, Loading, XDialog, Toast} from 'vux'

  export default {
    components: {
      XHeader,
      Box,
      Flexbox,
      FlexboxItem,
      Loading,
      XDialog,
      Toast
    },
    mounted () {
      this.loadBooks()
    },
    data () {
      return {
        bookList: [],
        bookReadSetting: {},
        showTipWarn: false,
        tipWarnMsg: '',
        showDialog: false,
        dialogMsg: '',
        showLoading: false,
        loadingText: ''
      }
    },
    methods: {
      loadBooks () {
        let _this = this
        _this.showLoading = true
        _this.loadingText = '读取书架信息...'

        _this.ajax.get('/')
          .then(function (response) {
            switch (response.data.statusCode) {
              case 200:
                _this.showLoading = false
                _this.bookList = response.data.data.bookList
                _this.bookReadSetting = response.data.data.bookReadSetting
                break
              default:
                _this.showTipWarn = true
                _this.tipWarnMsg = response.data.message
                if (response.data.errorCode === 'LOGIN_WRONG_PASSWORD') {
                  localStorage.getItem('isLogin')
                  _this.$router.push({path: '/login'})
                }
            }
          }).catch(function (error) {
            _this.showLoading = false
            _this.showTipWarn = true
            _this.tipWarnMsg = '服务器异常:' + JSON.stringify(error)
          })
        return []
      },
      userInfo () {
        this.$router.push({path: '/user'})
      },
      goSearch () {
        let _this = this
        if (localStorage.getItem('search_list')) {
          localStorage.removeItem('search_list')
        }
        if (localStorage.getItem('search_keywords')) {
          localStorage.removeItem('search_keywords')
        }
        _this.$router.push({path: '/search'})
      },
      goBookDetail (book) {
        let _this = this

        let canRead = book.useApi === this.bookReadSetting.useApi

        if (!canRead) {
          let msg = book.useApi ? '[接口书籍]请将设置中使用接口源打开' : '[非接口书籍]请将设置中使用接口源关闭'
          _this.showDialog = true
          _this.dialogClass = msg
          return
        }

        _this.$router.push({
          path: '/book',
          query: {
            bookId: book.id,
            bookIdThird: book.bookIdThird
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/1px.less';


  .book-container {
    margin-top: 12px;
    margin-left: 6px;
    margin-right: 6px;
  }
  .book-img {
    box-shadow: 4px 4px 6px rgba(0,0,0,.45);
    width: 100%;
    height: 88%;
  }
  .book-title {
    text-align: center;
    width: 100%;
    font-size: 12px;
  }
</style>
