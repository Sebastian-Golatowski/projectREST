<template>
 <div class="login-box">
    <h2>Book Finder</h2>
    <form @submit.prevent="handleLogin">
      <Input
        id="username"
        label="USERNAME"
        placeholder="Enter username"
        v-model="username"
        :input="handleInput"
      />
      <Input
        id="password"
        label="PASSWORD"
        type="password"
        placeholder="Enter password"
        v-model="password"
      />
      <button type="submit" class="login-btn">LOG IN</button>
    </form>
    <div class="register">
      Don't have an account?
      <a href="#" @click.prevent="goToRegister">Register Now</a>
    </div>
  </div>
</template>
<script>
import Input from '../Inputs/Input.vue'
  export default {
  name: 'LoginForm',
  components: { Input },
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        alert('Wypełnij pola.');
        return;
      }
      console.log('Logging in with', this.username, this.password);
  
    },
    goToRegister() {
      console.log('Go to registration view');
    }
  }
};
</script>
<style scoped>
   body {
  background-color: #0f0f0f;
}

.login-box {
  background-color: #1c1c1c;
  padding: 40px 30px;
  border-radius: 10px;
  width: 300px;
  color: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  margin: 100px auto;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
  font-weight: bold;
}

.input-box {
  margin-bottom: 20px;
}

.input-box label {
  display: block;
  font-size: 10px;
  color: #ccc;
  margin-bottom: 5px;
}

.input-box input {
  width: 100%;
  padding: 10px;
  background-color: #2e2e2e;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  margin: 20px 0 10px;
}

.register {
  text-align: center;
  font-size: 12px;
  color: #888;
}

.register a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}

.register a:hover {
  text-decoration: underline;
}

</style>