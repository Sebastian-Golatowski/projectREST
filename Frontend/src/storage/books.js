import { defineStore } from 'pinia'
export const useBooksStorage = defineStore('books_storage', {
  state: () => ({
    selected: {},
    list: []
  }), actions: {
    setSelected(data) {
        this.selected = data
    },
    setList(data) {
        this.list = data
        let foundSelectedBook = false
        for(const[key, bookData] of Object.entries(this.list)) {
          if (bookData?.bookId == this.selected?.bookId) {
            this.selected = this.list[key]
            foundSelectedBook = true
            break
          }
        }
        if (!foundSelectedBook) {
          this.selected = {}
        }
    }
  }
})