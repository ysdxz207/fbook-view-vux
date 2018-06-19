<template>
  <div>
    <x-header :left-options="{backText: ''}"
              title="添加书籍"></x-header>

    <search placeholder="书名/作者"
            v-model="search.keywords"
            @on-submit="onSearch"
            @on-cancel="onCancel"></search>

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
      alertMsg: ''
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
              break
            default:
              _this.alertMsg = '错误:' + response.data.message
              _this.showAlert = true
          }
        }).catch(function (error) {
          _this.showLoading = false
          _this.alertMsg = '服务器异常:' + JSON.stringify(error)
          _this.showAlert = true
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
</style>
