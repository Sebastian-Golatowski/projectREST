<template>
  <div class="login-container">
    <h2 class="page-title">Book Finder</h2>
    <div class="auth-box">
      <Input
        id="username"
        label="USERNAME"
        placeholder="Enter username"
        :modelValue="username"
        :handleInput="updateUsername"
      />
      <Input
        id="password"
        label="PASSWORD"
        type="password"
        placeholder="Enter password"
        :modelValue="password"
        :handleInput="updatePassword"
      />
      <template v-if="isRegister">
        <Input
          id="confirm_password"
          label="CONFIRM PASSWORD"
          type="password"
          placeholder="Confirm password"
          :modelValue="confirmPassword"
          :handleInput="updatePasswordConfirm"
        />
      </template>
      <button 
        type="submit" 
        class="auth-button"
        @click.prevent="handleLogin"
      >{{isRegister ? 'Register' : 'Log In'}}</button>
      <template v-if="!isRegister">
        <div class="auth-link">
          Don't have an account?
          <a href="#" @click.prevent="goToRegister(true)">Register Now</a>
        </div>
      </template>
      <template v-else>
        <div class="auth-link">
          Already have an account?
          <a href="#" @click.prevent="goToRegister(false)">Login</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Input from '../Inputs/Input.vue'
import {useNotificationsStorage} from '@/storage/notifications'
export default {
  components: { Input },
  data() {
    return {
      isRegister: false,
      username: '',
      password: '',
      confirmPassword: '',
      notifications: useNotificationsStorage()
    }
  },
  methods: {
    updateUsername(value) {
      this.username = value
    },
    updatePassword(value) {
      this.password = value
    },
    updatePasswordConfirm(value) {
      this.confirmPassword = value
    },
    async handleLogin() {
      if (this.isRegister ? (!this.username || !this.password || !this.confirmPassword) : (!this.username || !this.password)) {
        this.notifications.addNotification({
          message: 'Fulfill the data first.'
        })
        return
      }
      
      if (this.isRegister) {
                let headersList = {
        "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
          "username": this.username,
          "password": this.password,
          "secPassword": this.confirmPassword
        });
        
         let response = await fetch(`${import.meta.env.VITE_BACK_SERV}/api/user/register`, { 
          method: "POST",
          body: bodyContent,
          headers: headersList
        }); 
        // registerin user
        console.log('Registering with', this.username, this.password, this.confirmPassword,)
      } else {
        let headersList = {
        "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
          "username": this.username,
          "password": this.password
        });

        let response = await fetch(`${import.meta.env.VITE_BACK_SERV}/api/user/login`, { 
          method: "POST",
          body: bodyContent,
          headers: headersList
        }); 
        // loggin user
        console.log('Logging in with', this.username, this.password)
      }
      
    },
    goToRegister(state) {
      this.isRegister = state
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  padding: 2vw;
}

.page-title {
  color: white;
  font-size: 2.5vw;
  font-weight: 500;
  margin-bottom: 2vw;
  text-align: center;
}

.auth-box {
  width: calc((100% - 10vw) / 3);
  margin: 0 auto;
  background-color: var(--main-element-bg);
  padding: 2vw;
}

.auth-button {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1vw;
  padding: 0.8vw;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.5vw;
}

.auth-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.auth-link {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8vw;
  margin-top: 1.5vw;
}

.auth-link a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5vw;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>