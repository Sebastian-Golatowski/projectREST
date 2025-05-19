<template>
    <div class="list-container">
        <div class="list-element" v-for="(book, key) in books" :key="key" @click="callbackAddBook(book.googleId)">
            <template v-if="book.thumbnail">
                <img :src="book.thumbnail">
            </template>
            <template v-else>
                <div class="icon">
                    <i class="fas fa-book"></i>
                </div>
            </template>
            <div class="title">{{ book.title }}</div>
            <div class="author">{{ book.authors ? (typeof book.authors == 'object' ? (book.authors[0] ? book?.authors[0] : 'TBA') : book?.authors) : 'TBA' }}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        books: Object,
        callbackAddBook: Function
    },
    mounted() {
        console.log(this.books);
    },
}
</script>
<style scoped>
    .list-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        gap: .5vw;
        margin-top: 1vw;
    }

    .list-container .list-element {
        width: calc((100% - 10vw) / 6);
        height: 25vw;
        display: flex;
        flex-direction: column;
        background-color: var(--main-element-bg);
        color: white;
        box-sizing: border-box;
        padding: .5vw;
        transform-origin: center top;
        position: relative;
        transform: scale(1.0);
        transition: transform .48s cubic-bezier(0.075, 0.82, 0.165, 1), background-color .125s ease-in-out, color .125s ease-in-out;
    }

    .list-container .list-element:hover {
        transform: scale(1.05);
        color: #1a1a1a;
        background-color: white;
    }

    .list-container .list-element:hover .author {opacity: .75;}

    .list-container .list-element img {
        pointer-events: none;
        width: 100%;
        height: calc(100% - (.9vw + .7vw + 1vw));
        object-fit: cover;
    }

    .list-container .list-element .icon {
        font-size: 3vw;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .list-container .list-element > svg {display: none;}
    .list-container .list-element .icon svg {display: block;}

    .list-container .list-element .title {
        pointer-events: none;
        font-size: .9vw;
        font-weight: 400;
        margin-top: auto;
    }

    .list-container .list-element .author {
        pointer-events: none;
        font-size: .7vw;
        font-weight: 400;
        opacity: .3;
    }
</style>