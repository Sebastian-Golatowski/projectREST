<template>
  <div class="input">
    <div class="header">{{ header }}</div>
    <input type="text" :placeholder="placeholder"/>
  </div>
</template>
<script>
  export default {
    props: {
      placeholder: String,
      header: String,
    },
    data() {
        return({

        })
    }
  }
</script>
<style scoped>
    
</style>