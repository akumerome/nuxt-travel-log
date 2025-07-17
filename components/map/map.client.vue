<script lang="ts" setup>

const colorMode = useColorMode();

const style = computed(() =>
    colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty"
);

const center = [-1.559482, 47.21322];
const zoom = 8;
</script>

<template>
<MglMap :map-style="style" :center="center" :zoom="zoom">
    <MglNavigationControl />
</MglMap>
</template>