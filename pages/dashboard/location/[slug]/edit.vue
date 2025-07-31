<script setup lang="ts">
const locationsStore = useLocationsStore();
const mapStore = useMapStore();

onMounted(() => {
    mapStore.addedPoint = {
        _id: locationsStore.currentLocation?.data.location._id || "1",
        name: locationsStore.currentLocation?.data.location.name || "Added Point",
        lat: locationsStore.currentLocation?.data.location.lat || 0.1,
        long: locationsStore.currentLocation?.data.location.long || 0.1,
    }
});

onUnmounted(() => {
    mapStore.addedPoint = null;
});
</script>

<template>
<div class="max-w-lg">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Edit location</h1>
        <p class="text-sm text-dimmed">A location is a place you have travelled or will travel to. It can be a city,
            country, state or point of interest. You can add specific times you visited this location after adding it.
        </p>
    </div>
    <EditLocationForm v-if="locationsStore.currentLocationStatus !== 'pending' && locationsStore.currentLocation">
    </EditLocationForm>
</div>
</template>