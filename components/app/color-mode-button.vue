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
<ClientOnly>
    <UButton :icon="isDark ? 'i-tabler-moon' : 'i-tabler-sun-high'" color="neutral" variant="outline"
        @click="isDark = !isDark" />
</ClientOnly>
</template>
