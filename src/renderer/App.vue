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

<style>
  /* CSS */
</style>
