<script setup lang="ts">
import { ref } from 'vue'

import SelectionList from '@/components/SelectionList.vue'
import WaypointCrud from '../components/WaypointCrud.vue'
import { type IPhase, Phase } from '../models/phase'
import { type IWaypoint, Waypoint } from '../models/waypoint'
import { PhaseService } from '../services/phase.service'
import { TranslationService } from '../services/translation.service'
import { WaypointService } from '../services/waypoint.service'

defineExpose({
    select
});

const emit = defineEmits(['new', 'refresh']);

const prop = defineProps(['timelineId'])

const phase = ref<IPhase>();
const waypoints = ref<IWaypoint[]>([]);
const selectedWaypoint = ref<IWaypoint>();

const dutchTitle = ref('');
const englishTitle = ref('');

const waypointCrud = ref();
const waypointList = ref();

const phaseService = new PhaseService;
const waypointService = new WaypointService;
const translationService = new TranslationService;

function clear () {
    phase.value = new Phase();
    dutchTitle.value = '';
    englishTitle.value = '';
    waypoints.value = [];

    emit('new');
}

function refreshWaypoints () {
    if (!phase.value || !phase.value.id) {
        waypoints.value = [];
        return;
    }

    waypointService.getByPhase(phase.value.id)
        .then((response : any) => {
            waypoints.value = response.data;
        });
}

function newWaypoint () {
    selectWaypoint(new Waypoint());
}

function select (phaseSubject : IPhase) {
    phase.value = phaseSubject;

    if (!phase.value || !phase.value.id) {
        dutchTitle.value = '';
        englishTitle.value = '';
        waypoints.value = [];
        return;
    }

    phaseService.get(phase.value.id)
        .then((response) => {
            let data : IPhase = response.data as IPhase;
            dutchTitle.value = data.title_translations?.filter((translation) => translation.language_code == 'nl')[0]?.text ?? data.title;
            englishTitle.value = data.title_translations?.filter((translation) => translation.language_code == 'en')[0]?.text ?? data.title;

            phase.value = {
                ...phase.value,
                ...data
            };

            refreshWaypoints();
            newWaypoint();
        });
}

function save () {
    if (phase.value && phase.value.id) {
        update();
    }
    else {
        store();
    }
}

function update () {
    if(!phase.value || !phase.value.id){
        return;
    }

    phase.value.timeline_id = prop['timelineId'];
    phase.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    phaseService.put(phase.value.id, phase.value)
        .then(() => {
            emit('refresh');
        });
}

function store () {
    if (!phase.value) {
        return;
    }

    phase.value.timeline_id = prop['timelineId'];
    phase.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    phaseService.post(phase.value)
        .then((response : any) => {
            phase.value!.id = response.data.phase?.id ?? response.data.id;

            emit('refresh');
        });
}

function delete_ () {
    if (!phase.value || !phase.value.id) {
        return;
    }

    phaseService.delete(phase.value.id)
        .then(() => {
            clear();
            emit('refresh');
        });
}

function selectWaypoint (waypoint : IWaypoint) {
    selectedWaypoint.value = waypoint;

    window.setTimeout(() => {
        waypointList.value.assign(selectedWaypoint.value);

        if (waypointCrud.value) {
            waypointCrud.value.select(selectedWaypoint.value);
        }
    });
}
</script>

<template>
    <div class="body-row">
        <h2>Phase edit</h2>

        <input type="button" value="Nieuw" @click="clear" >

        <input v-if="phase" type="text" v-model="dutchTitle" placeholder="Titel" >
        <input v-if="phase" type="text" v-model="englishTitle" placeholder="Title" >
        <input v-if="phase" type="text" v-model="phase.color" placeholder="Color" >

        <input v-if="phase" type="button" value="Opslaan" @click="save" >
        <input v-if="phase && phase.id" type="button" value="Verwijder" @click="delete_" >

        <SelectionList
            ref="waypointList"
            class="row"
            v-if="phase && phase.id"
            listName="Waypoints"
            :items="waypoints"
            keyProperty="id"
            valueProperty="title"
            @select="selectWaypoint"
        />
    </div>

    <WaypointCrud ref="waypointCrud" v-if="phase && phase.id" :phase-id="phase.id" @refresh="refreshWaypoints" @new="newWaypoint"/>
</template>