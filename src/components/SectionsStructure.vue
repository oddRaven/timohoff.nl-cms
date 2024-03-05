<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from 'vue'
import { type ISection } from '../models/section'

defineExpose({
    refresh
});

const emit = defineEmits(['select']);

let sections = ref<ISection[]>([]); 

function refresh () {
    let config = {
        headers: {
            'Content-Language': 'en'
        }
    };

    axios.get('http://localhost/api/section', config)
        .then((response) => {
            sections.value = response.data;
        });
}

function select (section : ISection) {
    emit('select', section.id);
}

onMounted(() => {
    refresh();
});
</script>

<template>
    <ul>
        <li v-for="section in sections" :key="section.id" @click="select(section)"> {{ section.title }}</li>
    </ul>
</template>

<style scoped>
    ul {
        padding: 0px;
        margin: 0px;

        li {
            list-style: none;
            cursor: pointer;
            user-select: none;
            width: 100px;
            background: beige;
            padding: 2px;
        }
    }
</style>