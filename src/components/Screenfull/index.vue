<template>
  <div>
    <svg-icon :style="{
        color:
          settings.sideTheme === 'theme-dark'
            ? variables.menuText
            : 'rgba(0,0,0,.65)',
      }" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
import { mapState } from "vuex";
import variables from "@/assets/styles/variables.scss";
export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  computed:{
    ...mapState(["settings"]),
    variables() {
      return variables;
    },
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
