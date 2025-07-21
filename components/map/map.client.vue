<script lang="ts" setup>
import type { LngLat } from "maplibre-gl";
import { LngLatBounds } from "maplibre-gl";
import { useMap, type MglEvent } from "@indoorequal/vue-maplibre-gl";

const colorMode = useColorMode();
const map = useMap();
const locationsStore = useLocationsStore();
const { locations } = storeToRefs(locationsStore);

const style = computed(() =>
    colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty"
);

const center = [0.1, 0.1] as [number, number];
const zoom = 2;

let bounds: LngLatBounds | null = null;
const padding = 80;

/**
 * Show all locations in the map.
 */
effect(() => {

    if (locations.value.length <= 0) {
        return;
    }

    calculateLocationsBounds();

    if (locationsStore.addedLocation) {
        calculateCenter();
    }

    if (bounds) {
        map.map?.fitBounds(bounds, { padding, maxZoom: 10, speed: 0.75 });
    }

});

watch(() => locationsStore.addedLocation, (newValue, oldValue) => {
    if (newValue && !oldValue) {
        map.map?.flyTo({
            center: [newValue.long, newValue.lat],
            speed: 0.75,
            zoom: 6,
        })
    }
}, { immediate: true });

function calculateLocationsBounds() {
    const firstPoint = locations.value[0];

    bounds = locations.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
    }, new LngLatBounds(
        [firstPoint.long, firstPoint.lat],
        [firstPoint.long, firstPoint.lat],
    ));
};

function calculateCenter() {

    const ne = bounds?._ne;
    const sw = bounds?._sw;

    const latitudeDifference = ne!.lat - sw!.lat;
    const longitudeDifference = ne!.lng - sw!.lng;

    const latitudeDifferenceHalf = latitudeDifference / 2;
    const longitudeDifferenceHalf = longitudeDifference / 2;

    locationsStore.addedLocation = {
        lat: sw?.lat + latitudeDifferenceHalf,
        long: sw.lng + longitudeDifferenceHalf,
    };
};

function updateAddedLocationCoordinates(coordinates: LngLat) {
    if (locationsStore.addedLocation) {
        locationsStore.addedLocation.lat = coordinates.lat;
        locationsStore.addedLocation.long = coordinates.lng;
    }
};

function onDoubleClick(event: MglEvent<"dblclick">) {
    if (locationsStore.addedLocation) {
        locationsStore.addedLocation.lat = event.event.lngLat.lat;
        locationsStore.addedLocation.long = event.event.lngLat.lng;
    }
}
</script>

<template>
<div class="m-4 rounded-lg overflow-hidden">
    <MglMap :map-style="style" :center :zoom @map:dblclick="onDoubleClick">
        <MglNavigationControl />
        <MglMarker v-if="locationsStore.addedLocation"
            :coordinates="[locationsStore.addedLocation.long, locationsStore.addedLocation.lat]" draggable
            @update:coordinates="updateAddedLocationCoordinates">
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
        <MglMarker v-for="location in locations" :key="location._id" :coordinates="[location.long, location.lat]">
            <template v-slot:marker>
                <UTooltip :content="{
                    align: 'center',
                    side: 'top',
                    sideOffset: 4,
                }" :text="location.name" :open="location === locationsStore.selectedLocation"
                    @mouseenter="locationsStore.selectedLocation = location"
                    @mouseleave="locationsStore.selectedLocation = null">
                    <UIcon name="i-tabler-map-pin-filled" class="size-8"
                        :class="[location === locationsStore.selectedLocation ? 'text-primary' : 'text-highlighted']">
                    </UIcon>
                </UTooltip>
            </template>
        </MglMarker>
    </MglMap>
</div>
</template>