<script setup lang="ts">
import { ref } from 'vue'

import { type ISectionItem } from '../models/section-item'
import { SectionItemService } from '../services/section-item.service'

defineExpose({
    select,
    store
});

const emit = defineEmits(['refresh', 'new']);

const sectionItem = ref<ISectionItem>();
const dutchTitle = ref('');
const englishTitle = ref('');

const sectionItemService = new SectionItemService;

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

    if (!sectionItem.value.item_type || !sectionItem.value.item_id) {
        return;
    }

    sectionItemService.get(sectionItem.value.item_type, sectionItem.value.item_id)
        .then((response: any) => {
            let data : ISectionItem = response.data as ISectionItem;
            dutchTitle.value = data!.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = data!.title_translations.filter((translation) => translation.language_code == 'en')[0].text;
        });
}

function store (type_ : string, id : number, sectionId : number) {
    if(!sectionItem.value){
        return;
    }

    sectionItem.value.item_type = type_;
    sectionItem.value.item_id = id;
    sectionItem.value.section_id = sectionId;

    sectionItem.value.title_translations = [
        {
            language_code: 'nl',
            text: dutchTitle.value,
        },
        {
            language_code: 'en',
            text: englishTitle.value,
        }
    ];

    sectionItemService.post(sectionItem.value)
        .then(resolveSave);
}

function update () {
    if(!sectionItem.value || !sectionItem.value.item_type || !sectionItem.value.item_id){
        return;
    }

    sectionItem.value.title_translations = [
        {
            language_code: 'nl',
            text: dutchTitle.value,
        },
        {
            language_code: 'en',
            text: englishTitle.value,
        }
    ];

    sectionItemService.put(sectionItem.value.item_type, sectionItem.value.item_id, sectionItem.value)
        .then(resolveSave);
}

function resolveSave (response : any) {
    emit('refresh');
}

function delete_ () {
    if (!sectionItem.value || !sectionItem.value.item_type || !sectionItem.value.item_id) {
        return;
    }


    sectionItemService.delete(sectionItem.value.item_type, sectionItem.value.item_id)
        .then(() => {
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