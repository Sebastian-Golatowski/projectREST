<template>
    <div class="nav-container">
        <div class="name">{{ name }}</div>
        <div class="navs">
            <div class="nav-element" v-for="(nav, key) in navigationPanel" @click="HandleNav(nav.path)" :key="key">{{ nav.label }}</div>
            <div class="nav-element" @click="Logout">Logout</div>
        </div>
    </div>
    <div class="line"></div>
</template>
<script>
export default {
    data() {
        return({
            name: 'Book Finder',
            navigationPanel: [
                {
                    label: 'Books',
                    path: '/'
                },
                {
                    label: 'My List',
                    path: '/books'
                }
            ]
        })
    }, methods: {
        HandleNav(path) {
            this.$router.push(path)
        }
    } 
}
</script>
<style scoped>
    .nav-container {
        width: 100%;
        box-sizing: border-box;
        padding: 1.5vw 2vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
        margin-bottom: 1vw;
        background-color: var(--main-element-bg);
    }
    
    .line {
        width: 100%;
        height: .7vw;
        background-color: var(--main-element-bg);
        margin-bottom: 1vw;
    }

    .nav-container .name {
        font-size: 1.2vw;
        font-weight: 600;
        text-transform: uppercase;
    }

    .nav-container .navs {
        display: flex;
        gap: 1vw;
        text-transform: uppercase;
        font-weight: 500;
        font-size: .8vw;
        opacity: .3;
    }
</style>