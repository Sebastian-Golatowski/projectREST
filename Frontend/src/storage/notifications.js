import { defineStore } from 'pinia'
export const useNotificationsStorage = defineStore('notifications_storage', {
  state: () => ({
    list: {}
  }), actions: {
    addNotification(data) {
        
        let uniqueId = 'notify_' + String(Math.floor((Math.random()) * 1000))
        
        this.list[uniqueId] = {
            message: data.message
        }
        console.log( this.list);
        setTimeout(()=> {
            delete this.list[uniqueId]
        }, 5000)
    }
  }
})