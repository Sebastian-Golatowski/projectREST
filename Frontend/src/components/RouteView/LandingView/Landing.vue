<template>
  <Searchbar
    :onInput="HandleSearchBar"
  />
  <List
    :books="landing.books.list"
  />
</template>
<script>
import {useLandingStorage} from '@/storage/landing'
import Searchbar from './View/Searchbar.vue'
import List from './View/List.vue'
  export default {
    components: {Searchbar, List},
    data() {
        return({
          landing: useLandingStorage(),
        })
    },
    mounted() {
    },
    methods: {
      HandleSearchBar(e) {
        let value = e.target.value
        
        //get books from query and apply them to the landing.books.list
      }
    }
  }
</script>
<style scoped>
    
</style>