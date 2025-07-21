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
    <div class="flex-1 overflow-auto">
        <div class="flex size-full" :class="[route.path !== '/dashboard/add' ? 'flex-col' : undefined]">
            <NuxtPage></NuxtPage>
            <Map class="flex-1"></Map>
        </div>
    </div>
</div>
</template>
