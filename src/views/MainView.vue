<script setup lang="ts">
import { ref } from 'vue'

import LogoutButton from '../components/LogoutButton.vue'
import SectionsStructure from '../components/SectionsStructure.vue'
import SectionCrud from '../components/SectionCrud.vue'
import SectionItemCrud from '../components/SectionItemCrud.vue'

import { type ISection, Section } from '../models/section'
import { type ISectionItem, SectionItem } from '../models/section-item'

const sectionStructure = ref();
const sectionCrud = ref();
const sectionItemCrud = ref();

const selectedSection = ref<ISection>();
const selectedSectionItem = ref<ISectionItem>();

const refresh = () => {
    sectionStructure.value.refresh();
}

function selectSection (section : ISection) {
    selectedSection.value = section;
    sectionCrud.value.select(selectedSection.value);

    clearSectionItem();
}

function selectSectionItem (sectionItem : ISectionItem) {
    selectedSectionItem.value = sectionItem;

    window.setTimeout(() => {
        sectionItemCrud.value.select(selectedSectionItem.value);
    });
}

function clearSection () {
    selectSection(new Section());
}

function clearSectionItem () {
    selectSectionItem(new SectionItem());
}
</script>

<template>
  <main>
    <LogoutButton />
    <SectionsStructure ref="sectionStructure" @selectSection="selectSection" @selectSectionItem="selectSectionItem" />
    <SectionCrud ref="sectionCrud" @refresh="refresh" @new="clearSection" />
    <SectionItemCrud ref="sectionItemCrud" v-if="selectedSection && selectedSection.id" :sectionId="selectedSection.id" @refresh="refresh" @new="clearSectionItem" />
  </main>
</template>

<style scoped>
    .content {
        padding: 5px;

        &:nth-child(even) {
            background: lightblue;
        }
    }
</style>../components/ProfileCollectionCrud.vue