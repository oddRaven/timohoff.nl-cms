<script setup lang="ts">
import { ref } from 'vue'

import LogoutButton from '../components/LogoutButton.vue'
import SectionsStructure from '../components/SectionsStructure.vue'
import SectionCrud from '../components/SectionCrud.vue'
import SectionItemCrud from '../components/SectionItemCrud.vue'

let sectionStructure = ref();
let sectionCrud = ref();
let sectionItemCrud = ref();
let sectionId = 0;

const isSectionSelected = ref(false);

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
}

function saveSectionItem (type_ : string, id : number) {
    sectionItemCrud.value.store(type_, id, sectionId);
}

function clearSection () {
    isSectionSelected.value = false;
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