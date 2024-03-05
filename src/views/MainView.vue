<script setup lang="ts">
import { ref } from 'vue'

import LogoutButton from '../components/LogoutButton.vue'
import SectionsStructure from '../components/SectionsStructure.vue'
import SectionCrud from '../components/SectionCrud.vue'

let sectionStructure = ref();
let sectionCrud = ref();

const refresh = () => {
    sectionStructure.value.refresh();
}

function selectSection (sectionId : number) {
    sectionCrud.value.select(sectionId);
}
</script>

<template>
  <main>
    <div class="content">
        <LogoutButton />
    </div>
    <div class="content">
        <h2>Site structure</h2>
        <SectionsStructure ref="sectionStructure"  @select="selectSection" />
    </div>
    <div class="content">
        <h2>Section edit</h2>
        <SectionCrud ref="sectionCrud" @refresh="refresh" />
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