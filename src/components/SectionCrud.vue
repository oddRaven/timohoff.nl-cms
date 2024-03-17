<script setup lang="ts">
import { ref } from 'vue'

import { SectionService } from '../services/section.service'
import { TranslationService } from '../services/translation.service'
import { type ISection } from '../models/section'

defineExpose({
    select
});

const emit = defineEmits(['new', 'refresh']);

const section = ref<ISection>();
const dutchTitle = ref('');
const englishTitle = ref('');

const sectionService = new SectionService;
const translationService = new TranslationService;

function clear () {
    dutchTitle.value = '';
    englishTitle.value = '';
    emit('new');
}

function select (sectionSubject : ISection) {
    section.value = sectionSubject;

    if (!section.value.id) {
        return;
    }

    sectionService.get(section.value.id)
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
    if (section.value) {
        section.value.id = response.data.section.id;
    }

    emit('refresh');
}

function update () {
    if(!section.value || !section.value.id){
        return;
    }

    section.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    sectionService.put(section.value.id, section.value)
        .then(resolveSave);
}

function store () {
    if(!section.value){
        return;
    }

    section.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    sectionService.post(section.value)
        .then(resolveSave);
}

function delete_ () {
    if (!section.value || !section.value.id) {
        return;
    }

    sectionService.delete(section.value.id)
        .then(() => {
            clear();

            emit('refresh');
        });
}
</script>

<template>
    <div class="body-row">
        <h2>Section edit</h2>

        <input type="button" value="Nieuw" @click="clear" >

        <input v-if="section" type="text" v-model="dutchTitle" placeholder="Titel" >
        <input v-if="section" type="text" v-model="englishTitle" placeholder="Title" >
        <input v-if="section" type="button" value="Opslaan" @click="save" >
        <input v-if="section" type="button" value="Verwijder" @click="delete_" >
    </div>
</template>