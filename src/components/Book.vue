<template>
  <div>
    <x-header :left-options="{backText: ''}"
              title="书籍详情"></x-header>

    {{book.name}}
    <loading :show="showLoading" :text="loadingText"></loading>
    <toast v-model="showTip" type="text">{{ tipMsg }}</toast>
  </div>
</template>

<script>
import { XHeader, Toast, Loading } from 'vux'

export default {
  components: {
    XHeader,
    Toast,
    Loading
  },
  data () {
    return {
      book: {
        id: this.$route.query.bookId,
        bookIdThird: this.$route.query.bookIdThird,
        faceUrl: '',
        bookInfo: {
        }
      },
      showTip: false,
      tipMsg: '',
      showLoading: false,
      loadingText: ''
    }
  },
  mounted () {
    let _this = this
    _this.loadBookDetail()
  },
  methods: {
    loadBookDetail () {
      let _this = this
      _this.showLoading = true
      _this.loadingText = '读取书籍信息...'

      _this.ajax.post('/detail', {bookId: this.book.id, bookIdThird: this.book.bookIdThird})
        .then(function (response) {
          switch (response.data.statusCode) {
            case 200:
              _this.showLoading = false
              _this.book = response.data.data
              // 传递参数并加载书源信息
              _this.bus.$emit('bookSourceApi', _this.book)
              break
            default:
              _this.showLoading = false
              // $dialog.alert({
              //   content: '错误:' + response.data.message,
              //   okTheme: 'energized'
              // })
          }
        }).catch(function (error) {
          _this.showLoading = false

          console.log('服务器异常:' + JSON.stringify(error))
        // $dialog.alert({
          //   content: '服务器异常:' + JSON.stringify(error),
          //   okTheme: 'calm'
          // })
        })
    },
    addOrDelBook () {
      let _this = this
      _this.showLoading = true
      _this.loadingText = ''

      _this.ajax.post('/addOrDel', {bookIdThird: this.book.bookIdThird})
        .then(function (response) {
          switch (response.data.statusCode) {
            case 200:
              _this.book.onShelf = response.data.data
              break
            default:
              // $dialog.alert({
              //   content: '错误:' + response.data.message,
              //   okTheme: 'energized'
              // })
          }
          _this.showLoading = false
        }).catch(function (error) {
          _this.showLoading = false

          console.log('服务器异常:' + JSON.stringify(error))
          // $dialog.alert({
          //   content: '服务器异常:' + JSON.stringify(error),
          //   okTheme: 'calm'
          // })
        })
    },
    startRead () {
      this.$router.push({path: '/read',
        query: {
          bookId: this.book.id
        }})
    },
    showSourceList () {
      if (this.book.useApi) {
        this.modalSource.show()
      } else {
        this.showTip = true
        this.tipMsg = '非接口书籍请到设置中切换书源'
      }
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
