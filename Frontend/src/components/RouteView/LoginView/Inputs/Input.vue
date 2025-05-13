<template>
  <div class="input-container">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput($event.target.value)"
      class="form-input"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    modelValue: [String, Number],
    handleInput: Function
  }
}
</script>

<style scoped>
.input-container {
  margin-bottom: 1.5vw;
}

.input-container label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8vw;
  margin-bottom: 0.5vw;
}

.form-input {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1vw;
  padding: 0.8vw;
  border: none;
  outline: none;
  transition: background-color 0.3s ease;
}

.form-input:focus {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>