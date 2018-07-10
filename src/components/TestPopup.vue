<template>
  <div>
    <button @click="show10=true">显示</button>


    <div v-transfer-dom>
      <popup v-model="show10" position="top" :show-mask="false"
      style="position: absolute;top: .0001em;">
        <div class="position-vertical-demo">
          I'm on top. Hide in 1s.
        </div>
      </popup>
    </div>

  </div>
</template>

<script>
  import { TransferDom, Popup, Group, Cell, XButton, XSwitch, Toast, XAddress, ChinaAddressData } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      Group,
      Cell,
      XSwitch,
      Toast,
      XAddress,
      XButton
    },
    data () {
      return {
        addressData: ChinaAddressData,
        show: false,
        show1: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
        title6: '默认空的',
        value6: [],
        show7: false,
        showToast: false,
        show8: false,
        show9: false,
        show10: false,
        show11: false,
        show12: false,
        show13: false,
        show14: false,
        show15: false,
        show16: false,
        show17: false
      }
    },
    methods: {
      showit () {
        this.$emit('show1')
      }
    },
    created () {
      let _this = this
      _this.$on('show1', function () {
        _this.show10 = true
      })
    },
    watch: {
      show10 (val) {
        if (val) {
          console.log(val)
          setTimeout(() => {
            this.show10 = false
          }, 1000)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/close.less';
  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 15px;
  }

  .vux-popup-animate-top-enter-active {
    transform: translate3d(0, 0, 0);
    transition: all .3s;
  }
  .vux-popup-animate-top-enter, .vux-popup-animate-top-leave-active {
    transform: translate3d(0, -99%, 0);
  }
</style>
