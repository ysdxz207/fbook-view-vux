<template>
  <div>
    <x-header :left-options="{
                showBack: false,
                preventGoBack: true
              }"></x-header>

    <box gap="16px 20px">
      <flexbox gutter="12"
               orient="horizontal"
               direction="row"
               wrap="wrap"
               align="center">
        <flexbox-item style="border: 1px solid #DDDDDD;width: 20%;height: 120px"
                      v-for="n in 10">{{n}}</flexbox-item>
      </flexbox>
    </box>
  </div>
</template>

<script>
import { XHeader, Box, Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    XHeader,
    Box,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
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
