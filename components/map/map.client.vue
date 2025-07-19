<script lang="ts" setup>
import { LngLatBounds } from "maplibre-gl";
import { useMap } from "@indoorequal/vue-maplibre-gl";

const colorMode = useColorMode();
const map = useMap();

const style = computed(() =>
    colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty"
);
const center = [-1.559482, 47.21322];
const zoom = 2;

const locationsStore = useLocationsStore();
const { locations } = storeToRefs(locationsStore);

effect(() => {

    const firstPoint = locations.value[0];
    if (!firstPoint) {
        return;
    }

    const bounds = locations.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
    }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
    ));

    map.map?.fitBounds(bounds, { padding: 40 });

});

</script>

<template>
<div class="m-4 rounded-lg overflow-hidden">
    <MglMap :map-style="style" :center="center" :zoom="zoom">
        <MglNavigationControl />
        <MglMarker v-for="point in locations" :key="point._id" :coordinates="[point.long, point.lat]">
            <template v-slot:marker>
                <UTooltip :content="{
                    align: 'center',
                    side: 'top',
                    sideOffset: 4,
                }" :text="point.name">
                    <UIcon name="i-tabler-map-pin-filled" class="size-8 text-highlighted"></UIcon>
                </UTooltip>
            </template>
        </MglMarker>
    </MglMap>
</div>
</template>