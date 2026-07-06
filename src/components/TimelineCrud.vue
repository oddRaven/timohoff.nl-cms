<script setup lang="ts">
import { ref } from 'vue'

import SelectionList from '@/components/SelectionList.vue'
import PhaseCrud from '../components/PhaseCrud.vue'
import { type IPhase, Phase } from '../models/phase'
import { type ITimeline, Timeline } from '../models/timeline'
import { PhaseService } from '../services/phase.service'
import { TimelineService } from '../services/timeline.service'
import { TranslationService } from '../services/translation.service'

defineExpose({
    clear,
    select
});

const emit = defineEmits(['store']);

const timeline = ref<ITimeline>();
const phases = ref<IPhase[]>([]);
const selectedPhase = ref<IPhase>();

const dutchTitle = ref<string>('');
const englishTitle = ref<string>('');

const phaseCrud = ref();
const phaseList = ref();

const timelineService = new TimelineService;
const phaseService = new PhaseService;
const translationService = new TranslationService;

function clear() {
    timeline.value = new Timeline();
    dutchTitle.value = '';
    englishTitle.value = '';
    phases.value = [];
}

function refreshPhases () {
    if (!timeline.value || !timeline.value.id) {
        phases.value = [];
        return;
    }

    phaseService.getByTimeline(timeline.value.id)
        .then((response : any) => {
            phases.value = response.data;
        });
}

function newPhase () {
    selectPhase(new Phase());
}

function select (id : number) {
    if (!id) {
        clear();
        return;
    }

    timelineService.get(id)
        .then((response) => {
            timeline.value = response.data;
            dutchTitle.value = timeline.value!.title_translations?.filter((translation) => translation.language_code == 'nl')[0]?.text ?? timeline.value!.title;
            englishTitle.value = timeline.value!.title_translations?.filter((translation) => translation.language_code == 'en')[0]?.text ?? timeline.value!.title;

            refreshPhases();
            newPhase();
        });
}

function save () {
    if (timeline.value && timeline.value.id) {
        update()
    }
    else {
        store();
    }
}

function update () {
    if(!timeline.value || !timeline.value.id){
        return;
    }

    timeline.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    timelineService.put(timeline.value.id, timeline.value)
        .then((response : any) => {
            timeline.value = response.data.timeline ?? timeline.value;
        });
}

function delete_ () {
    if (!timeline.value || !timeline.value.id) {
        return;
    }

    timelineService.delete(timeline.value.id)
        .then(() => {
            clear();
        });
}

function store () {
    if (!timeline.value) {
        return;
    }

    timeline.value.title_translations = translationService.constructTranslations(dutchTitle.value, englishTitle.value);

    timelineService.post(timeline.value)
        .then((response : any) => {
            timeline.value!.id = response.data.timeline?.id ?? response.data.id;

            if (!timeline.value!.id) {
                return;
            }

            emit('store', 'timelines', timeline.value!.id);
        });
}

function selectPhase (phase : IPhase) {
    selectedPhase.value = phase;

    window.setTimeout(() => {
        phaseList.value.assign(selectedPhase.value);
        phaseCrud.value.select(selectedPhase.value);
    });
}
</script>

<template>
    <div class="body-row">
        <h2>Timeline edit</h2>

        <div class="row">
            <input type="button" value="Nieuw" @click="clear" >

            <input v-if="timeline" type="text" v-model="dutchTitle" placeholder="Titel" >
            <input v-if="timeline" type="text" v-model="englishTitle" placeholder="Title" >
            <input v-if="timeline" type="button" value="Opslaan" @click="save" >
            <input v-if="timeline && timeline.id" type="button" value="Verwijder" @click="delete_" >
        </div>

        <SelectionList ref="phaseList" class="row" v-if="timeline && timeline.id" listName="Phases" :items="phases" keyProperty="id" valueProperty="title" @select="selectPhase" />
    </div>

    <PhaseCrud ref="phaseCrud" v-if="timeline && timeline.id" :timeline-id="timeline.id" @refresh="refreshPhases" @new="newPhase"/>
</template>