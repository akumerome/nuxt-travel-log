<script lang="ts" setup>
const colorMode = useColorMode()

const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set(value) {
        colorMode.preference = value ? 'dark' : 'light'
    }
});
</script>

<template>
<UButton :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="outline"
    @click="isDark = !isDark" />
</template>
