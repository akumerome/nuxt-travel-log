<script lang="ts" setup>
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

import { CENTER_WORLD } from "~/lib/constants";

const colorMode = useColorMode();
const mapStore = useMapStore();

const style = computed(() =>
    colorMode.value === "dark"
        ? "/styles/dark.json"
        : "https://tiles.openfreemap.org/styles/liberty");
const zoom = 3;

function updateAddedPoint(location: LngLat) {
    if (mapStore.addedPoint) {
        mapStore.addedPoint.lat = location.lat;
        mapStore.addedPoint.long = location.lng;
    }
};

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
    if (mapStore.addedPoint) {
        mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
        mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
    }
}

onMounted(() => {
    mapStore.init();
});
</script>

<template>
<div class="m-4 rounded-lg overflow-hidden">
    <MglMap :map-style="style" :center="CENTER_WORLD" :zoom="zoom" @map:dblclick="onDoubleClick">
        <MglNavigationControl />
        <MglMarker v-if="mapStore.addedPoint" draggable
            :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]" @update:coordinates="updateAddedPoint">
            <template v-slot:marker>
                <UTooltip :content="{
                    align: 'center',
                    side: 'top',
                    sideOffset: 4,
                }" text="Drag me to your desired location" default-open>
                    <UIcon name="i-tabler-map-pin-filled" class="size-8 text-secondary">
                    </UIcon>
                </UTooltip>
            </template>

        </MglMarker>
        <MglMarker v-for="point in mapStore.mapPoints" :key="point._id" :coordinates="[point.long, point.lat]">
            <template v-slot:marker>
                <NuxtLink :to="point.to">
                    <UTooltip :content="{
                        align: 'center',
                        side: 'top',
                        sideOffset: 4,
                    }" :text="point.name" :open="isPointSelected(point, mapStore.selectedPoint)"
                        @mouseenter="mapStore.selectedPoint = point" @mouseleave="mapStore.selectedPoint = null">
                        <UIcon name="i-tabler-map-pin-filled" class="size-8"
                            :class="[isPointSelected(point, mapStore.selectedPoint) ? 'text-primary' : 'text-highlighted']">
                        </UIcon>
                    </UTooltip>
                </NuxtLink>
            </template>
        </MglMarker>
    </MglMap>
</div>
</template>