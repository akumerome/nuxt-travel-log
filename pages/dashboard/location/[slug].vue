<script lang="ts" setup>
const route = useRoute();
const locationsStore = useLocationsStore();
const { currentLocation: data, currentLocationStatus: status, currentLocationError: error } = storeToRefs(locationsStore);

onMounted(() => {
    locationsStore.refreshCurrentLocation();
});

onBeforeRouteUpdate((to) => {
    if (to.name === "dashboard-location-slug") {
        locationsStore.refreshCurrentLocation();
    }
});
</script>

<template>
<div class="mt-4 mx-4">
    <div v-if="status === 'pending'">
        <AppLoader />
    </div>
    <div v-if="status !== 'pending' && error">
        <UAlert v-if="error" color="error" icon="i-tabler-circle-x" :title="error.statusMessage" />
    </div>
    <div v-if="route.name === 'dashboard-location-slug' && status !== 'pending' && data?.data.location">
        <div class="mb-4">
            <div class="flex gap-3">
                <h1 class="text-2xl font-bold">{{ data.data.location.name }}</h1>
                <DeleteLocationModal></DeleteLocationModal>
            </div>
            <p class="text-sm text-dimmed">{{ data.data.location.description }}</p>
        </div>
        <div v-if="!data.data.location.location_logs.length" class="flex flex-col justify-center items-center gap-2">
            <p class="text-sm text-dimmed">{{ data.data.location.name }} has no location logs yet!</p>
            <UButton color="neutral" size="lg" to="/dashboard/add" trailing-icon="i-tabler-map-pin-plus">Add
                location log
            </UButton>
        </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
        <NuxtPage></NuxtPage>
    </div>
</div>
</template>