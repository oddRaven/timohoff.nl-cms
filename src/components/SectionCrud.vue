<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

import { type ISection, Section } from '../models/section'

defineExpose({
    select
});

const emit = defineEmits(['refresh']);

let section = ref<ISection>();
let dutchTitle = ref();
let englishTitle = ref();

function clear () {
    section.value = new Section();
    dutchTitle.value = '';
    englishTitle.value = '';
}

function select (sectionId : number) {
    let url : string = 'http://localhost/api/section/' + sectionId;

    axios.get(url)
        .then((response) => {
            section.value = response.data;
            dutchTitle.value = section.value!.title_translations.filter((translation) => translation.code == 'nl')[0].text;
            englishTitle.value = section.value!.title_translations.filter((translation) => translation.code == 'en')[0].text;
        });
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

    section.value!.title_translations = [
        {
            code: 'nl',
            text: dutchTitle.value,
        },
        {
            code: 'en',
            text: englishTitle.value,
        }
    ]

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
    
    <input v-if="section" type="text" v-model="dutchTitle" placeholder="Titel" >
    <input v-if="section" type="text" v-model="englishTitle" placeholder="Title" >
    <input v-if="section" type="button" value="Opslaan" @click="save" >
    <input v-if="section" type="button" value="Verwijder" @click="delete_" >
</template>