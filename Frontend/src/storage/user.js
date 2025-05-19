import { defineStore } from 'pinia'
export const useUserStorage = defineStore('user_storage', {
  state: () => ({
    name: '',
  }), actions: {
    setUserName(name) {
        this.name = name
    },
  }
})