import {createRouter, createWebHistory} from 'vue-router'
import Login from './components/RouteView/LoginView/Login.vue'
import Landing from './components/RouteView/LandingView/Landing.vue'
import Books from './components/RouteView/BooksView/Books.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    }, {
        path: '/',
        name: 'landing',
        component: Landing,
    }, {
        path: '/books',
        name: 'books',
        component: Books,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router