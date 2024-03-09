<script setup lang="ts">
import { ref } from 'vue'

import { ProfileService } from '../services/profile.service'
import { TranslationService } from '../services/translation.service'
import { type IProfile, Profile } from '../models/profile'
import ArticleCrud from '../components/ArticleCrud.vue'

defineExpose({
    select
});

const emit = defineEmits(['new', 'refresh']);

const prop = defineProps(['profileCollectionId'])

const profile = ref<IProfile>();
const dutchTitle = ref('');
const englishTitle = ref('');
const articleCrud = ref();

const profileService = new ProfileService;
const translationService = new TranslationService;

function clear () {
    profile.value = new Profile();
    dutchTitle.value = '';
    englishTitle.value = '';

    window.setTimeout(() => {
        articleCrud.value.clear();
    });

    emit('new');
}

function select (profileSubject : IProfile) {
    profile.value = profileSubject;

    if (!profile.value || !profile.value.id) {
        return;
    }

    profileService.get(profile.value.id)
        .then((response) => {
            let data : IProfile = response.data as IProfile;
            dutchTitle.value = data.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = data.title_translations.filter((translation) => translation.language_code == 'en')[0].text;

            articleCrud.value.select(data.article_id);
        });
}

function update () {
    if(!profile.value || !profile.value.id){
        return;
    }

    profile.value.profile_collection_id = prop['profileCollectionId'];
    profile.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    profileService.put(profile.value.id, profile.value)
        .then(() => {
            emit('refresh');
        });
}

function store (type_ : string, articleId : number) {
    if (!profile.value) {
        return;
    }

    profile.value.profile_collection_id = prop['profileCollectionId'];
    profile.value.article_id = articleId;
    profile.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    profileService.post(profile.value)
        .then((response : any) => {
            profile.value!.id = response.data.profile.id;
            emit('refresh');
        });
}

function delete_ () {
    if (!profile.value || !profile.value.id) {
        return;
    }

    profileService.delete(profile.value.id)
        .then(() => {
            clear();
            emit('refresh');
        });
}
</script>

<template>
    <div>
        <h2>Profile edit</h2>

        <input type="button" value="Nieuw" @click="clear" >

        <input v-if="profile" type="text" v-model="dutchTitle" placeholder="Titel" >
        <input v-if="profile" type="text" v-model="englishTitle" placeholder="Title" >
        <input v-if="profile && profile.id" type="button" value="Opslaan" @click="update" >
        <input v-if="profile && profile.id" type="button" value="Verwijder" @click="delete_" >
    </div>

    <ArticleCrud v-if="profile" ref="articleCrud" @store="store" />
</template>