<template>
    <div class="notifications-container">
        <transition-group @enter="onEnter" @leave="onLeave" :css="false">
            <div class="notification" v-for="(notification, key) in notifications.list" :key="key">
                <div class="header">Error</div>
                <div class="text">{{ notification.message }}</div>
            </div>
        </transition-group>
        
    </div>
</template>
<script>
import anime from 'animejs'
import {useNotificationsStorage} from '@/storage/notifications'
export default {
    data() {
        return({
            notifications: useNotificationsStorage()
        })
    },
    methods: {
        onEnter(el, complete) {
            anime({
                targets: el,
                right: ['-3vw', 0],
                'max-height': [0, '5vw'],
                marginBottom: [0, '.5vw'],
                easing: 'cubicBezier(0.075, 0.82, 0.165, 1)',
                duration: 1000,
                complete: complete
            })
        }, onLeave(el, complete) {
            anime({
                targets: el,
                right: [0, '-10vw'],
                'max-height': ['5vw', '0vw'],
                paddingBottom: 0,
                paddingTop: 0,
                opacity: [1, 0],
                marginBottom: ['.5vw', 0],
                easing: 'cubicBezier(0.075, 0.82, 0.165, 1)',
                complete: complete
            })
        }
    }
}
</script>
<style scoped>
    .notifications-container {
        position: absolute;
        right: 2vw;
        top: 2vw;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .notifications-container .notification {
        background-color: var(--main-element-bg);
        display: flex;
        flex-direction: column;
        gap: .5vw;
        padding: 0.5vw 1vw;
        color: white;
        position: relative;
    }

    .notifications-container .notification .header {
        font-size: .9vw;
        font-weight: 600;
    }

    .notifications-container .notification .text {
        font-size: .7vw;
        font-weight: 400;
    }
</style>