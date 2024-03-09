<script setup lang="ts">
import { ref } from 'vue'

import { type IProfile } from '../models/profile'
import { type IProfileCollection, ProfileCollection } from '../models/profile-collection'
import { ProfileCollectionService } from '../services/profile-collection.service'
import ProfileCrud from '../components/ProfileCrud.vue'

defineExpose({
    clear,
    select
});

const emit = defineEmits(['storeSectionItem']);

const profileCollection = ref<IProfileCollection>();
const selectedProfile = ref<IProfile>();

const dutchTitle = ref<string>('');
const englishTitle = ref<string>('');

const profileCollectionService = new ProfileCollectionService;

function clear() {
    console.log('clear');
    profileCollection.value = new ProfileCollection();
    dutchTitle.value = '';
    englishTitle.value = '';
}

function select (id : number) {
    console.log('selected', id);
    if (!id) {
        profileCollection.value = new ProfileCollection();
        return;
    }

    profileCollectionService.get(id)
        .then((response) => {
            profileCollection.value = response.data;
            dutchTitle.value = profileCollection.value!.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = profileCollection.value!.title_translations.filter((translation) => translation.language_code == 'en')[0].text;
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

    setTranslations();

    profileCollectionService.put(profileCollection.value.id, profileCollection.value)
        .then((response : any) => {
            profileCollection.value = response.data.profile_collection;
        });
}

function store () {
    if (!profileCollection.value) {
        return;
    }

    setTranslations();

    profileCollectionService.post(profileCollection.value)
        .then((response : any) => {
            profileCollection.value = response.data.profileCollection;

            emit('storeSectionItem', 'profile_collections', response.data.profile_collection.id);
        });
}

function setTranslations () {
    profileCollection.value!.title_translations = [
        {
            language_code: 'nl',
            text: dutchTitle.value,
        },
        {
            language_code: 'en',
            text: englishTitle.value,
        }
    ];
}

function delete_ () {

}

function selectProfile (profile : IProfile) {
    selectedProfile.value = profile;
}
</script>

<template>
    <div>
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
                <li v-for="profile in profileCollection.profiles" :key="profile.id" :class="profile == selectedProfile && 'selected'" @click="selectProfile(profile)"> {{ profile.title }}</li>
            </ul>
        </div>
    </div>

    <ProfileCrud ref="profileCrud" v-if="selectedProfile" />
</template>