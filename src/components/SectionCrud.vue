<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

import { type ISection, Section } from '../models/section'

let section = ref<ISection>();

function clear () {
    section.value = new Section();
}

function save () {
    console.log(section.value);

    if(section.value && section.value.id) {
        let url = 'http://localhost/api/section/' + section.value.id;
        
        axios.put(url)
            .then((response) => {
                section.value = response.data;
            });
    }
    else{
        let url = 'http://localhost/api/section';

        axios.post(url, section.value, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'Access-Control-Request-Method': '*',
            }
        })
            .then((response) => {
                section.value = response.data;
            });
    }
}
</script>

<template>
    <input type="button" value="Nieuw" @click="clear" >
    
    <input v-if="section" type="text" v-model="section.title" >
    <input v-if="section" type="button" value="Opslaan" @click="save" >
</template>