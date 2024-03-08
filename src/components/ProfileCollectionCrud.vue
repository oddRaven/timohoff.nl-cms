<script setup lang="ts">
import { ref } from 'vue'
import axios from "axios";

import { type IProfile, Profile } from '../models/profile'
import { type IProfileCollection, ProfileCollection } from '../models/profile-collection'

defineExpose({
    select
});

//const emit = defineEmits(['store']);

const profileCollection = ref<IProfileCollection>();
const selectedProfile = ref<IProfile>();

const dutchTitle = ref<string>('');
const englishTitle = ref<string>('');

function select (id : number) {
    const url : string = 'http://localhost/api/article/' + id;

    const config = {
        headers: {
            'Content-Language': 'en'
        }
    };

    axios.get(url, config)
        .then((response) => {
            profileCollection.value = response.data;
            dutchTitle.value = profileCollection.value!.title_translations.filter((translation) => translation.language_code == 'nl')[0].text;
            englishTitle.value = profileCollection.value!.title_translations.filter((translation) => translation.language_code == 'en')[0].text;
        });
}

function selectProfile (profile : IProfile) {
    selectedProfile.value = profile;
}
</script>

<template>
    <div v-if="profileCollection">
        <ul>
            <li v-for="profile in profileCollection.profiles" :key="profile.id" :class="profile == selectedProfile && 'selected'" @click="selectProfile(profile)"> {{ profile.title }}</li>
        </ul>
    </div>
</template>