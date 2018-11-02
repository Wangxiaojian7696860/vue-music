<template>
  <div id="app">
    <Head/>
    <Tab/>
	<keep-alive><router-view></router-view></keep-alive>
	 <player></player>
  </div>
</template>

<script>
import Head from './components/Head/Head'
import Tab from './components/Tab/Tab'
import Player from './components/player/player'
export default {
  name: 'App',
  components: {
    Head,
	Tab,
	Player
  }
}
</script>

<style>
@import "./common/css/iconfont.css";  
</style>
