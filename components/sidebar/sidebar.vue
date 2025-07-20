<script lang="ts" setup>
const locationsStore = useLocationsStore();
const open = ref<boolean>(false);

onMounted(() => {
    open.value = localStorage.getItem("isSidebarOpen") === "true";
});

const navItems = [
    {
        href: '/dashboard',
        icon: 'i-lucide-map',
        label: 'Locations',
    },
    {
        href: '/dashboard/add',
        icon: 'i-lucide-map-pin-plus',
        label: 'Add location',
    },
];

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
            trailing-icon="i-lucide-chevron-right" @click="toggleSidebar"
            :ui="{ base: 'px-2.5 py-2.5', trailingIcon: 'size-[var(--sidebar-icon-size)]' }" />
    </div>
    <nav class="flex flex-col gap-1">
        <SidebarButton v-for="item in navItems" :key="item.href" :href="item.href" :icon="item.icon" :label="item.label"
            :showLabel="open">
        </SidebarButton>
        <USeparator v-if="locationsStore.locations.length" />
        <div v-if="locationsStore.status === 'pending'" class="flex flex-col gap-1">
            <USkeleton v-for="x in 3" class="bg-accented h-[var(--collapsed-sidebar-element-size)] w-full" />
        </div>
        <div v-if="locationsStore.status === 'success' && locationsStore.locations.length" class="flex flex-col gap-1">
            <SidebarButton v-for="location in locationsStore.locations"
                :class="[locationsStore.selectedLocation === location ? 'text-primary' : undefined]"
                :key="`/${location.slug}`" :href="`/${location.slug}`" icon="i-lucide-map-pin" :label="location.name"
                :showLabel="open" @mouseenter="locationsStore.selectedLocation = location"
                @mouseleave="locationsStore.selectedLocation = null">
            </SidebarButton>
        </div>
    </nav>
</aside>
</template>