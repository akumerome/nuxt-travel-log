<script lang="ts" setup>
const locationsStore = useLocationsStore();
const { locations: data, locationsStatus: status } = storeToRefs(locationsStore);
const mapStore = useMapStore();

onMounted(() => {
    locationsStore.refreshLocations();
})
</script>

<template>
<div class="mt-4 mx-4 flex flex-col">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Locations</h1>
    </div>
    <div class="flex-1 flex flex-col">
        <div v-if="status === 'pending'">
            <AppLoader />
        </div>
        <div v-else-if="data?.data.locations?.length" class="flex gap-4 scroll-container">
            <MapPointCard v-for="location in data.data.locations" :key="location._id"
                :map-point="createMapPointFromLocation(location)"></MapPointCard>
        </div>
        <div v-else class="flex-1 flex flex-col justify-center items-center gap-2">
            <p class="text-sm text-dimmed">Add a location to get started.</p>
            <UButton color="neutral" size="lg" to="/dashboard/add" trailing-icon="i-tabler-map-pin-plus">Add
                location
            </UButton>
        </div>
    </div>
</div>
</template>