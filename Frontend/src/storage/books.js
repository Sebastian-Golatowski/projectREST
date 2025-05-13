import { defineStore } from 'pinia'
export const useBooksStorage = defineStore('books_storage', {
  state: () => ({
    books: {
        selected: {},
        list: {}
    }
  }), actions: {
    setSelected(data) {
        this.selected = data
    },
    setList(data) {
        this.list = data
    }
  }
})