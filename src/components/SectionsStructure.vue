<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { type ISection } from '../models/section'
import { type ISectionItem } from '../models/section-item'
import { SectionService } from '../services/section.service'
import { SectionItemService } from '../services/section-item.service'

defineExpose({
    refresh
});

const emit = defineEmits(['selectSection', 'selectSectionItem']);

const sections = ref<ISection[]>([]);
const sectionItems = ref<ISectionItem[]>([]);

const sectionService = new SectionService;
const sectionItemService = new SectionItemService;

let selectedSection : ISection;

function refresh () {
    sectionService.getAll()
        .then(response => {
            sections.value = response.data;
        });

    refreshSectionItems();
}

function refreshSectionItems(){
    if (!selectedSection || !selectedSection.id) {
        sectionItems.value = [];
        return;
    }

    sectionItemService.getBySection(selectedSection.id)
        .then((response) => {
            sectionItems.value = response.data;
        });
}

function selectSection (section : ISection) {
    emit('selectSection', section);
    selectedSection = section;

    refreshSectionItems();
}

function selectSectionItem (sectionItem : ISectionItem) {
    emit('selectSectionItem', sectionItem);
}

onMounted(() => {
    refresh();
});
</script>

<template>
    <div>
        <h2>Site Layout</h2>

        <div class="container">
            <div class="list">
                <header>Sections</header>
                <ul>
                    <li v-for="section in sections" :key="section.id" @click="selectSection(section)"> {{ section.title }}</li>
                </ul>
            </div>
            <div class="list">
                <header>Section Items</header>
                <ul>
                    <li v-for="sectionItem in sectionItems" :key="sectionItem.item_id" @click="selectSectionItem(sectionItem)"> {{ sectionItem.title }}</li>
                </ul>
            </div>
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