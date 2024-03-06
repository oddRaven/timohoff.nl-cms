<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from 'vue'

import { type ISection } from '../models/section'
import { type ISectionItem } from '../models/section-item'

defineExpose({
    refresh
});

const emit = defineEmits(['selectSection', 'selectSectionItem']);

const sections = ref<ISection[]>([]);
const sectionItems = ref<ISectionItem[]>([]);

let sectionId : number = 0;

function refresh () {
    const config = {
        headers: {
            'Content-Language': 'en'
        }
    };

    const url = 'http://localhost/api/section';

    axios.get(url, config)
        .then((response) => {
            sections.value = response.data;
        });

    refreshSectionItems();
}

function refreshSectionItems(){
    if (sectionId === 0) {
        sectionItems.value = [];
        return;
    }

    const config = {
        headers: {
            'Content-Language': 'en'
        }
    };

    const url = 'http://localhost/api/section-item?section_id=' + sectionId;

    axios.get(url, config)
        .then((response) => {
            sectionItems.value = response.data;
        });
}

function selectSection (id : number) {
    emit('selectSection', id);

    sectionId = id;
    refreshSectionItems();
}

function selectSectionItem (id : number, type_ : string) {
    emit('selectSectionItem', { 'type_': type_, 'id': id });
}

onMounted(() => {
    refresh();
});
</script>

<template>
    <div class="container">
        <div class="list">
            <header>Sections</header>
            <ul>
                <li v-for="section in sections" :key="section.id" @click="selectSection(section.id!)"> {{ section.title }}</li>
            </ul>
        </div>
        <div class="list">
            <header>Section Items</header>
            <ul>
                <li v-for="sectionItem in sectionItems" :key="sectionItem.item_id" @click="selectSectionItem(sectionItem.item_id!, sectionItem.item_type!)"> {{ sectionItem.title }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: row;

        ul {
            padding: 0px;
            margin: 0px;

            li {
                list-style: none;
                cursor: pointer;
                user-select: none;
                width: 100px;
                background: beige;
                padding: 2px;
            }
        }
    }
</style>