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

async function deleteLocation() {
    await $fetch(`/api/locations/${route.params.slug}`, {
        method: "DELETE",
    });

    await navigateTo("/dashboard");
}
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
                <AppModal title="Delete location?" description="Deleting this location will also delete all of the associated logs. This
                action cannot be undoned. Are you sure?" onConfirmedLabel="Delete" :onConfirmed="deleteLocation">
                    <template #trigger>
                        <UButton color="error" icon="i-tabler-trash-x-filled" variant="outline" />
                    </template>
                </AppModal>
            </div>
            <p class="text-sm text-dimmed">{{ data.data.location.description }}</p>
        </div>
        <div v-if="!data.data.location.location_logs.length" class="flex flex-col justify-center items-center gap-2">
            <p class="text-sm text-dimmed">{{ data.data.location.name }} has no location logs yet!</p>
            <UButton color="neutral" size="lg" :to="`/dashboard/location/${data.data.location.slug}/add`"
                trailing-icon="i-tabler-map-pin-plus">Add
                location log
            </UButton>
        </div>
        <div v-if="data.data.location.location_logs.length" class="flex gap-4 scroll-container">
            <MapPointCard v-for="location_log in data.data.location.location_logs" :key="location_log._id"
                :map-point="createMapPointFromLocationLog(data.data.location, location_log)">
                <template #footer>
                    <p class="text-sm text-dimmed">
                        <span v-if="location_log.started_at !== location_log.ended_at">
                            {{ formatTimestamp(location_log.started_at) }} - {{ formatTimestamp(location_log.ended_at)
                            }}
                        </span>
                        <span v-else>{{ formatTimestamp(location_log.started_at) }}</span>
                    </p>
                </template>
            </MapPointCard>
        </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
        <NuxtPage></NuxtPage>
    </div>
</div>
</template>