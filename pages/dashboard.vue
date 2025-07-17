<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"],
});

const route = useRoute();
const locationsStore = useLocationsStore();

onMounted(() => {
    if (route.path !== "/dashboard") {
        locationsStore.refresh();
    }
});
</script>

<template>
<div class="flex-1 flex">
    <Sidebar></Sidebar>
    <div class="flex-1 flex">
        <NuxtPage></NuxtPage>
    </div>
</div>
</template>
