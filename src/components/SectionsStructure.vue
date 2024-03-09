<script setup lang="ts">
import { ref, onMounted } from 'vue'

import SectionCrud from '../components/SectionCrud.vue'
import SectionItemCrud from '../components/SectionItemCrud.vue'

import { type ISection, Section } from '../models/section'
import { type ISectionItem, SectionItem } from '../models/section-item'

import { SectionService } from '../services/section.service'
import { SectionItemService } from '../services/section-item.service'

defineExpose({
    refreshSections
});

const sections = ref<ISection[]>([]);
const sectionItems = ref<ISectionItem[]>([]);

const selectedSection = ref<ISection>();
const selectedSectionItem = ref<ISectionItem>();

const sectionCrud = ref();
const sectionItemCrud = ref();

const sectionService = new SectionService;
const sectionItemService = new SectionItemService;

function refreshSections () {
    sectionService.getAll()
        .then(response => {
            sections.value = response.data;
        });

    refreshSectionItems();
}

function refreshSectionItems(){
    if (!selectedSection.value || !selectedSection.value.id) {
        sectionItems.value = [];
        return;
    }

    sectionItemService.getBySection(selectedSection.value.id)
        .then((response) => {
            sectionItems.value = response.data;
        });
}

function newSection () {
    selectSection(new Section());
}

function newSectionItem () {
    selectSectionItem(new SectionItem());
}

function selectSection (section : ISection) {
    selectedSection.value = section;

    refreshSectionItems();
    newSectionItem();

    window.setTimeout(() => {
        sectionCrud.value.select(selectedSection.value);
    });
}

function selectSectionItem (sectionItem : ISectionItem) {
    selectedSectionItem.value = sectionItem;

    window.setTimeout(() => {
        sectionItemCrud.value.select(selectedSectionItem.value);
    });
}

onMounted(() => {
    refreshSections();
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

    <SectionCrud ref="sectionCrud" @refresh="refreshSections" @new="newSection" />
    <SectionItemCrud ref="sectionItemCrud" v-if="selectedSection && selectedSection.id" :sectionId="selectedSection.id" @refresh="refreshSectionItems" @new="newSectionItem" />
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