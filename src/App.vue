<template>
  <HomePage msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HomePage from "@/components/HomePage";

export default {
  name: 'App',
  components: {
    HomePage
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: rgb(223, 224, 230);
  height: 100vh;
  width: 100vw;
}
</style>
