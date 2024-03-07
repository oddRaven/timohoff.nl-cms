<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

import { type ISectionItem, SectionItem } from '../models/section-item'

defineExpose({
    select,
    store
});

const emit = defineEmits(['refresh']);

const sectionItem = ref<ISectionItem>( new SectionItem());
const dutchTitle = ref('');
const englishTitle = ref('');
const selectedItemType = ref('Articles');

const options = ref([
  { text: 'Article', itemType: 'Articles' },
  { text: 'Timeline', itemType: 'Timelines' },
  { text: 'Profiles', itemType: 'Profiles' }
]);

function clear () {
    sectionItem.value = new SectionItem();
    dutchTitle.value = '';
    englishTitle.value = '';
}

function select (type_ : string, id : number) {
    const url : string = 'http://localhost/api/section-item/' + type_ + '/' + id;

    const config = {
        headers: {
            'Content-Language': 'en'
        }
    };

    axios.get(url, config)
        .then((response) => {
            sectionItem.value = response.data;
            dutchTitle.value = sectionItem.value!.title_translations.filter((translation) => translation.code == 'nl')[0].text;
            englishTitle.value = sectionItem.value!.title_translations.filter((translation) => translation.code == 'en')[0].text;
            selectedItemType.value = sectionItem.value!.item_type!;
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
            code: 'nl',
            text: dutchTitle.value,
        },
        {
            code: 'en',
            text: englishTitle.value,
        }
    ]

    const url = 'http://localhost/api/section-item';

    axios.post(url, sectionItem.value, config)
        .then(resolveSave);
}

function update () {
    const config = {
        withCredentials: true
    };

    const url = 'http://localhost/api/section-item/' + sectionItem.value!.item_type + '/' + sectionItem.value!.item_id;

    axios.put(url, sectionItem.value, config)
        .then(resolveSave);
}

function resolveSave (response : any) {
    sectionItem.value = response.data.sectionItem;

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

    <select v-model="selectedItemType">
        <option v-for="option in options" :key="option.itemType" :value="option.itemType">{{ option.text }}</option>
    </select>

    <input v-if="sectionItem" type="button" value="Opslaan" @click="update" >
    <input v-if="sectionItem" type="button" value="Verwijder" @click="delete_" >
</template>