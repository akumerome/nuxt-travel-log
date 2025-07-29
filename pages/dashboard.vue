<script lang="ts" setup>
import { CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGES } from '~/lib/constants';

definePageMeta({
    middleware: ["auth"],
});

const route = useRoute();
const locationsStore = useLocationsStore();
const { currentLocation: data, currentLocationStatus: status } = storeToRefs(locationsStore);
const sidebarStore = useSidebarStore();

if (LOCATION_PAGES.has(route.name?.toString() || "")) {
    await locationsStore.refreshLocations();
}

if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    await locationsStore.refreshCurrentLocation();
}

effect(() => {
    if (LOCATION_PAGES.has(route.name?.toString() || "")) {
        sidebarStore.sidebarTopItems = [
            {
                _id: "locations",
                href: '/dashboard',
                icon: 'i-tabler-map',
                label: 'Locations',
            },
            {
                _id: "add-location",
                href: '/dashboard/add',
                icon: 'i-tabler-map-pin-plus',
                label: 'Add location',
            },
        ];
    } else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
        sidebarStore.sidebarTopItems = [
            {
                _id: "locations",
                href: '/dashboard',
                icon: 'i-tabler-arrow-left',
                label: 'Locations',
            }
        ];

        if (data.value && status.value !== "pending") {
            sidebarStore.sidebarTopItems.push(
                {
                    _id: "logs",
                    href: `/dashboard/location/${route.params.slug}`,
                    icon: 'i-tabler-map',
                    label: data.value.data.location.name,
                },
                {
                    _id: "edit-location",
                    href: `/dashboard/location/${route.params.slug}/edit`,
                    icon: 'i-tabler-map-pin-cog',
                    label: "Edit location",
                },
                {
                    _id: "add-location-log",
                    href: `/dashboard/location/${route.params.slug}/add`,
                    icon: 'i-tabler-map-pin-plus',
                    label: 'Add location log',
                }
            );
        }
    }
})
</script>

<template>
<div class="flex-1 flex">
    <Sidebar></Sidebar>
    <div class="flex-1 overflow-auto">
        <div class="flex size-full" :class="[EDIT_PAGES.has(route.name?.toString() || '') ? undefined : 'flex-col']">
            <NuxtPage></NuxtPage>
            <Map class="flex-1"></Map>
        </div>
    </div>
</div>
</template>
