<script setup lang="ts">
import { ref } from 'vue'

import { ProfileService } from '../services/profile.service'
import { ProfileCollectionService } from '../services/profile-collection.service'
import { TranslationService } from '../services/translation.service'
import { type IProfile, Profile } from '../models/profile'
import { type IProfileCollection, ProfileCollection } from '../models/profile-collection'
import ProfileCrud from '../components/ProfileCrud.vue'

defineExpose({
    clear,
    select
});

const emit = defineEmits(['storeSectionItem']);

const profileCollection = ref<IProfileCollection>();
const profiles = ref<IProfile[]>();
const selectedProfile = ref<IProfile>();
const profileCrud = ref();

const dutchTitle = ref<string>('');
const englishTitle = ref<string>('');

const profileService = new ProfileService;
const profileCollectionService = new ProfileCollectionService;
const translationService = new TranslationService;

function clear() {
    profileCollection.value = new ProfileCollection();
    dutchTitle.value = '';
    englishTitle.value = '';
}

function refreshProfiles () {
    if (!profileCollection.value || !profileCollection.value.id) {
        profiles.value = [];
        return;
    }

    profileService.getByProfileCollection(profileCollection.value.id)
        .then((response : any) => {
            profiles.value = response.data;
        });
}

function newProfile () {
    selectProfile(new Profile());
}

function select (id : number) {
    if (!id) {
        clear();
        return;
    }

    profileCollectionService.get(id)
        .then((response) => {
            profileCollection.value = response.data;
            dutchTitle.value = profileCollection.value!.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = profileCollection.value!.title_translations.filter((translation) => translation.language_code == 'en')[0].text;

            refreshProfiles();
        });
}

function save () {
    if (profileCollection.value && profileCollection.value.id) {
        update()
    }
    else {
        store();
    }
}

function update () {
    if(!profileCollection.value || !profileCollection.value.id){
        return;
    }

    profileCollection.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    profileCollectionService.put(profileCollection.value.id, profileCollection.value)
        .then((response : any) => {
            profileCollection.value = response.data.profile_collection;
        });
}

function store () {
    if (!profileCollection.value) {
        return;
    }

    profileCollection.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    profileCollectionService.post(profileCollection.value)
        .then((response : any) => {
            profileCollection.value = response.data.profileCollection;

            emit('storeSectionItem', 'profile_collections', response.data.profile_collection.id);
        });
}

function delete_ () {

}

function selectProfile (profile : IProfile) {
    selectedProfile.value = profile;

    window.setTimeout(() => {
        profileCrud.value.select(selectedProfile.value);
    });
}
</script>

<template>
    <div class="body-row">
        <h2>Profile Collection edit</h2>

        <div class="row">
            <input type="button" value="Nieuw" @click="clear" >

            <input v-if="profileCollection" type="text" v-model="dutchTitle" placeholder="Titel" >
            <input v-if="profileCollection" type="text" v-model="englishTitle" placeholder="Title" >
            <input v-if="profileCollection" type="button" value="Opslaan" @click="save" >
            <input v-if="profileCollection && profileCollection.id" type="button" value="Verwijder" @click="delete_" >
        </div>

        <div class="row" v-if="profileCollection && profileCollection.id">
            <ul>
                <li v-for="profile in profiles" :key="profile.id" class="profile" :class="profile == selectedProfile && 'selected'" @click="selectProfile(profile)"> {{ profile.title }}</li>
            </ul>
        </div>
    </div>

    <ProfileCrud ref="profileCrud" v-if="profileCollection && profileCollection.id" :profile-collection-id="profileCollection.id" @refresh="refreshProfiles" @new="newProfile"/>
</template>

<style scoped lang="scss">
.profile {
    cursor: pointer;
}
</style>