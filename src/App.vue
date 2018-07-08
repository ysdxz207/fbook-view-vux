<template>
  <div id="app">
    <transition :name="transitionName">
      <navigation>
        <router-view></router-view>
      </navigation>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      transitionName: 'pop-in'
    }
  },
  created () {
    this.$navigation.on('forward', (to, from) => {
      this.transitionName = 'pop-in'
    })
    this.$navigation.on('back', (to, from) => {
      this.transitionName = 'pop-out'
    })
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './styles/theme.less';

body {
  background-color: #fbf9fe;
}
</style>
