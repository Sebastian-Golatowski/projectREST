import { defineStore } from 'pinia'
export const useUserStorage = defineStore('user_storage', {
  state: () => ({
    user: {
        token: false,
        isLoggedIn: false,
    }
  }), actions: {
    setToken(token) {
        this.user.token = token
    },
    setIsLoggedIn(state) {
        this.user.isLoggedIn = state
    },
  }
})