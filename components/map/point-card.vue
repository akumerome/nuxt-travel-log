<script lang="ts" setup>
import type { MapPoint } from '~/types/types';

defineProps<{
    mapPoint: MapPoint;
}>();

const mapStore = useMapStore();
</script>

<template>
<NuxtLink :to="mapPoint.to">
    <UCard class="bg-muted w-72 shadow-xl rounded-md shrink-0 border-2"
        :class="[isPointSelected(mapPoint, mapStore.selectedPoint) ? 'border-primary' : 'border-transparent']"
        :ui="{ body: 'sm:p-4' }" @mouseenter="mapStore.selectedPoint = mapPoint"
        @mouseleave="mapStore.selectedPoint = null">
        <div class="h-16 w-72">
            <div class="font-bold truncate">{{ mapPoint.name }}</div>
            <div class="text-sm line-clamp-2">{{ mapPoint.description }}</div>
        </div>
        <slot name="footer" />
    </UCard>
</NuxtLink>
</template>