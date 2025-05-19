import { defineStore } from 'pinia'
export const useLandingStorage = defineStore('landing_storage', {
  state: () => ({
    books: {
      list: [],
      searchedQuery: '',
    }
  }), actions: {
    setBooksData(data) {
        this.books.list = data
    },
    setBooksConvertedData(data) {
        this.books.convertedList = data
    },
    setBooksSearchedQuery(query) {
        this.books.searchedQuery = query
    }
  }
})