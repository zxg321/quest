<template>
  <div class="wxc-title" :aria-hidden="true">
    <image class="logo" :src="logo"></image>
    <text class="text">{{title}}</text>
  </div>
</template>

<style scoped>
  .wxc-title {
    margin-top: 30px;
    align-items: center;
    justify-content: center;
  }
  .logo {
    width: 552px;
    height: 54px;
  }
  .text {
    margin-top: 30px;
    font-size: 40px;
    font-weight: 600;
    color: #000000;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
</style>

<script>
import Config from '../config'
export default {
    data () {
        return {
            logo: Config.Img_Server + 'images/logo.png'
        }
    },
    props: {title: String}
}
</script>
