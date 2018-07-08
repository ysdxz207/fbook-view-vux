<template>
  <div style="height: 100%;overflow-y: hidden;">
    <div @click="touchReadContent($event)"
         style="height: 100%;overflow-y: hidden;"
         :style="readConfig.readMainStyle"
    >

      <p class="title" v-text="bookData.chapter.title" :style="readConfig.readTitleStyle"></p>

      <swiper class="read-content-main"
              :style="readConfig.readContentStyle"
              height="100%"l
              :show-dots="false"
              v-model="currentPage">
        <swiper-item v-for="(page, index) in splitPages"
                     v-html="page.content"
                     :key="index">
        </swiper-item>
      </swiper>
    </div>
    <!-- 上部菜单 -->
    <popup position="top"
           height="10vh"
           :hide-on-blur="false"
           :show-mask="false"
           v-model="isShowMenu"
           style="background-color: #101010;color: #ffffff;">
        <flexbox >
          <flexbox-item>
              <x-icon type="ios-arrow-left"
                      size="30"
                      style="fill: #CCCCCC"
                      @click="goBack"></x-icon>
          </flexbox-item>
          <flexbox-item @click.native="showSourceList"
                        style="text-align: right;
                        padding-right: 8px;
                        line-height: 10vh">
            换源
          </flexbox-item>
        </flexbox>
    </popup>

    <!-- 下部主菜单 -->
    <popup position="bottom"
           height="14vh"
           :hide-on-blur="true"
           :show-mask="true"
           v-model="isShowMenu"
           style="background-color: #101010">
      <flexbox>
        <flexbox-item style="text-align: left;
        color: #FFFFFF;
        padding-left: 6px" @click.native="loadChapter(-1)">
          上一章
        </flexbox-item>
        <flexbox-item style="text-align: right;
        color: #FFFFFF;
        padding-right: 6px" @click.native="loadChapter(1)">
          下一章
        </flexbox-item>
      </flexbox>

      <flexbox style="font-size: 8vw">
        <flexbox-item style="text-align: left;
        color: #FFFFFF;
        padding-left: 6px;font-weight: bold" @click.native="togglePageMethod">{{ bookData.bookReadSetting.pageMethod }}</flexbox-item>
        <flexbox-item style="text-align: center;
        color: #FFFFFF;" @click.native="isShowMenuSub=true">Aa</flexbox-item>
        <flexbox-item style="text-align: right;
        color: #FFFFFF;
        padding-right: 6px;" @click.native="isShowChapterList=true">☰</flexbox-item>
      </flexbox>
    </popup>

    <!-- 下部字体菜单 -->
    <popup position="bottom"
           height="28vh"
           :hide-on-blur="true"
           :show-mask="true"
           v-model="isShowMenuSub"
           :popup-style="{zIndex: 502}"
           style="background-color: #101010"
           @on-hide="isShowMenu=true">
      <box gap="8px 8px">
        <color-picker :colors="bgColors"
                      v-model="currentBgColor"
                      size="middle"></color-picker>
        <box gap="4px 0px">
          <cell primary="content" title="字号" style="color: #FFFFFF">
            <range v-if="isShowMenuSub"
                   :rangeBarHeight="6"
                   v-model="bookData.bookReadSetting.fontSize"
                   :step="2"
                   :min="minFontSize"
                   :max="maxFontSize"
                   minHTML="<span style='font-size:14px;color:#FFFFFF;'>Aa</span>"
                   maxHTML="<span style='font-size:24px;color:#FFFFFF;'>Aa</span>"
                   @on-touchend="onFontSettingChange">
            </range>
          </cell>
        </box>
        <box gap="0px 0px">
          <cell primary="content" title="行距" style="color: #FFFFFF">
            <range v-if="isShowMenuSub"
                   :rangeBarHeight="6"
                   v-model="bookData.bookReadSetting.lineHeight"
                   :step="2"
                   :min="minLineHeight"
                   :max="maxLineHeight"
                   minHTML="<span style='font-size:14px;color:#FFFFFF;'>☰</span>"
                   maxHTML="<span style='font-size:24px;color:#FFFFFF;'>☰</span>"
                   @on-touchend="onFontSettingChange">
            </range>
          </cell>
        </box>
      </box>

    </popup>

    <!-- 侧边栏章节列表 -->
    <popup position="right"
           width="80vw"
           :hide-on-blur="true"
           :show-mask="true"
           v-model="isShowChapterList"
           @on-show="isShowMenu=false"
           @on-hide="forceHideMenu ? isShowMenu=false : isShowMenu=true,forceHideMenu=false">
        <div v-for="(chapter, index) in bookData.bookChapters.slice(0, 100)"
              :key="index"
              style="font-size: 14px;
              padding-left: 4px;height: 34px;
              line-height:34px;border-bottom: 1px solid #e2e2e2;
              vertical-align:middle;"
              @click="readChapter(chapter)">
            <div style="display: block;
            white-space: nowrap;overflow: hidden;
            text-overflow: ellipsis;width: 80%;float: left;">{{chapter.title}}</div>
            <div style="float: right;margin-right: 4px;text-align: right">
              <span v-if="chapter.hasRead" style="color: #CCCCCC">已读</span>
              <span v-if="!chapter.hasRead" style="color: green">未读</span>
            </div>
        </div>

    </popup>

    <loading :show="showLoading" :text="loadingText"></loading>
    <toast v-model="showTip" type="text">{{ tipMsg }}</toast>
  </div>
</template>

<script>
  import {
    XHeader,
    Loading,
    Toast,
    Swiper,
    SwiperItem,
    Popup,
    ColorPicker,
    Box,
    Range,
    Cell,
    Flexbox,
    FlexboxItem,
    Group
  } from 'vux'

  export default {
    components: {
      XHeader,
      Loading,
      Toast,
      Swiper,
      SwiperItem,
      Popup,
      ColorPicker,
      Box,
      Range,
      Cell,
      Flexbox,
      FlexboxItem,
      Group
    },
    data () {
      let _this = this
      return {
        forceHideMenu: false,
        isShowMenu: false,
        isShowMenuSub: false,
        keepMenu: false,
        isShowChapterList: false,
        showLoading: false,
        loadingText: '',
        showTip: false,
        tipMsg: '',
        bookData: {
          book: {
            id: _this.$route.query.bookId,
            chapterName: '',
            chapter: 1,
            content: '',
            bookInfo: {}
          },
          chapter: {},
          bookRead: {
            lastReadingChapterNum: 1
          },
          bookReadSetting: {
            pageMethod: '⇄',
            lineHeight: 20,
            fontSize: 20
          },
          bookChapters: []
        },
        readConfig: {
          readTitleStyle: {
            fontSize: '12px',
            paddingLeft: '8px',
            margin: '0px',
            height: '20px',
            textAlign: 'left',
            lineHeight: '20px'
          },
          readMainStyle: {
            backgroundColor: '#99a988',
            color: '#2f2f2f'
          },
          readContentStyle: {
            fontSize: '20px',
            lineHeight: '28px'
          }
        },
        chapterList: [],
        readContentObject: undefined,
        currentPage: 0,
        splitPages: [],
        wordsNum: 0,
        modalSource: undefined,
        bgColors: [
          '#99a988',
          '#7a7f6f',
          '#7d7567',
          '#817f79',
          '#1d2c29',
          '#16211c',
          '#161c27',
          '#322319'],
        colors: [
          '#2f2f2f',
          '#ffffff',
          '#2f2f2f',
          '#1b1b1b',
          '#f1efc3',
          '#e5e3b9',
          '#c7c5a1',
          '#bdbb99'],
        currentBgColor: '#99a988',
        minFontSize: 14,
        maxFontSize: 40,
        minLineHeight: 20,
        maxLineHeight: 40,
        fontSize: 14,
        lineHeight: 14,
        bgImg: ''
      }
    },
    mounted () {
      let _this = this
      _this.loadChapter(0)
    },
    watch: {
      currentBgColor: function (oldVal, newVal) {
        let _this = this
        let index = _this.bgColors.indexOf(_this.currentBgColor)
        let color = _this.colors[index]
        let bgColor = _this.currentBgColor
        _this.bookData.bookReadSetting.bgColor = bgColor
        _this.bookData.bookReadSetting.color = color
        _this.readConfig.readMainStyle.backgroundColor = bgColor
        _this.readConfig.readMainStyle.color = color
        if (index === 1) {
          _this.bgImg = '../assets/bg1.png'
        }
        _this.saveReadSetting(_this.bookData.bookReadSetting)
      }
    },
    created () {
      let _this = this
      _this.bus.$on('readScrollTop', function () {
        _this.readContentObject = document.querySelector('.read-content-main')
        _this.readContentObject.scrollTop = 0
      })
      // 菜单触发显示书源
      _this.bus.$on('menuTriggerShowModalSource', function () {
        _this.showSourceList()
      })
      // 隐藏书源并重新加载内容
      _this.bus.$on('hideModalSource', function () {
        _this.modalSource.hide()
        _this.loadChapter(0)
      })
    },
    updated () {
      this.minLineHeight = this.bookData.bookReadSetting.fontSize
      this.bookData.bookReadSetting.lineHeight = this.bookData.bookReadSetting.lineHeight < this.minLineHeight ? this.minLineHeight : this.bookData.bookReadSetting.lineHeight
    },
    methods: {
      loadReadContentAndSetting (chapterInfo) {
        let _this = this

        // 页码设置为0
        _this.currentPage = 0
        // 设置内容信息
        _this.bookData = chapterInfo
        // 设置样式
        _this.readConfig.readMainStyle.backgroundColor = chapterInfo.bookReadSetting.bgColor
        _this.readConfig.readMainStyle.color = chapterInfo.bookReadSetting.color
        _this.readConfig.readContentStyle.fontSize = parseInt(chapterInfo.bookReadSetting.fontSize) + 'px'
        _this.readConfig.readContentStyle.lineHeight = parseInt(chapterInfo.bookReadSetting.lineHeight) + 'px'

        // 加载章节列表
        _this.bus.$emit('chapterList', chapterInfo.bookChapters)
        // 滚动到顶部
        _this.bus.$emit('readScrollTop')
        // 关闭目录
        _this.bus.$emit('hide', {
          hideMenu: true,
          hideChapterList: true
        })
        // 拆分页面
        this.assemblePages(chapterInfo.chapter)
        // 预加载下一章
        _this.preFetchChapter()
      },
      loadChapter (direction) {
        let _this = this
        _this.isShowMenu = false
        // 加载下一章缓存
        let localNextChapter = localStorage.getItem('fbook_next_chapter')

        if (direction === 1 &&
          localNextChapter) {
          setTimeout(function () {
            _this.loadChapterFromLocalStorage(JSON.parse(localNextChapter))
          },
          200)
          return
        }

        _this.getChapterInfo({
          bookId: _this.bookData.book.id,
          lastReadingChapterNum: _this.bookData.bookRead.lastReadingChapterNum,
          lastChapterNum: _this.bookData.bookChapters.length,
          direction: direction,
          preLoad: false
        }, function (chapterInfo) {
          // 清空缓存
          localStorage.removeItem('fbook_next_chapter')

          _this.loadReadContentAndSetting(chapterInfo)
        })
      },
      touchReadContent (e) {
        let _this = this
        let readConfig = _this.bookData.bookReadSetting

        let tapX = e.clientX
        let tapY = e.clientY
        let tap = readConfig.pageMethod === '⇄' ? tapX : tapY

        let width = screen.width
        let height = screen.height
        let widthOrHeight = readConfig.pageMethod === '⇄' ? width : height

        // 点击屏幕中央唤起菜单
        if (tap < (widthOrHeight / 3 * 2) && tap > (widthOrHeight / 3 * 1)) {
          _this.isShowMenu = true
          return
        }

        if ((tap > (widthOrHeight / 3 * 2))) {
          // 下一页
          if (_this.currentPage >= _this.splitPages.length - 1) {
            // 下一章
            _this.loadChapter(1)
            return
          }
          _this.readContentObject.scrollTop = 0

          _this.currentPage += 1
          return
        }

        if (tap < (widthOrHeight / 3 * 1)) {
          // 上一页
          if (_this.currentPage === 0) {
            // 上一章
            _this.loadChapter(-1)
            return
          }
          _this.readContentObject.scrollTop = 0

          _this.currentPage -= 1
        }
      },
      assembleText (textContentText,
                   textContentTextLast,
                   textContent) {
        let _this = this
        // 减掉标题高度,手机多出了点，所以多减30
        let windowHeight = screen.height - parseInt(_this.readConfig.readTitleStyle.height) - 20
        let isOverFlow = textContent.offsetHeight > windowHeight
        let loop = true
        let char = ''
        let textContentTemp = ''
        let textContentAppendText = []

        // 创建新元素
        let textContentAppend = document.createElement('article')
        // 新元素添加class
        textContentAppend.classList.add('read-content-temp')
        // 设置样式
        for (let style in _this.readConfig.readContentStyle) {
          textContentAppend.style[style] = _this.readConfig.readContentStyle[style]
        }

        while (loop) {
          if (isOverFlow) {
            // 移除最后一个字符
            char = textContentText.pop()
            // 准备把最后一个字符赋值给新元素
            textContentAppendText.unshift(char)
          } else {
            // 移除剩余内容的第一个字符
            char = textContentTextLast.shift()
            // 剩余内容的第一个字符赋值给原元素
            textContentText.push(char)
          }

          // 重新组装新原元素内容
          textContentTemp = textContentText.join('')
          // 组装后内容赋值给第一个元素
          textContent.innerText = textContentTemp
          // 更新溢出状态
          if (isOverFlow) {
            loop = textContent.offsetHeight > windowHeight
          } else {
            loop = textContent.offsetHeight < windowHeight
          }
        }

        if (isOverFlow) {
          textContentAppend.innerText = textContentAppendText.join('') + textContentTextLast.join('')
        } else {
          // 因为多加了一个字符，所以要减掉
          textContentText = textContent.innerText.split('')
          let overChar = textContentText.pop()
          textContent.innerText = textContentText.join('')
          textContentTextLast.unshift(overChar)
          textContentAppend.innerText = textContentTextLast.join('')
        }

        return textContentAppend
      },
      splitScreenPage (textContent) {
        let _this = this

        let textContentText = textContent.innerText

        let textContentTextLast = textContentText.substring(_this.wordsNum)

        // 截取相对第一页大概的内容并赋值给原元素
        textContentText = textContentText.substring(0, _this.wordsNum)
        textContent.innerText = textContentText
        // 拆分原元素内容为数组
        textContentText = textContentText.split('')
        // 拆分剩下元素内容为数组
        textContentTextLast = textContentTextLast.split('')

        // 判断是否超出或没满框
        return _this.assembleText(textContentText,
          textContentTextLast,
          textContent)
      },
      assemblePages (chapter) {
        let _this = this
        _this.showLoading = true
        _this.loadingText = '处理分页中...'
        // 清空缓存
        localStorage.removeItem('fbook_next_chapter')
        _this.splitPages = []
        let windowWidth = screen.width
        let windowHeight = screen.height - parseInt(_this.readConfig.readTitleStyle.height)
        let lineHeight = parseInt(_this.readConfig.readContentStyle.lineHeight)
        let fontSize = parseInt(_this.readConfig.readContentStyle.fontSize)

        // 计算一页大概多少字
        _this.wordsNum = parseInt((windowWidth * windowHeight) / (lineHeight * fontSize))
        // 剩余内容
        // 内容分页
        let readContent = document.querySelector('.read-content-main')

        let pageContent = document.createElement('article')
        // 设置样式
        for (let style in _this.readConfig.readContentStyle) {
          pageContent.style[style] = _this.readConfig.readContentStyle[style]
        }
        pageContent.innerHTML = chapter.content
        readContent.appendChild(pageContent)

        let temps = []
        temps.push(pageContent)

        while (pageContent.offsetHeight > windowHeight) {
          pageContent = _this.splitScreenPage(pageContent)
          readContent.appendChild(pageContent)
          temps.push(pageContent)
        }

        while (temps.length > 0) {
          let page = temps.shift()
          readContent.removeChild(page)
          _this.splitPages.push({index: _this.splitPages.length + 1, content: page.innerText.replace(/\n/g, '<br/>')})
        }
        setTimeout(function () {
          _this.showLoading = false
        }, 1000)
      },
      preFetchChapter () {
        let _this = this
        _this.preFetchChapterInfo({
          bookId: _this.bookData.book.id,
          lastReadingChapterNum: _this.bookData.bookRead.lastReadingChapterNum,
          direction: 1,
          preLoad: true
        }, function (chapterInfo) {
          chapterInfo.bookReadSetting = _this.bookData.bookReadSetting
          localStorage.setItem('fbook_next_chapter', JSON.stringify(chapterInfo))
        })
      },
      loadChapterFromLocalStorage (chapterInfo) {
        let _this = this
        _this.showLoading = true
        _this.loadingText = '读取缓存...'
        // 保存在读章节
        chapterInfo.bookRead.lastReadingChapterNum += 1
        chapterInfo.bookRead.lastReadingChapter = chapterInfo.chapter.title
        // 当前页修改设置应用到下一章缓存
        chapterInfo.bookReadSetting = _this.bookData.bookReadSetting

        _this.ajax({
          method: 'post',
          url: '/saveBookRead',
          data: chapterInfo.bookRead

        }).then(function (response) {
          // 不论成功与否
          _this.loadReadContentAndSetting(chapterInfo)
          _this.showLoading = false
        }).catch(function (ignore) {
          _this.showLoading = false
        })
      },
      showSourceList () {
        if (this.bookData.book.useApi) {
          this.modalSource.show()
        } else {
          this.showTip = true
          this.tipMsg = '非接口书籍请到设置中切换书源'
        }
      },
      togglePageMethod () {
        let _this = this
        _this.bookData.bookReadSetting.pageMethod = _this.bookData.bookReadSetting.pageMethod === '⇄' ? '⇅' : '⇄'
        _this.saveReadSetting(_this.bookData.bookReadSetting)
      },
      onFontSettingChange () {
        // 重新分页
        this.readConfig.readContentStyle.fontSize = this.bookData.bookReadSetting.fontSize + 'px'
        this.readConfig.readContentStyle.lineHeight = this.bookData.bookReadSetting.lineHeight + 'px'
        this.assemblePages(this.bookData.chapter)
        this.saveReadSetting(this.bookData.bookReadSetting)
      },
      readChapter (chapter) {
        let _this = this
        _this.getChapterInfo({
          bookId: chapter.bookId,
          chapterNum: chapter.chapterNum,
          lastChapterNum: _this.chapterList.length
        }, function (chapterInfo) {
          // 关闭目录
          _this.isShowChapterList = false
          // 关闭菜单
          _this.forceHideMenu = true
          // 更新内容
          _this.bookData = chapterInfo
          // 拆分页面
          _this.assemblePages(chapterInfo.chapter)
          // 滚动到顶部
          _this.bus.$emit('readScrollTop')
        })
      },
      goBack () {
        this.$router ? this.$router.back() : window.history.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/transition.less';

  .read-content-main {
    height: 100%;
  }

  .vux-header {
    background-color: #101010;
  }
  .weui-cell {
    padding-left: 0px;
  }
  .vux-range-input-box {
    margin-left: 10px
  }
</style>
