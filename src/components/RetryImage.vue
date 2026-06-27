<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        src?: string | null
        alt?: string
        maxRetries?: number
        baseDelayMs?: number
    }>(),
    {
        src: null,
        alt: '',
        maxRetries: 20,
        baseDelayMs: 500
    }
)

const reloadKey = ref(0)
const retryCount = ref(0)
let retryTimer: number | null = null

const effectiveSrc = computed(() => {
    if (!props.src) {
        return ''
    }

    return `${props.src}?r=${reloadKey.value}`
})

function clearRetryTimer() {
    if (retryTimer !== null) {
        window.clearTimeout(retryTimer)
        retryTimer = null
    }
}

function resetRetryState() {
    clearRetryTimer()
    retryCount.value = 0
}

function scheduleRetry() {
    if (!props.src || retryCount.value >= props.maxRetries) {
        return
    }

    clearRetryTimer()
    const delay = Math.min(props.baseDelayMs * Math.pow(2, retryCount.value), 5000)

    retryTimer = window.setTimeout(() => {
        retryCount.value += 1
        reloadKey.value += 1
    }, delay)
}

function handleLoad() {
    resetRetryState()
}

function handleError() {
    scheduleRetry()
}

watch(
    () => props.src,
    () => {
        resetRetryState()
        reloadKey.value += 1
    }
)

onBeforeUnmount(() => {
    clearRetryTimer()
})
</script>

<template>
    <img
        v-if="effectiveSrc"
        :src="effectiveSrc"
        :alt="alt"
        @load="handleLoad"
        @error="handleError"
    />
</template>
