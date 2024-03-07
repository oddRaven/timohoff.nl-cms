<script setup lang="ts">
import { ref } from 'vue'

import ArticleCrud from '../components/ArticleCrud.vue'
import LogoutButton from '../components/LogoutButton.vue'
import SectionsStructure from '../components/SectionsStructure.vue'
import SectionCrud from '../components/SectionCrud.vue'
import SectionItemCrud from '../components/SectionItemCrud.vue'

const articleCrud = ref();
const sectionStructure = ref();
const sectionCrud = ref();
const sectionItemCrud = ref();
const isSectionSelected = ref(false);
const isSectionItemArticleSelected = ref();

let sectionId = 0;

const refresh = () => {
    sectionStructure.value.refresh();
}

function selectSection (id : number) {
    isSectionSelected.value = true;
    sectionId = id;
    sectionCrud.value.select(id);
}

function selectSectionItem (object_ : any) {
    sectionItemCrud.value.select(object_.type_, object_.id);

    if (object_.type_ == 'Articles') {
        isSectionItemArticleSelected.value = true;
        articleCrud.value.select(object_.id);
    }
}

function storeSectionItem (object_ : any) {
    sectionItemCrud.value.store(object_.type_, object_.id, sectionId);
}

function clearSection () {
    isSectionSelected.value = false;
    isSectionItemArticleSelected.value = false;
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
    <div class="content" v-if="isSectionSelected">
        <h2>Section Item edit</h2>
        <SectionItemCrud ref="sectionItemCrud" @refresh="refresh" />
    </div>
    <div class="content" v-if="isSectionItemArticleSelected">
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
</style>