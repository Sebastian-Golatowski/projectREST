<template>
  <div class="content-land">
    <Searchbar
      :onInput="HandleSearchBar"
    />
    <List
      :books="landing.books.list"
      :callbackAddBook="addBookToUser"
    />
  </div>
  
</template>
<script>
import {useLandingStorage} from '@/storage/landing'
import Searchbar from './View/Searchbar.vue'
import List from './View/List.vue'
import { useBooksStorage } from '../../../storage/books'
import {useNotificationsStorage} from '@/storage/notifications'
  export default {
    components: {Searchbar, List},
    data() {
        return({
          landing: useLandingStorage(),
          books: useBooksStorage(),
          notification: useNotificationsStorage()
        })
    },
    methods: {
      async HandleSearchBar(e) {
        let value = e.target.value
        value.replace(' ', '+')
        let bookResponse = await fetch(`/api/book/search/${value}`, {
          method: 'GET',
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('token') 
          }
        })
        let booksData = await bookResponse.json()
        this.landing.setBooksData(booksData)
      },
      async addBookToUser(bookId) {
        let addBookResponse = await fetch(`/api/book`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                googleId: bookId
            })
        })
        let bodyData = await addBookResponse.json()
        if (addBookResponse.status != 201) this.notification.addNotification(bodyData)
        if (addBookResponse.status == 401) {
          localStorage.removeItem('token')
          this.$router.push('/login')
        }
      }  
    }
  }
</script>
<style scoped>
    
</style>