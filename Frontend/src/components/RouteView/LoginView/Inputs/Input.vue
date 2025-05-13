<template>
    <div class="input-box">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="modelValue"
      @input=""
      
    />
  </div>
</template>
<script>
  export default {
    props: {
      oninput: Function,
      placeholder: String,
      header: String,
    },
    data() {
        return({

        })
    }
  }
</script>
<style scoped>
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
</style>