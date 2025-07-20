<script lang="ts" setup>
const locationsStore = useLocationsStore();
const { locations, status } = storeToRefs(locationsStore);

onMounted(() => {
    locationsStore.refresh();
})
</script>

<template>
<div class="mt-6 mx-4 flex flex-col">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Locations</h1>
    </div>
    <div class="flex-1 flex flex-col overflow-auto px-0.5 pt-0.5 pb-2 scroll-container">
        <div v-if="status === 'pending'">
            <AppLoader />
        </div>
        <div v-else-if="locations?.length" class="flex gap-4">
            <UCard class="bg-muted w-72 shadow-xl rounded-md shrink-0 border-2"
                :class="[location === locationsStore.selectedLocation ? 'border-primary' : 'border-transparent']"
                v-for="location in locations" :ui="{ body: 'sm:p-4' }"
                @mouseenter="locationsStore.selectedLocation = location"
                @mouseleave="locationsStore.selectedLocation = null">
                <div class="h-16 w-72">
                    <div class="font-bold truncate">{{ location.name }}</div>
                    <div class="text-sm line-clamp-2">{{ location.description }}</div>
                </div>
            </UCard>
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