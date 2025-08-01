<script lang="ts" setup>

const route = useRoute();
const locationsStore = useLocationsStore();
const mapStore = useMapStore();
const sidebarStore = useSidebarStore();
const open = ref<boolean>(false);

onMounted(() => {
    open.value = localStorage.getItem("isSidebarOpen") === "true";
});

function toggleSidebar() {
    open.value = !open.value;
    localStorage.setItem("isSidebarOpen", open.value.toString());
}
</script>

<template>
<aside class="bg-muted p-[var(--sidebar-padding)] transition-all duration-500 ease-out"
    :class="[open ? 'w-[var(--expanded-sidebar-width)]' : 'w-[var(--collapsed-sidebar-width)]']">
    <div class="flex justify-end mb-10">
        <UButton
            class="size-[var(--collapsed-sidebar-element-size)] transition-transform duration-500 ease out hover:bg-accented focus-visible:bg-accented"
            :class="[open ? 'rotate-180' : 'rotate-0']" color="neutral" variant="ghost"
            trailing-icon="i-tabler-chevron-right" @click="toggleSidebar"
            :ui="{ base: 'px-2.5 py-2.5', trailingIcon: 'size-[var(--sidebar-icon-size)]' }" />
    </div>
    <nav class="flex flex-col gap-1">
        <SidebarButton v-for="item in sidebarStore.sidebarTopItems" :key="item.href" :href="item.href" :icon="item.icon"
            :label="item.label" :showLabel="open">
        </SidebarButton>
        <div v-if="route.path.startsWith('/dashboard/location') && locationsStore.currentLocationStatus === 'pending'"
            class="flex flex-col gap-1">
            <USkeleton v-for="x in 3" class="bg-accented h-[var(--collapsed-sidebar-element-size)] w-full" />
        </div>
        <USeparator v-if="sidebarStore.sidebarItems.length || sidebarStore.loading" />
        <div v-if="sidebarStore.loading" class="flex flex-col gap-1">
            <USkeleton v-for="x in 3" class="bg-accented h-[var(--collapsed-sidebar-element-size)] w-full" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col gap-1">
            <SidebarButton v-for="item in sidebarStore.sidebarItems"
                :class="[isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-primary' : undefined]"
                :key="item._id" :href="item.href" :icon="item.icon" :label="item.label" :showLabel="open"
                @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
                @mouseleave="mapStore.selectedPoint = null">
            </SidebarButton>
        </div>
    </nav>
</aside>
</template>