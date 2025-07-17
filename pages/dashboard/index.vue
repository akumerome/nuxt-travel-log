<script lang="ts" setup>
const { data, status } = useFetch("/api/locations", {
    lazy: true,
});
</script>

<template>
<div class="flex-1 container max-w-xl mx-auto mt-6 flex flex-col">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Locations</h1>
    </div>
    <div class="flex-1 flex flex-col justify-center items-center lg:justify-start">
        <div v-if="status === 'pending'">
            <AppLoader />
        </div>
        <div v-else-if="data?.data?.locations.length" class="flex gap-4">
            <UCard class="bg-muted w-[275px] shadow-xl" v-for="location in data.data.locations">
                <div class="h-28 w-72">
                    <div class="text-lg font-bold">{{ location.name }}</div>
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