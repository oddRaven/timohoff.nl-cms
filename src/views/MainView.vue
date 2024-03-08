<script setup lang="ts">
import { ref } from 'vue'

import ArticleCrud from '../components/ArticleCrud.vue'
import ProfileCollectionCrud from '../components/ProfileCollectionCrud.vue'
import ProfileCrud from '../components/ProfileCrud.vue'
import LogoutButton from '../components/LogoutButton.vue'
import SectionsStructure from '../components/SectionsStructure.vue'
import SectionCrud from '../components/SectionCrud.vue'
import SectionItemCrud from '../components/SectionItemCrud.vue'

import { type ISection, Section } from '../models/section'
import { type ISectionItem, SectionItem } from '../models/section-item'

const articleCrud = ref();
const profilesCrud = ref();
const profileCrud = ref();
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
}

function selectSectionItem (sectionItem : ISectionItem) {
    selectedSectionItem.value = sectionItem;
    sectionItemCrud.value.select(selectedSectionItem.value);

    window.setTimeout(() => {
        if (sectionItem.item_type == 'Articles') {
            articleCrud.value.select(sectionItem.item_id);
        }
        else if (sectionItem.item_type == 'ProfileCollections') {
            profilesCrud.value.select(sectionItem.item_id);
        }
    });
}

function storeSectionItem (object_ : any) {
    sectionItemCrud.value.store(object_.type_, object_.id, selectedSection.value!.id);
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
    <div class="content">
        <LogoutButton />
    </div>
    <div class="content">
        <h2>Site structure</h2>
        <SectionsStructure ref="sectionStructure" @selectSection="selectSection" @selectSectionItem="selectSectionItem" />
    </div>
    <div class="content">
        <h2>Section edit</h2>
        <SectionCrud ref="sectionCrud" @refresh="refresh" @new="clearSection" />
    </div>
    <div class="content" v-if="selectedSection">
        <h2>Section Item edit</h2>
        <SectionItemCrud ref="sectionItemCrud" @refresh="refresh" @new="clearSectionItem" />
    </div>
    <div class="content" v-if="selectedSectionItem && selectedSectionItem.item_type == 'ProfileCollections'">
        <h2>Profile Collection edit</h2>
        <ProfileCollectionCrud ref="profilesCrud" @store="storeSectionItem" />
    </div>
    <div class="content" v-if="selectedSectionItem && selectedSectionItem.item_type == 'ProfileCollections'">
        <h2>Profile edit</h2>
        <ProfileCrud ref="profileCrud" @store="storeSectionItem" />
    </div>
    <div class="content" v-if="selectedSectionItem && selectedSectionItem.item_type == 'Articles'">
        <h2>Article edit</h2>
        <ArticleCrud ref="articleCrud" @store="storeSectionItem" />
    </div>
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