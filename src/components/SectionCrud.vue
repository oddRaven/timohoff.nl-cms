<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

import { type ISection, Section } from '../models/section'

defineExpose({
    select
});

const emit = defineEmits(['refresh']);

let section = ref<ISection>();

function clear () {
    section.value = new Section();
}

function select (selectedSection : any) {
    section.value = selectedSection;
}

function save () {
    if (section.value && section.value.id) {
        update()
    }
    else {
        store();
    }
}

function resolveSave (response : any) {
    section.value = response.data.section;

    emit('refresh');
}

function update () {
    let config = {
        withCredentials: true
    };

    let url = 'http://localhost/api/section/' + section.value!.id;

    axios.put(url, section.value, config)
        .then(resolveSave);
}

function store () {
    let config = {
        withCredentials: true
    };

    let url = 'http://localhost/api/section';

    axios.post(url, section.value, config)
        .then(resolveSave);
}

function delete_ () {
    if (section.value && section.value.id) {
        let config = {
            withCredentials: true
        };

        let url = 'http://localhost/api/section/' + section.value.id;

        axios.delete(url, config)
            .then((response) => {
                clear();

                emit('refresh');
            });
    }
}
</script>

<template>
    <input type="button" value="Nieuw" @click="clear" >
    
    <input v-if="section" type="text" v-model="section.title" >
    <input v-if="section" type="button" value="Opslaan" @click="save" >
    <input v-if="section" type="button" value="Verwijder" @click="delete_" >
</template>