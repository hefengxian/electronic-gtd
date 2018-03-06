<template>
  <div class="main">
    <div class="nav">
      <ul class="nav-top">
        <li>
          <avatar src="static/avatar/default.jpeg"/>
        </li>
        <li>
          <router-link to="/todo">
            <icon type="archive"></icon>
          </router-link>
        </li>
        <li>
          <router-link to="/landing-page">
            <icon type="help-circled"></icon>
          </router-link>
        </li>
      </ul>
      <ul class="nav-bottom">
        <li>
          <router-link to="/setting">
            <icon type="gear-a"></icon>
          </router-link>
        </li>
      </ul>
    </div>

    <router-view class="content"></router-view>
  </div>
</template>
<script>
  export default {
    name: 'main-layout',
    data () {
      return {}
    },
    components: {}
  }
</script>

<style lang="less">
  .flex-vertical {
    display: flex;
    flex-direction: column;
  }

  .main {
    height: 100vh;
    overflow: hidden;
    display: flex;
    font-size: 12px;

    & .content {
      flex: 1;
      width: 100%;
    }

    & .nav {
      background: #2a292a;
      padding: 16px 0;
      width: 55px;
      text-align: center;
      .flex-vertical;
      
      & a {
        color: #ccc;
      }

      & ul li {
        padding-top: 16px;
        font-size: 24px;
      }
      & .nav-top {
        flex: 1;
        & li:first-child {
          padding-top: 0;
        }
      }
      & .nav-bottom {
        flex: 1;
        .flex-vertical;
        justify-content: flex-end;
      }
    }
  }
</style>