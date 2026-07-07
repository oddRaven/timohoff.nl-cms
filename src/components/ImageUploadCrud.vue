<script setup lang="ts">
import { computed } from 'vue'

import RetryImage from '../components/RetryImage.vue'
import { FileService } from '../services/file.service'

const props = withDefaults(defineProps<{
    label?: string;
    alt?: string;
    baseUrl?: string;
    nameLocked?: boolean;
}>(), {
    label: 'Afbeelding',
    alt: 'Afbeelding',
    baseUrl: 'https://file.timohoff.nl/',
    nameLocked: false
});

const imageName = defineModel<string | null>();

const fileService = new FileService;

const imageSrc = computed(() => {
    const name = imageName.value?.trim();

    if (!name) {
        return '';
    }

    return `${props.baseUrl}${name}`;
});

function setName(value: string) {
    imageName.value = value.trim() === '' ? null : value;
}

function upload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
        return;
    }

    const newName = imageName.value?.trim() || file.name;

    fileService.upload(file, newName)
        .then((response : any) => {
            imageName.value = response.data.filename ?? null;
        })
        .catch((error : any) => {
            console.error('File upload error', error);
        });
}
</script>

<template>
    <div>
        <div>{{ label }}</div>
        <input
            :value="imageName ?? ''"
            type="text"
            :disabled="nameLocked"
            @input="setName(($event.target as HTMLInputElement).value)"
        />
        <input
            type="file"
            @change="upload"
        />
        <RetryImage
            v-if="imageSrc"
            :src="imageSrc"
            :alt="alt"
        />
    </div>
</template>
