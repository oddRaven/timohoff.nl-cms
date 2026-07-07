<script setup lang="ts">
import { ref, computed } from 'vue'

import { ProfileService } from '../services/profile.service'
import { TranslationService } from '../services/translation.service'
import { type IProfile, Profile } from '../models/profile'
import ArticleCrud from '../components/ArticleCrud.vue'
import RetryImage from '../components/RetryImage.vue'
import { FileService } from '../services/file.service'

defineExpose({
    select
});

const emit = defineEmits(['new', 'refresh']);

const prop = defineProps(['profileCollectionId'])

const profile = ref<IProfile>();
const dutchTitle = ref('');
const englishTitle = ref('');
const imageName = ref<string | null>(null);
const articleCrud = ref();

const fileService = new FileService;
const profileService = new ProfileService;
const translationService = new TranslationService;

const IsImageNameDisabled = computed(() => !profile.value?.image_name);

const ImageSrc = computed(() => {
    let name = null;

    if (
        profile.value &&
        profile.value.image_name != null &&
        profile.value.image_name.trim() != ''
    ) {
        name = profile.value.image_name;
    }
    else if (
        imageName.value != null &&
        imageName.value.trim() != ''
    ) {
        name = imageName.value;
    }
    else {
        return '';
    }

    return `https://file.timohoff.nl/${name}`;
});

function clear () {
    profile.value = new Profile();
    dutchTitle.value = '';
    englishTitle.value = '';
    imageName.value = null;

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
            imageName.value = data.image_name;
            articleCrud.value.select(data.article_id);
        });
}

function upload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        return;
    }

    let newName = imageName.value ?? file.name;

    fileService.upload(file, newName)
        .then((response : any) => {
            console.log('File uploaded', response.data);
            imageName.value = response.data.filename;
        })
        .catch((error : any) => {
            console.error('File upload error', error);
        });
}

function update () {
    if(!profile.value || !profile.value.id){
        return;
    }

    profile.value.profile_collection_id = prop['profileCollectionId'];
    profile.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    if (imageName.value) {
        profile.value.image_name = imageName.value;
    }

    profileService.put(profile.value.id, profile.value)
        .then(() => {
            emit('refresh');
        });
}

function save () {
    if (profile.value && profile.value.id) {
        update();
    }
    else {
        store();
    }
}

function store () {
    if (!profile.value) {
        return;
    }

    profile.value.profile_collection_id = prop['profileCollectionId'];
    profile.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    if (imageName.value) {
        profile.value.image_name = imageName.value;
    }

    profileService.post(profile.value)
        .then((response : any) => {
            profile.value!.id = response.data.profile.id;
            emit('refresh');
        });
}

function storeArticle (type_ : string, articleId : number) {
    if (type_ != 'articles' || !profile.value) {
        return;
    }

    profile.value.article_id = articleId;
    save();
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
    <div class="body-row">
        <h2>Profile edit</h2>

        <div class="row">
            <input type="button" value="Nieuw" @click="clear" >
        </div>

        <div class="row languages">
            <div class="label">Title</div>
            <input v-if="profile" type="text" v-model="dutchTitle" placeholder="Titel" >
            <input v-if="profile" type="text" v-model="englishTitle" placeholder="Title" >
        </div>

        <div
            v-if="profile"
        >
            <div>Afbeelding</div>
            <input
                v-model="imageName"
                type="text"
                :disabled="IsImageNameDisabled"
            />
            <input
                type="file"
                @change="upload"
            />
            <RetryImage
                v-if="ImageSrc"
                :src="ImageSrc"
                alt="Profile afbeelding"
            />
        </div>

        <div class="row">
            <input v-if="profile" type="button" value="Opslaan" @click="save" >
            <input v-if="profile && profile.id" type="button" value="Verwijder" @click="delete_" >
        </div>
    </div>

    <ArticleCrud v-if="profile" ref="articleCrud" @store="storeArticle" />
</template>

<style scoped lang="scss">
.row {
    display: flex;
}

.label {
    width: 50px;
}

.row {
    display: flex;
}

img {
    width: 100px;
    height: 100px;
}
</style>