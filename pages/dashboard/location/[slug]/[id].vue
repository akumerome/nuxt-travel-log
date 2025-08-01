<script lang="ts" setup>
const locationsStore = useLocationsStore();
const { currentLocationLog: data, currentLocationLogStatus: status, currentLocationLogError: error } = storeToRefs(locationsStore);

onMounted(() => {
    locationsStore.refreshCurrentLocationLog();
});
</script>

<template>
<div>
    <div v-if="status === 'pending'">
        <AppLoader />
    </div>
    <div v-if="status !== 'pending' && error">
        <UAlert v-if="error" color="error" icon="i-tabler-circle-x" :title="error.statusMessage" />
    </div>
    <div v-if="status !== 'pending' && data?.data.location_log">
        <div class="mb-4">
            <div class="flex gap-3">
                <h1 class="text-2xl font-bold">{{ data.data.location_log.name }}</h1>
                <DeleteLocationModal></DeleteLocationModal>
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
        </div>
    </div>
</div>
</template>