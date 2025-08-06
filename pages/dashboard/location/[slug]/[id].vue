<script lang="ts" setup>
import type { ILocationLogImage } from '~/types/types';


const config = useRuntimeConfig();
const route = useRoute();
const locationsStore = useLocationsStore();
const { currentLocationLog: data, currentLocationLogStatus: status, currentLocationLogError: error } = storeToRefs(locationsStore);

onMounted(() => {
    locationsStore.refreshCurrentLocationLog();
});

onBeforeRouteUpdate((to) => {
    if (to.name === "dashboard-location-slug-id") {
        locationsStore.refreshCurrentLocationLog();
    }
});

async function deleteLocationLog() {
    await $fetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
        method: "DELETE",
    });

    await navigateTo(`/dashboard/location/${route.params.slug}`);
}

async function deleteLocationLogImage(image: ILocationLogImage) {
    await $fetch(`/api/locations/${route.params.slug}/${route.params.id}/image/${image._id}`, {
        method: "DELETE",
    });

    await locationsStore.refreshCurrentLocationLog();
}
</script>

<template>
<div>
    <div v-if="status === 'pending'">
        <AppLoader />
    </div>
    <div v-if="status !== 'pending' && error">
        <UAlert v-if="error" color="error" icon="i-tabler-circle-x" :title="error.statusMessage" />
    </div>
    <div v-if="route.name === 'dashboard-location-slug-id' && status !== 'pending' && data?.data.location_log">
        <div class="mb-4">
            <div class="flex gap-3">
                <h1 class="text-2xl font-bold">{{ data.data.location_log.name }}</h1>
                <AppModal title="Delete location log?"
                    description="Deleting this location log cannot be undoned. Are you sure?" onConfirmedLabel="Delete"
                    :onConfirmed="deleteLocationLog">
                    <template #trigger>
                        <UButton color="error" icon="i-tabler-trash-x-filled" variant="outline" />
                    </template>
                </AppModal>
            </div>
            <p class="text-sm text-dimmed">{{ data.data.location_log.description }}</p>
            <p class="text-sm text-dimmed">
                <span v-if="data.data.location_log.started_at !== data.data.location_log.ended_at">
                    {{ formatTimestamp(data.data.location_log.started_at) }} - {{
                        formatTimestamp(data.data.location_log.ended_at)
                    }}
                </span>
                <span v-else>{{ formatTimestamp(data.data.location_log.started_at) }}</span>
            </p>
            <div v-if="!data.data.location_log.location_log_images.length"
                class="flex flex-col justify-center items-center gap-2">
                <p class="text-sm text-dimmed">{{ data.data.location_log.name }} has no images yet!</p>
                <UButton color="neutral" size="lg"
                    :to="`/dashboard/location/${locationsStore.currentLocation?.data.location.slug}/${locationsStore.currentLocationLog?.data.location_log._id}/images`"
                    trailing-icon="i-tabler-camera-plus">Add
                    image
                </UButton>
            </div>
            <div v-if="data.data.location_log.location_log_images.length" class="flex gap-4 scroll-container mt-2">
                <div v-for="image in data.data.location_log.location_log_images"
                    class="w-72 aspect-3/2 shadow-xl rounded-lg shrink-0 overflow-hidden relative">
                    <AppModal title="Delete image?" description="Deleting this image cannot be undoned. Are you sure?"
                        onConfirmedLabel="Delete" :onConfirmed="() => deleteLocationLogImage(image)">
                        <template #trigger>
                            <UButton color="error" icon="i-tabler-trash-x-filled" variant="outline"
                                class="absolute top-2 right-2 bg-white hover:bg-error-100" />
                        </template>
                    </AppModal>
                    <img class="size-full object-cover" :src="`${config.public.s3BucketUrl}/${image.key}`" alt="">
                </div>
            </div>
        </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug-id'">
        <NuxtPage></NuxtPage>
    </div>
</div>
</template>