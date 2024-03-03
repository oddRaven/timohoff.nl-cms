<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from 'vue'
import { type ISection } from '../models/section'

let sections = ref<ISection[]>([]); 

onMounted(() => {
    axios.get('http://localhost/api/section')
        .then((response) => {
            sections.value = response.data;
        });
});
</script>

<template>
    <main>
        <ul>
            <li v-for="section in sections" :key="section.title"> {{ section.title }}</li>
        </ul>
    </main>
</template>