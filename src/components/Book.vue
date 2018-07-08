<template>
  <div>
    <x-header :left-options="{backText: ''}"
              title="书籍详情"></x-header>



    <div style="padding: 18px">
      <flexbox :gutter="16">
        <flexbox-item :span="4/10">
          <img :src="book.faceUrl" class="book-detail-img"/>
        </flexbox-item>
        <flexbox-item align="stretch">
          <div class="book-detail-name">{{ book.name }}</div>
          <div class="book-detail-item book-detail-author"><strong v-text="book.author"></strong>
            | <span class="book-detail-category" v-text="book.bookInfo.category"></span>
          </div>
          <div class="book-detail-item book-detail-updated">更新：{{book.bookInfo.updated}}</div>
          <div class="book-detail-item book-detail-new">最新章：{{book.bookInfo.lastUpdateChapter}}</div>

        </flexbox-item>
      </flexbox>

      <flexbox :gutter="16"
               orient="vertical">
        <flexbox-item class="book-detail-ratio">
          读者留存率：{{ book.bookInfo.retentionRatio ? book.bookInfo.retentionRatio + '%' : '未知' }}
        </flexbox-item>
        <flexbox-item>
          <flexbox>
            <flexbox-item>
              <x-button style="font-size: 5vw;"
                        @click.native="addOrDelBook()"
                        :style="book.onShelf ? 'background-color: #ffbd17;color: #FFFFFF' : 'background-color: #1AAD19;color: #FFFFFF'">
                {{book.onShelf ? '不追了' : '追书'}}
              </x-button>

            </flexbox-item>
            <flexbox-item>
              <x-button text="开始阅读"
                        style="font-size: 5vw;
                        background-color: #484746;
                        color: #ffffff;"
                        @click.native="startRead()"></x-button>

            </flexbox-item>
          </flexbox>
        </flexbox-item>
        <flexbox-item>
          <p v-text="book.bookInfo.description" class="book-detail-description"></p>
        </flexbox-item>
      </flexbox>
    </div>

    <masker color="#fbf9fe"
            :opacity="1"
            :fullscreen="true"
            v-show="showLoading">
      <div slot="content"
           style="color: #c8c8c8;
           text-align: center;
           font-weight: 500;
           font-size: 16px;
           position: absolute;
           width: 100%;
           top: 5%;">
        加载中...
      </div>
    </masker>
    <toast v-model="showTip" type="text">{{ tipMsg }}</toast>
  </div>
</template>

<script>
  import {
    XHeader,
    Toast,
    Flexbox,
    FlexboxItem,
    Box,
    XButton,
    Masker
  } from 'vux'

  export default {
    components: {
      XHeader,
      Toast,
      Flexbox,
      FlexboxItem,
      Box,
      XButton,
      Masker
    },
    data () {
      return {
        book: {
          id: this.$route.query.bookId,
          bookIdThird: this.$route.query.bookIdThird,
          faceUrl: '',
          bookInfo: {}
        },
        showTip: false,
        tipMsg: '',
        showLoading: true,
        transitionName: 'slide-right'
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
        this.$router.push({
          path: '/read',
          query: {
            bookId: this.book.id
          }
        })
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

<style lang="less">
  @import '../styles/transition.less';

  .book-detail-img {
    width: 100%;
  }
  .book-detail-name {
    color: #333333;
    font-size: 6vw;
    font-weight: bold;
  }

  .book-detail-author {
    font-size: 4vw;
    color: #333333;
  }

  .book-detail-category {
    color: #333333;
  }

  .book-detail-updated {
    font-size: 4vw;
    color: #333333;
  }

  .book-detail-new {
    font-size: 5vw;
    color: #333333;
  }

  .book-detail-ratio {
    color: #525252;
    margin: 0px;
  }


</style>
