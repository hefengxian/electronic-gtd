<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electronic-gtd-next',
    mounted () {
      this.$router.push('/todo')
    }
  }
</script>

<style lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all .2s ease;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(20px, 0, 0);
    opacity: 0;
  }
</style>
