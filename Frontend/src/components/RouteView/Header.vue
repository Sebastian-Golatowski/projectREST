<template>
    <div class="nav-container">
        <div class="name">Hi {{ user.name }} | {{ name }}</div>
        <div class="navs">
            <!-- add icon for each element -->
            <div class="nav-element" v-for="(nav, key) in navigationPanel" @click="HandleNav(nav.path)" :key="key">{{ nav.label }}</div>
            <div class="nav-element" @click="Logout">Logout</div>
        </div>
    </div>
    <div class="line"></div>
</template>
<script>
import { useUserStorage } from '../../storage/user';
export default {
    data() {
        return({
            user: useUserStorage(),
            name: 'Book Finder',
            navigationPanel: [
                {
                    label: 'Books',
                    path: '/landing'
                },
                {
                    label: 'My List',
                    path: '/books'
                }
            ]
        })
    }, methods: {
        Logout() {
            localStorage.removeItem('token')
            this.$router.push('/login')
        },
        HandleNav(path) {
            this.$router.push('/main'+path)
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
    }

    .nav-container .navs .nav-element {opacity: .3;}
    .nav-container .navs .nav-element:hover {opacity: 1;}
</style>