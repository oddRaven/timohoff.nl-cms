<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

import { type ISectionItem, SectionItem } from '../models/section-item'

defineExpose({
    select,
    store
});

const emit = defineEmits(['refresh', 'new']);

const sectionItem = ref<ISectionItem>();
const dutchTitle = ref('');
const englishTitle = ref('');

const options = ref([
  { text: 'Article', itemType: 'Articles' },
  { text: 'Timeline', itemType: 'Timelines' },
  { text: 'Profiles', itemType: 'Profile Collections' }
]);

function clear () {
    dutchTitle.value = '';
    englishTitle.value = '';
    emit('new');
}

function select (subjectSectionItem : ISectionItem) {
    sectionItem.value = subjectSectionItem;

    if (!sectionItem.value.item_id) {
        return;
    }

    const url : string = 'http://localhost/api/section-item/' + sectionItem.value.item_type + '/' + sectionItem.value.item_id;

    const config = {
        headers: {
            'Content-Language': 'en'
        }
    };

    axios.get(url, config)
        .then((response) => {
            let data : ISectionItem = response.data as ISectionItem;
            dutchTitle.value = data!.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = data!.title_translations.filter((translation) => translation.language_code == 'en')[0].text;
        });
}

function store (type_ : string, id : number, sectionId : number) {
    let config = {
        withCredentials: true
    };

    sectionItem.value!.item_type = type_;
    sectionItem.value!.item_id = id;
    sectionItem.value!.section_id = sectionId;

    sectionItem.value!.title_translations = [
        {
            language_code: 'nl',
            text: dutchTitle.value,
        },
        {
            language_code: 'en',
            text: englishTitle.value,
        }
    ];

    const url = 'http://localhost/api/section-item';

    axios.post(url, sectionItem.value, config)
        .then(resolveSave);
}

function update () {
    const config = {
        withCredentials: true
    };

    sectionItem.value!.title_translations = [
        {
            language_code: 'nl',
            text: dutchTitle.value,
        },
        {
            language_code: 'en',
            text: englishTitle.value,
        }
    ];

    const url = 'http://localhost/api/section-item/' + sectionItem.value!.item_type + '/' + sectionItem.value!.item_id;

    axios.put(url, sectionItem.value, config)
        .then(resolveSave);
}

function resolveSave (response : any) {
    emit('refresh');
}

function delete_ () {
    if (!sectionItem.value || !sectionItem.value.item_id) {
        return;
    }

    const config = {
        withCredentials: true
    };

    const url = 'http://localhost/api/section-item/' + sectionItem.value.item_type + '/' + sectionItem.value.item_id;

    axios.delete(url, config)
        .then((response) => {
            clear();

            emit('refresh');
        });
}
</script>

<template>
    <input type="button" value="Nieuw" @click="clear" >
    
    <input v-if="sectionItem" type="text" v-model="dutchTitle" placeholder="Titel" >
    <input v-if="sectionItem" type="text" v-model="englishTitle" placeholder="Title" >

    <select v-if="sectionItem" v-model="sectionItem.item_type">
        <option v-for="option in options" :key="option.itemType" :value="option.itemType">{{ option.text }}</option>
    </select>

    <input v-if="sectionItem && sectionItem.item_id" type="button" value="Opslaan" @click="update" >
    <input v-if="sectionItem && sectionItem.item_id" type="button" value="Verwijder" @click="delete_" >
</template>