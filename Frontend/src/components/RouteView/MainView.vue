<template>
    <Header/>
    <div class="content-landing">
        <RouterView/>
    </div>
    
</template>
<script>
import Header from './Header.vue'
export default {
    components: {Header}
}
</script>
<style scoped>
    .content-landing {
        width: 100%;
        height: 100%;
        
    }
</style>