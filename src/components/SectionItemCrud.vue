<script setup lang="ts">
import { ref } from 'vue'

import { SectionItemService } from '../services/section-item.service'
import { TranslationService } from '../services/translation.service'
import ArticleCrud from '../components/ArticleCrud.vue'
import ProfileCollectionCrud from '../components/ProfileCollectionCrud.vue'
import { type ISectionItem } from '../models/section-item'

defineExpose({
    select,
    store
});

const emit = defineEmits(['refresh', 'new']);

const prop = defineProps(['sectionId'])

const sectionItem = ref<ISectionItem>();
const dutchTitle = ref('');
const englishTitle = ref('');
const articleCrud = ref();
const profileCollectionCrud = ref();

const sectionItemService = new SectionItemService;
const translationService = new TranslationService;

const options = ref([
  { text: 'Article', itemType: 'articles' },
  { text: 'Timeline', itemType: 'timelines' },
  { text: 'Profiles', itemType: 'profile_collections' }
]);

function clear () {
    dutchTitle.value = '';
    englishTitle.value = '';
    emit('new');
}

function select (subjectSectionItem : ISectionItem) {
    sectionItem.value = subjectSectionItem;

    window.setTimeout(() => {
        if(!sectionItem.value){
            return;
        }

        if (sectionItem.value.item_type == 'articles') {
            articleCrud.value.clear();
        }
        else if (sectionItem.value.item_type == 'profile_collections') {
            profileCollectionCrud.value.clear();
        }

        if (!sectionItem.value.item_type || !sectionItem.value.item_id) {
            return;
        }

        sectionItemService.get(sectionItem.value.item_type, sectionItem.value.item_id)
            .then((response: any) => {
                let data : ISectionItem = response.data as ISectionItem;
                dutchTitle.value = data!.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
                englishTitle.value = data!.title_translations.filter((translation) => translation.language_code == 'en')[0].text;
            });

        if (sectionItem.value.item_type == 'articles') {
            articleCrud.value.select(sectionItem.value.item_id);
        }
        else if (sectionItem.value.item_type == 'profile_collections') {
            profileCollectionCrud.value.select(sectionItem.value.item_id);
        }
    });
}

function store (type_ : string, id : number) {
    if(!sectionItem.value){
        return;
    }

    sectionItem.value.item_type = type_;
    sectionItem.value.item_id = id;
    sectionItem.value.section_id = prop['sectionId'];

    sectionItem.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    sectionItemService.post(sectionItem.value)
        .then(resolveSave);
}

function update () {
    if(!sectionItem.value || !sectionItem.value.item_type || !sectionItem.value.item_id){
        return;
    }

    sectionItem.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

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
    <div>
        <h2>Section Item edit</h2>

        <input type="button" value="Nieuw" @click="clear" >

        <input v-if="sectionItem" type="text" v-model="dutchTitle" placeholder="Titel" >
        <input v-if="sectionItem" type="text" v-model="englishTitle" placeholder="Title" >

        <select v-if="sectionItem" v-model="sectionItem.item_type" :disabled="sectionItem.item_id != null">
            <option v-for="option in options" :key="option.itemType" :value="option.itemType">{{ option.text }}</option>
        </select>

        <input v-if="sectionItem && sectionItem.item_id" type="button" value="Opslaan" @click="update" >
        <input v-if="sectionItem && sectionItem.item_id" type="button" value="Verwijder" @click="delete_" >
    </div>

    <ProfileCollectionCrud ref="profileCollectionCrud" v-if="sectionItem && sectionItem.item_type == 'profile_collections'" @storeSectionItem="store" />
    <ArticleCrud ref="articleCrud" v-if="sectionItem && sectionItem.item_type == 'articles'" @store="store" />
</template>