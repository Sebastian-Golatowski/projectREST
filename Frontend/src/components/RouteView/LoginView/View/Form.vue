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
      <button 
        type="submit" 
        class="auth-button"
        @click.prevent="handleLogin"
      >LOG IN</button>
      <div class="auth-link">
        Don't have an account?
        <a href="#" @click.prevent="goToRegister">Register Now</a>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '../Inputs/Input.vue'

export default {
  components: { Input },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    updateUsername(value) {
      this.username = value
    },
    updatePassword(value) {
      this.password = value
    },
    handleLogin() {
      if (!this.username || !this.password) {
        alert('Pola wypełnij panie')
        return
      }
      console.log('Logging in with', this.username, this.password)
    },
    goToRegister() {
      console.log('Go to registration view')
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
  border-radius: 0.5vw;
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