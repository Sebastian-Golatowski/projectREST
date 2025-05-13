<template>
  <div class="form-container">
    <div class="form">
      <Input
        :placeholder="'test'"
        :header="'test'"
      />
    </div>
  </div>
</template>
<script>
import Input from '../Inputs/Input.vue'
  export default {
    components: {Input},
    data() {
        return({

        })
    }
  }
</script>
<style scoped>
    
</style>