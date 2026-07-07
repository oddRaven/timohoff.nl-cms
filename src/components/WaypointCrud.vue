<script setup lang="ts">
import { ref } from 'vue'

import ArticleCrud from '../components/ArticleCrud.vue'
import ImageUploadCrud from '../components/ImageUploadCrud.vue'
import { type IWaypoint, Waypoint } from '../models/waypoint'
import { TranslationService } from '../services/translation.service'
import { WaypointService } from '../services/waypoint.service'

defineExpose({
    select
});

const emit = defineEmits(['new', 'refresh']);

const prop = defineProps(['phaseId'])

const waypoint = ref<IWaypoint>();
const dutchTitle = ref('');
const englishTitle = ref('');
const articleCrud = ref();

const waypointService = new WaypointService;
const translationService = new TranslationService;

function clear () {
    waypoint.value = new Waypoint();
    dutchTitle.value = '';
    englishTitle.value = '';

    window.setTimeout(() => {
        articleCrud.value.clear();
    });

    emit('new');
}

function select (waypointSubject : IWaypoint) {
    waypoint.value = waypointSubject;

    if (!waypoint.value || !waypoint.value.id) {
        dutchTitle.value = '';
        englishTitle.value = '';
        return;
    }

    waypointService.get(waypoint.value.id)
        .then((response) => {
            let data : IWaypoint = response.data as IWaypoint;
            dutchTitle.value = data.title_translations?.filter((translation) => translation.language_code == 'nl')[0]?.text ?? data.title;
            englishTitle.value = data.title_translations?.filter((translation) => translation.language_code == 'en')[0]?.text ?? data.title;

            waypoint.value = {
                ...waypoint.value,
                ...data,
                is_bound: !!data.is_bound
            };

            articleCrud.value.select(data.article_id);
        });
}

function save () {
    if (waypoint.value && waypoint.value.id) {
        update();
    }
    else {
        store();
    }
}

function update () {
    if(!waypoint.value || !waypoint.value.id){
        return;
    }

    waypoint.value.phase_id = prop['phaseId'];
    waypoint.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    waypointService.put(waypoint.value.id, waypoint.value)
        .then(() => {
            emit('refresh');
        });
}

function store () {
    if (!waypoint.value) {
        return;
    }

    waypoint.value.phase_id = prop['phaseId'];
    waypoint.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    waypointService.post(waypoint.value)
        .then((response : any) => {
            waypoint.value!.id = response.data.waypoint?.id ?? response.data.id;

            emit('refresh');
        });
}

function storeArticle (type_ : string, articleId : number) {
    if (type_ != 'articles' || !waypoint.value) {
        return;
    }

    waypoint.value.article_id = articleId;
    save();
}

function delete_ () {
    if (!waypoint.value || !waypoint.value.id) {
        return;
    }

    waypointService.delete(waypoint.value.id)
        .then(() => {
            clear();
            emit('refresh');
        });
}
</script>

<template>
    <div class="body-row">
        <h2>Waypoint edit</h2>

        <input type="button" value="Nieuw" @click="clear" >

        <input v-if="waypoint" type="text" v-model="dutchTitle" placeholder="Titel" >
        <input v-if="waypoint" type="text" v-model="englishTitle" placeholder="Title" >
        <input v-if="waypoint" type="text" v-model="waypoint.location" placeholder="Location" >
        <ImageUploadCrud
            v-if="waypoint"
            v-model="waypoint.image_name"
            label="Afbeelding"
            alt="Waypoint afbeelding"
        />

        <label v-if="waypoint">
            Is bound
            <input type="checkbox" v-model="waypoint.is_bound" >
        </label>

        <input v-if="waypoint" type="button" value="Opslaan" @click="save" >
        <input v-if="waypoint && waypoint.id" type="button" value="Verwijder" @click="delete_" >
    </div>

    <ArticleCrud ref="articleCrud" v-if="waypoint" @store="storeArticle" />
</template>