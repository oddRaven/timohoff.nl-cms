<script setup lang="ts">
import { ref } from 'vue'

import LogoutButton from '../components/LogoutButton.vue'
import SectionsStructure from '../components/SectionsStructure.vue'

const sectionStructure = ref();

</script>

<template>
  <main>
    <LogoutButton />
    <SectionsStructure ref="sectionStructure" />
  </main>
</template>

<style lang="scss">
.body-row {
    padding: 10px;
    outline: 1px solid black;
}
</style>