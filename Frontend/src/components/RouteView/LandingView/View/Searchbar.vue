<template>
  <div class="search-engine">
    <input type="text" placeholder="Search" class="search-engine-input" @keyup.enter="onInput"/>
  </div>
</template>
<script>
  export default {
    props: {
      onInput: Function
    },
  }
</script>
<style scoped>
    .search-engine {
      width: 100%;
    }

    .search-engine-input {
      width: calc((100% - 10vw) / 6);
      background-color: var(--main-element-bg);
      color: white;
      font-weight: 500;
      font-size: .9vw;
      border: 0;
      outline: 0;
      padding: .5vw .75vw;
      margin: 0;
    }
</style>