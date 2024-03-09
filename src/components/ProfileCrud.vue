<script setup lang="ts">
import { ref } from 'vue'

import { type IProfile } from '../models/profile'

const profile = ref<IProfile>();
</script>

<template>
    <div>
        <h2>Profile edit</h2>
    </div>

    <ArticleCrud ref="articleCrud" v-if="profile && profile.id" />
</template>