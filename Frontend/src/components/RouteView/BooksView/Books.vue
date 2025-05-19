<template>
  <div class="books-view">
    <div class="list">
      <div class="list-element" v-for="(book, key) in books.list" :key="key" @click="setBookAsSelected(book)" :class="{active: book.googleId == books.selected.googleId}">
        <template v-if="book.thumbnail">
          <img :src="book.thumbnail">
        </template>
        <template v-else>
          <div class="icon">
            <i class="fas fa-book"></i>
          </div>
        </template>
        <div class="col">
          <div class="title">{{ book.title }}</div>
          <div class="author">{{ book.authors ? (book.authors[0] ? book.authors[0] : 'TBA') : 'TBA' }}</div>
          <div class="rating">Rating {{ book.rating ? book.rating : 'W Ratio' }}</div>
        </div>
      </div>
    </div>
    <div class="book-content">
      <template v-if="books.selected.googleId">
        <div class="img-and-text">
          <template v-if="books.selected.thumbnail">
          <img :src="books.selected.thumbnail">
        </template>
        <template v-else>
          <div class="icon">
            <i class="fas fa-book"></i>
          </div>
        </template>
          <div class="book-data">
            <div class="title">{{ books.selected.title }}</div>
            <div class="author">{{ books.selected.authors ? (books.selected.authors[0] ? books.selected.authors[0] : 'TBA') : 'TBA' }}</div>
            <div class="description" v-html="books.selected.description ? books.selected.description : 'Google was to lazy to put description for your selected book. Please contact them instead of us, cheers <3.'"></div>
          </div>
        </div>
        <div class="misc">
          <div class="header-box">
            <div class="header">Notes</div>
            <div class="text">Add notes to your book</div>
          </div>
          <textarea placeholder="Notes" id="book_notes" @keydown="handleIntervalForTextArea"/>
          <button @click="handleBookRemoval(books.selected.bookId)" >Remove Book</button>
        </div>
      </template>
      <template v-else>
        <div class="text">Select book</div>
      </template>
    </div>
  </div>
</template>
<script>
import {useNotificationsStorage} from '@/storage/notifications'
import { useBooksStorage } from '../../../storage/books';
  export default {
    data() {
        return({
          books: useBooksStorage(),
          notesTimeout: false,
          notesPromise: false,
          notification: useNotificationsStorage()
        })
    },
    async mounted() {
      this.getBooks()
    },
    methods: {
      async getBooks() {
        let bookResponse = await fetch(`/api/book/dashboard`, {
          method: 'GET',
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('token') 
          }
        })
        if (bookResponse.status == 401) {
          localStorage.removeItem('token')
          this.$router.push('/login')
        } else {
          let booksData = await bookResponse.json()
          this.books.setList(booksData)
        }
      },
      handleIntervalForTextArea() {
        
        if (this.notesTimeout) {
          clearTimeout(this.notesTimeout)
        }
        this.notesTimeout = setTimeout(()=> {
            this.setNoteForBook()
        }, 2000)
      },
      async setNoteForBook(cb) {
        let value = document.getElementById('book_notes').value
        if (!value) {
          if (cb) cb()
          return
        }
        let addNotesResponse = await fetch(`/api/note`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              body: value,
              bookId: this.books.selected.bookId
            })
        })
        let bodyData = await addNotesResponse.json()
        if (addNotesResponse.status != 200) {
          this.notification.addNotification(bodyData)
          if (cb) {
            cb()
          }
        }
        if (addNotesResponse.status == 200) {
          if (cb) {
            cb()
          }
        }
        if (addNotesResponse.status == 401) {
          localStorage.removeItem('token')
          this.$router.push('/login')
        }
        
        this.notesTimeout = false
      },
      async setBookAsSelected(bookData) {
        if (this.notesPromise) return this.notification.addNotification({message: 'You need to wait a bit!'})
        if (!this.books.selected.bookId) {
          this.books.setSelected(bookData)
          let getNotesResponse = await fetch(`/api/note/${bookData.bookId}`, {
              method: 'GET',
              headers: {
                  "Authorization": "Bearer " + localStorage.getItem('token')
              }
          })
          let bodyData = await getNotesResponse.json()
          
          if (getNotesResponse.status != 200) this.notification.addNotification(bodyData)
          if (getNotesResponse.status == 200) {
            document.getElementById('book_notes').value = bodyData.note.body
          }
          if (getNotesResponse.status == 401) {
            localStorage.removeItem('token')
            this.$router.push('/login')
          }
        } else {
          this.notesPromise = new Promise((resolve=> {
            this.setNoteForBook(()=> {
              resolve()
            })
          })).then(async ()=> {
            this.books.setSelected(bookData)
            let getNotesResponse = await fetch(`/api/note/${bookData.bookId}`, {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                }
            })
            let bodyData = await getNotesResponse.json()
            
            if (getNotesResponse.status != 200) this.notification.addNotification(bodyData)
            if (getNotesResponse.status == 200) {
              document.getElementById('book_notes').value = bodyData.note.body
            }
            if (getNotesResponse.status == 401) {
              localStorage.removeItem('token')
              this.$router.push('/login')
            }
            this.notesPromise = false
          })
        }
        
      },
      async handleBookRemoval(bookId) {
        let removeBookResponse = await fetch(`/api/book/${bookId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        })
        let bodyData = await removeBookResponse.json()
        if (removeBookResponse.status != 200) this.notification.addNotification(bodyData)
        if (removeBookResponse.status == 401) {
          localStorage.removeItem('token')
          this.$router.push('/login')
        }
        this.getBooks()
      }
    }
  }
</script>
<style scoped>
  .text {
    font-size: 1.2vw;
    font-weight: 500;
    text-transform: uppercase;
    color: white;
    margin: 0 auto;
  }
    .books-view {
      display: flex;
      width: 100%;
      gap: .5vw;
    }
    .book-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-items: flex-start;
      box-sizing: border-box;
      gap: 2vw;
      padding: 2vw;
      background-color: var(--main-element-bg);
    }

    .book-content .img-and-text {
      width: 100%;
      display: block;
      color: white;
    }

    .book-content .misc {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      color: white;
      gap: .5vw;
    }

    .book-content .misc .header-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .book-content .misc .header-box .header {
      font-size: 1.1vw;
      font-weight: 600;
      text-transform: uppercase;
    }

    .book-content .misc .header-box .text {
      font-size: .8vw;
      font-weight: 400;
    }



    .book-content .img-and-text img {
      width: 16vw;
      height: 25vw;
      object-fit: cover;
      float: left;
      margin-right: 1vw;
      margin-bottom: 1vw;
    }

    .book-content .img-and-text .icon {
      width: 16vw;
      height: 25vw;
      font-size: 15vw;
      display: flex;
      align-items: center;
      justify-content: center;
      float: left;
      margin-right: 1vw;
      margin-bottom: 1vw;
    }

    .book-content .img-and-text .title {
      font-size: 2vw;
      font-weight: 600;
    }
    
    .book-content .img-and-text .author {
      font-size: 1vw;
      font-weight: 500;
      opacity: .3;
      margin-bottom: 2vw;
    }

    .book-content .img-and-text .description {
      font-size: .8vw;
      font-weight: 400;
    }

    .book-content .misc textarea {
      background-color: var(--main-element-bg);
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
      color: white;
      border: 0;
      outline: 0;
      resize: none;
      box-sizing: border-box;
      padding: .5vw;
      min-width: 20vw;
      min-height: 30vw;
    }

    .book-content .misc button {
      box-sizing: border-box;
      padding: .25vw .75vw;
      background-color: var(--main-element-bg);
      color: rgba(255, 255, 255, 0.5);
      font-family: 'Montserrat', sans-serif;
      border: 0;
      outline: 0;
      font-weight: 500;
      font-size: .75vw;
      transition: background-color .125s ease-in-out, color .125s ease-in-out;
    }

    .book-content .misc button:hover {
      background-color: rgba(255, 255, 255, 0.25);
      color: white;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: .5vw;
      width: 25vw;
      height: 100%;
      background-color: var(--main-element-bg);
      flex-shrink: 0;
      flex-grow: 0;
      overflow-y: auto;
    }

    .list .list-element {
      width: 100%;
      box-sizing: border-box;
      padding: 1vw;
      background-color: transparent;
      display: flex;
      gap: .5vw;
      transition: background-color .125s ease-in-out
    }

    .list .list-element .icon {
      width: 8vw;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3vw;
    }

    

    .list .list-element.active {
      background-color: var(--main-element-bg);
    }

    .list .list-element img {
      width: 8vw;
      height: 8vw;
      object-fit: contain;
    }

    .list .list-element .col {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: .2vw;
      color: white;
    }

    .list .list-element .col .title {
      font-size: 1vw;
      font-weight: 600;
    }

    .list .list-element .col .author {
      font-size: .8vw;
      font-weight: 500;
      opacity: .3;
    }

    .list .list-element .col .rating {
      margin-top: auto;
      font-size: .75vw;
      font-weight: 400;
    }
</style>