import { defineStore } from 'pinia'
export const useLandingStorage = defineStore('landing_storage', {
  state: () => ({
    books: {
      list: [
        {
          "title": "God Emperor of Dune",
          "googleId": "oTgvJWFmjOoC",
          "authors": [
            "Frank Herbert"
          ],
          "thumbnail": "http://books.google.com/books/content?id=oTgvJWFmjOoC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
          "rating": 4.5,
          "description": "Book Four in the Magnificent Dune Chronicles—the Bestselling Science Fiction Adventure of All Time Millennia have passed on Arrakis, and the once-desert planet is green with life. Leto Atreides, the son of the world’s savior, the Emperor Paul Muad’Dib, is still alive but far from human. To preserve humanity’s future, he sacrificed his own by merging with a sandworm, granting him near immortality as God Emperor of Dune for the past thirty-five hundred years. Leto’s rule is not a benevolent one. His transformation has made not only his appearance but his morality inhuman. A rebellion, led by Siona, a member of the Atreides family, has risen to oppose the despot’s rule. But Siona is unaware that Leto’s vision of a Golden Path for humanity requires her to fulfill a destiny she never wanted—or could possibly conceive....",
          "ratingsCount": 6
        },
        {
          "title": "Dune",
          "googleId": "xHwFAQAAIAAJ",
          "authors": [
            "Frank Herbert"
          ],
          "thumbnail": "http://books.google.com/books/content?id=xHwFAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
          "rating": 5,
          "description": "Paul Atreides moves with his family to the planet Dune and is forced into exile when his father's government is overthrown. The first book in the series. Copyright © Libri GmbH. All rights reserved.",
          "ratingsCount": 4
        },
      ],
      convertedList: {},
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