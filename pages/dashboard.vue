<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"],
});

const route = useRoute();
const locationsStore = useLocationsStore();
const { currentLocation: data } = storeToRefs(locationsStore);
const sidebarStore = useSidebarStore();

effect(() => {
    if (route.name === "dashboard") {
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
    } else if (route.name === "dashboard-location-slug") {
        sidebarStore.sidebarTopItems = [
            {
                _id: "locations",
                href: '/dashboard',
                icon: 'i-tabler-arrow-left',
                label: 'Locations',
            },
            {
                _id: "logs",
                href: `/dashboard/location/${data.value?.data.location.slug}`,
                icon: 'i-tabler-map',
                label: data.value ? data.value.data.location.name : "Logs",
            },
            {
                _id: "edit-location",
                href: `/dashboard/location/${data.value?.data.location.slug}/edit`,
                icon: 'i-tabler-map-pin-cog',
                label: "Edit location",
            },
            {
                _id: "add-location-log",
                href: `/dashboard/location/${data.value?.data.location.slug}/add`,
                icon: 'i-tabler-map-pin-plus',
                label: 'Add location log',
            },
        ];
    }
})

onMounted(() => {
    if (route.path !== "/dashboard") {
        locationsStore.refreshLocations();
    }
});
</script>

<template>
<div class="flex-1 flex">
    <Sidebar></Sidebar>
    <div class="flex-1 overflow-auto">
        <div class="flex size-full" :class="[route.path !== '/dashboard/add' ? 'flex-col' : undefined]">
            <NuxtPage></NuxtPage>
            <Map class="flex-1"></Map>
        </div>
    </div>
</div>
</template>
