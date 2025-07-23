<script lang="ts" setup>
const locationsStore = useLocationsStore();
const { data, status } = storeToRefs(locationsStore);
const mapStore = useMapStore();

onMounted(() => {
    locationsStore.refresh();
})
</script>

<template>
<div class="mt-4 mx-4 flex flex-col">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Locations</h1>
    </div>
    <div class="flex-1 flex flex-col overflow-auto px-0.5 pt-0.5 pb-2 scroll-container">
        <div v-if="status === 'pending'">
            <AppLoader />
        </div>
        <div v-else-if="data?.data.locations?.length" class="flex gap-4">
            <NuxtLink v-for="location in data.data.locations" :to="`/dashboard/location/${location.slug}`">
                <UCard class="bg-muted w-72 shadow-xl rounded-md shrink-0 border-2"
                    :class="[isPointSelected(location, mapStore.selectedPoint) ? 'border-primary' : 'border-transparent']"
                    :ui="{ body: 'sm:p-4' }" @mouseenter="mapStore.selectedPoint = createMapPointFromLocation(location)"
                    @mouseleave="mapStore.selectedPoint = null">
                    <div class="h-16 w-72">
                        <div class="font-bold truncate">{{ location.name }}</div>
                        <div class="text-sm line-clamp-2">{{ location.description }}</div>
                    </div>
                </UCard>
            </NuxtLink>
        </div>
        <div v-else class="flex-1 flex flex-col justify-center items-center gap-2">
            <p class="text-sm text-dimmed">Add a location to get started.</p>
            <UButton color="neutral" size="lg" to="/dashboard/add" trailing-icon="i-lucide-map-pin-plus">Add
                location
            </UButton>
        </div>
    </div>
</div>
</template>