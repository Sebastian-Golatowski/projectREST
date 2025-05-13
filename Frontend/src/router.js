import {createRouter, createWebHistory} from 'vue-router'
import Login from './components/RouteView/LoginView/Login.vue'
import Landing from './components/RouteView/LandingView/Landing.vue'
import Books from './components/RouteView/BooksView/Books.vue'
import MainView from './components/RouteView/MainView.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    }, {
        path: '/main',
        name: 'main',
        component: MainView,
        children: [
            {
                path: 'books',
                name: 'books',
                component: Books,
            }, {
                path: 'landing',
                name: 'landing',
                component: Landing,
            }
        ]
    }, 
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router