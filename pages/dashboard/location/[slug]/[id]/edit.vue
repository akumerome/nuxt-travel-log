<script setup lang="ts">
const locationsStore = useLocationsStore();
const mapStore = useMapStore();

onMounted(() => {
    mapStore.addedPoint = {
        _id: "1",
        name: "Added Point",
        lat: locationsStore.currentLocationLog?.data.location_log.lat || 0.1,
        long: locationsStore.currentLocationLog?.data.location_log.long || 0.1,
        zoom: 14,
    }
});

onUnmounted(() => {
    mapStore.addedPoint = null;
});

</script>

<template>
<div class="max-w-lg">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Edit location log</h1>
        <p class="text-sm text-dimmed">A location is a place you have travelled or will travel to. It can be a city,
            country, state or point of interest. You can add specific times you visited this location after adding it.
        </p>
    </div>
    <EditLocationLogForm
        v-if="locationsStore.currentLocationLogStatus !== 'pending' && locationsStore.currentLocationLog">
    </EditLocationLogForm>
</div>
</template>