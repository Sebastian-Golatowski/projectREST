<template>
  <RouterView />
</template>
<script>
import { RouterView } from 'vue-router'
import {useBaseStorage} from '@/storage/base'
import {useUserStorage} from '@/storage/user'
import {useBooksStorage} from '@/storage/books'
import {useLandingStorage} from '@/storage/landing'
export default {
  data() {
    return({
      base: useBaseStorage(),
      user: useUserStorage(),
      books: useBooksStorage(),
      landing: useLandingStorage()
    })
  },
  created() {
<<<<<<< Updated upstream
    this.$router.push('/login')
=======
    this.$router.push('/main/landing')
>>>>>>> Stashed changes
    this.$nextTick(()=> {
      //handle user storage and set token + expire date
    })
  },
  updated() {
    // update expire date + 1 day if it's closer to end
  },
  methods: {
    //update storage when it's needed
  }
}
</script>