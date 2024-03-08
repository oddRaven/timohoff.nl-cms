<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

import { type ISection, Section } from '../models/section'

defineExpose({
    select
});

const emit = defineEmits(['new', 'refresh']);

let section = ref<ISection>();
let dutchTitle = ref('');
let englishTitle = ref('');

function clear () {
    dutchTitle.value = '';
    englishTitle.value = '';
    emit('new');
}

function select (sectionSubject : ISection) {
    section.value = sectionSubject;
    const url : string = 'http://localhost/api/section/' + section.value.id;

    axios.get(url)
        .then((response) => {
            let data : ISection = response.data as ISection;
            dutchTitle.value = data.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = data.title_translations.filter((translation) => translation.language_code == 'en')[0].text;
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
    emit('refresh');
}

function update () {
    let config = {
        withCredentials: true
    };

    section.value!.title_translations = [
        {
            language_code: 'nl',
            text: dutchTitle.value,
        },
        {
            language_code: 'en',
            text: englishTitle.value,
        }
    ]

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
            language_code: 'nl',
            text: dutchTitle.value,
        },
        {
            language_code: 'en',
            text: englishTitle.value,
        }
    ]

    let url = 'http://localhost/api/section';

    axios.post(url, section.value, config)
        .then(resolveSave);
}

function delete_ () {
    if (!section.value || !section.value.id) {
        return;
    }

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
</script>

<template>
    <input type="button" value="Nieuw" @click="clear" >
    
    <input v-if="section" type="text" v-model="dutchTitle" placeholder="Titel" >
    <input v-if="section" type="text" v-model="englishTitle" placeholder="Title" >
    <input v-if="section" type="button" value="Opslaan" @click="save" >
    <input v-if="section" type="button" value="Verwijder" @click="delete_" >
</template>