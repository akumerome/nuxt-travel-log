<script lang="ts" setup>
const sidebarLocationsStore = useSidebarLocationsStore();
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
        <SidebarButton v-for="item in navItems" :key="item.href" :item="item" :showLabel="open">
        </SidebarButton>
        <USeparator v-if="sidebarLocationsStore.sidebarLocationsItems.length" />
        <div v-if="sidebarLocationsStore.loading" class="flex flex-col gap-1">
            <USkeleton v-for="x in 3" class="bg-accented h-[var(--collapsed-sidebar-element-size)] w-full" />
        </div>
        <div v-if="!sidebarLocationsStore.loading && sidebarLocationsStore.sidebarLocationsItems.length"
            class="flex flex-col gap-1">
            <SidebarButton v-for="item in sidebarLocationsStore.sidebarLocationsItems" :key="item.href" :item="item"
                :showLabel="open">
            </SidebarButton>
        </div>
    </nav>
</aside>
</template>