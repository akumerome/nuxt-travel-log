<script lang="ts" setup>
const locationsStore = useLocationsStore();

onMounted(() => {
    locationsStore.addedLocation = {
        lat: 0.1,
        long: 0.1,
    }
});

onUnmounted(() => {
    locationsStore.addedLocation = null;
});
</script>

<template>
<div class="container max-w-lg mx-auto p-4">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Add location</h1>
        <p class="text-sm text-dimmed">A location is a place you have travelled or will travel to. It can be a city,
            country, state or point of interest. You can add specific times you visited this location after adding it.
        </p>
    </div>
    <AddLocationForm></AddLocationForm>
</div>
</template>