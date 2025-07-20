<script lang="ts" setup>
import { LngLatBounds } from "maplibre-gl";
import { useMap } from "@indoorequal/vue-maplibre-gl";
import type { Location } from "~/types/types";

const colorMode = useColorMode();
const map = useMap();
const locationsStore = useLocationsStore();
const { locations } = storeToRefs(locationsStore);

const style = computed(() =>
    colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty"
);

const center = [-1.559482, 47.21322];
const zoom = 2;

let bounds: LngLatBounds | null = null;
const padding = 60;

const shouldFlyTo = ref(true);

/**
 * Show all locations in the map.
 */
effect(() => {

    if (locations.value.length > 0) {
        const firstPoint = locations.value[0];

        bounds = locations.value.reduce((bounds, point) => {
            return bounds.extend([point.long, point.lat]);
        }, new LngLatBounds(
            [firstPoint.long, firstPoint.lat],
            [firstPoint.long, firstPoint.lat],
        ));
    }

    if (bounds) {
        map.map?.fitBounds(bounds, { padding });
    }

});

/**
 * Center the map upon the selected location.
 */
effect(() => {
    if (locationsStore.selectedLocation) {
        if (shouldFlyTo.value) {
            map.map?.flyTo({
                center: [locationsStore.selectedLocation.long, locationsStore.selectedLocation.lat],
                speed: 0.5,
            })
        }
        shouldFlyTo.value = true;
    } else if (bounds) {
        map.map?.fitBounds(bounds, { padding });
    }
});

function selectPoint(location: Location | null) {
    shouldFlyTo.value = false;
    locationsStore.selectedLocation = location;
};

</script>

<template>
<div class="m-4 rounded-lg overflow-hidden">
    <MglMap :map-style="style" :center="center" :zoom="zoom">
        <MglNavigationControl />
        <MglMarker v-for="location in locations" :key="location._id" :coordinates="[location.long, location.lat]">
            <template v-slot:marker>
                <UTooltip :content="{
                    align: 'center',
                    side: 'top',
                    sideOffset: 4,
                }" :text="location.name" :open="location === locationsStore.selectedLocation"
                    @mouseenter=selectPoint(location) @mouseleave=selectPoint(null)>
                    <UIcon name="i-tabler-map-pin-filled" class="size-8"
                        :class="[location === locationsStore.selectedLocation ? 'text-primary' : 'text-highlighted']">
                    </UIcon>
                </UTooltip>
            </template>
        </MglMarker>
    </MglMap>
</div>
</template>