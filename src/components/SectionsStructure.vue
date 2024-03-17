<script setup lang="ts">
import { ref, onMounted } from 'vue'

import SectionCrud from '../components/SectionCrud.vue'
import SectionItemCrud from '../components/SectionItemCrud.vue'
import SelectionList from '../components/SelectionList.vue'

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
const sectionList = ref();
const sectionItemList = ref();

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
        sectionList.value.assign(selectedSection.value);
        sectionCrud.value.select(selectedSection.value);
    });
}

function selectSectionItem (sectionItem : ISectionItem) {
    selectedSectionItem.value = sectionItem;

    window.setTimeout(() => {
        sectionItemList.value.assign(selectedSectionItem.value);

        if (sectionItemCrud.value) {
            sectionItemCrud.value.select(selectedSectionItem.value);
        }
    });
}

onMounted(() => {
    refreshSections();
});
</script>

<template>
    <div class="body-row">
        <h2>Site Layout</h2>

        <div class="container">
            <SelectionList ref="sectionList" listName="Sections" :items="sections" keyProperty="id" valueProperty="title" @select="selectSection" />
            <SelectionList ref="sectionItemList" listName="Section Items" :items="sectionItems" keyProperty="item_id" valueProperty="title" @select="selectSectionItem" />
        </div>
    </div>

    <SectionCrud ref="sectionCrud" @refresh="refreshSections" @new="newSection" />
    <SectionItemCrud ref="sectionItemCrud" v-if="selectedSection && selectedSection.id" :sectionId="selectedSection.id" @refresh="refreshSectionItems" @new="newSectionItem" />
</template>

<style scoped lang="scss">
    .container {
        display: flex;
        flex-direction: row;
    }
</style>