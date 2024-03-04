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
    axios.get('http://localhost/api/section')
        .then((response) => {
            sections.value = response.data;
        });
}

function select (section : ISection) {
    emit('select', section);
}

onMounted(() => {
    refresh();
});
</script>

<template>
    <ul>
        <li v-for="section in sections" :key="section.title" @click="select(section)"> {{ section.title }}</li>
    </ul>
</template>

<style scoped>
    ul {
        padding: 0px;

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