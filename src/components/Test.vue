<template>
  <div class="test">
  </div>
</template>

<script>
import { XHeader, Group, Cell } from 'vux'

export default {
  components: {
    XHeader,
    Group,
    Cell
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
.test {
  height: 100%;


  /*background: rgba(255, 255, 255, 0.5);
  background-image: linear-gradient(90deg,
  rgba(200, 43, 7, 0.5) 50%, transparent 0),
  linear-gradient(
    rgba(200, 43, 7, 0.5) 50%, transparent 0);
  background-size: 360px 120px;
  background-repeat: no-repeat;*/

  background: #ffd680 linear-gradient(#ffe494 2px, transparent 0);
  background-size: 1px 5px;

}
</style>
