<template>
  <Notifications/>
  <RouterView />
</template>
<script>
import { RouterView } from 'vue-router'
import {useBaseStorage} from '@/storage/base'
import {useUserStorage} from '@/storage/user'
import {useBooksStorage} from '@/storage/books'
import {useLandingStorage} from '@/storage/landing'
import {useNotificationsStorage} from '@/storage/notifications'
import Notifications from '@/components/Notifications.vue'
import { fetchToBackend } from './utils'
export default {
  components: {Notifications}, 
  data() {
    return({
      base: useBaseStorage(),
      user: useUserStorage(),
      books: useBooksStorage(),
      landing: useLandingStorage(),
      notifications: useNotificationsStorage(),
    })
  },
  async created() {
    this.$nextTick(async ()=> {
      let userResponse = await fetch('/api/user', {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token') 
        }
      })
      console.log(userResponse);
      
      if (userResponse.status == 401) {
        console.log('pizda');
        
        localStorage.removeItem('token')
        this.$router.push('/login')
      } else {
        let data = await userResponse.json()
        this.user.setUserName(data.username)
      }
      
      
      let response = await fetch('https://use.fontawesome.com/releases/v5.15.4/js/all.js', {
        method: 'GET'
      })
      let code = await response.text()

      let fontawesomeAPI = document.createElement('script')
      fontawesomeAPI.type = 'text/javascript'
      fontawesomeAPI.innerHTML = code
      document.head.appendChild(fontawesomeAPI)
    })
  },
  updated() {
    
  },
  methods: {
    //update storage when it's needed
  }
}
</script>