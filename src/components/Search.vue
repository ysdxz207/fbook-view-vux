<template>
  <div>
    <x-header :left-options="{backText: ''}"
              title="添加书籍"></x-header>

    <search placeholder="书名/作者"
            v-model="search.keywords"
            @on-submit="onSearch"
            @on-cancel="onCancel"
            ref="search"></search>

    <group>
      <cell primary="content"
            v-for="(book, index) in search.bookList"
            :border-intent="true"
            :key="index"
            style="font-size: 14px;padding-left: 4px"
            @click.native="gotoBookDetail(book)">
        <img slot="icon" class="search-book-img":src="book.faceUrl ? book.faceUrl : '/static/images/face_pic.png'">
        <span slot="title">{{ book.name }}|{{ book.bookInfo.category }}</span>
        <span slot="inline-desc">
          <p>作者：{{ book.author }}</p>
          <p>读者留存率：{{ book.bookInfo.retentionRatio > 0 ? book.bookInfo.retentionRatio + '%' : '未知' }}</p>
        </span>
      </cell>
    </group>

    <loading :show="showLoading" :text="loadingText"></loading>
    <alert v-model="showAlert"
           content="alertMsg"
           :hide-on-blur="true"></alert>
    <div class="search-book-error-message"
          v-show="showError">{{errorMessage}}</div>
  </div>
</template>

<script>
import { XHeader, Group, Cell, Search, Loading, Alert } from 'vux'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    Search,
    Loading,
    Alert
  },
  data () {
    return {
      search: {
        keywords: '',
        searching: false,
        bookList: []
      },
      showLoading: false,
      loadingText: '',
      showAlert: false,
      alertMsg: '',
      showError: false,
      errorMessage: ''
    }
  },
  mounted () {
    let _this = this
    // 缓存
    let searchList = localStorage.getItem('search_list')
    let keywords = localStorage.getItem('search_keywords')

    if (searchList) {
      _this.search.bookList = JSON.parse(searchList)
    }
    if (keywords) {
      _this.search.keywords = keywords
    }
  },
  methods: {
    onSearch () {
      let _this = this
      _this.showError = false
      _this.search.bookList = []
      _this.loading = '搜索中...'
      _this.showLoading = true
      _this.ajax.post('/search', {keywords: this.search.keywords})
        .then(function (response) {
          _this.showLoading = false
          switch (response.data.statusCode) {
            case 200:
              _this.search.bookList = response.data.list
              localStorage.setItem('search_list', JSON.stringify(_this.search.bookList))
              localStorage.setItem('search_keywords', _this.search.keywords)
              _this.$refs.search.setBlur()
              break
            default:
              _this.showError = true
              _this.errorMessage = '错误:' + response.data.message
          }
        }).catch(function (error) {
          _this.showLoading = false
          _this.showError = true
          _this.errorMessage = '错误:' + JSON.stringify(error)
        })
    },
    onCancel () {
      this.search.keywords = ''
      this.search.bookList = []
      document.querySelector('input[type=search]').blur()
    },
    gotoBookDetail (book) {
      this.$router.push({
        name: 'book',
        query: {
          bookId: book.id,
          bookIdThird: book.bookIdThird
        }
      })
    }
  }
}
</script>

<style>
.search-book-img {
  height: 80px;
  margin-right: 4px;
}

  .search-book-error-message {
    color: #c8c8c8;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    position: absolute;
    width: 100%;
    top: 25%;
  }
</style>
