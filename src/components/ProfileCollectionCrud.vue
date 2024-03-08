<script setup lang="ts">
import { ref } from 'vue'

import { type IProfile } from '../models/profile'
import { type IProfileCollection } from '../models/profile-collection'
import { ProfileCollectionService } from '../services/profile-collection.service'

defineExpose({
    select
});

//const emit = defineEmits(['store']);

const profileCollection = ref<IProfileCollection>();
const selectedProfile = ref<IProfile>();

const dutchTitle = ref<string>('');
const englishTitle = ref<string>('');

const profileCollectionService = new ProfileCollectionService;

function select (id : number) {
    profileCollectionService.get(id)
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