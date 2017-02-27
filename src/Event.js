import Vue from 'vue'

export default class Event {
    constructor(){
        this.vue = new Vue()
    }

    fire(event, data = null){
        this.vue.$emit(event, data)

        return this
    }

    listen(event, callback){
        this.vue.$on(event, callback)

        return this
    }
}