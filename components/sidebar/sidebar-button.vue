<script lang="ts" setup>
const props = defineProps<{
    item: NavItem;
    showLabel: boolean;
}>();

interface NavItem {
    href: string;
    icon: string;
    label: string;
}

const route = useRoute();
const active = computed(() => route.path === props.item.href);
</script>

<template>
<UTooltip :content="{
    align: 'center',
    side: 'right',
    sideOffset: 14,
}" :disabled="showLabel" :text="item.label">
    <NuxtLink :to="item.href"
        class="rounded-md font-medium flex justify-start items-center transition-colors px-2.5 py-1.5 gap-3 text-default hover:bg-accented focus:outline-none focus-visible:bg-accented h-[var(--collapsed-sidebar-element-size)]"
        :class="[
            showLabel ? 'w-full' : 'w-[var(--collapsed-sidebar-element-size)]',
            active ? 'bg-accented' : undefined,
        ]">
        <UIcon class="shrink-0 size-[var(--sidebar-icon-size)]" :name="item.icon" />
        <span class="font-bold truncate transition-[opacity] duration-1000 ease-in-out tracking-wide"
            :class="[showLabel ? 'opacity-100' : 'opacity-0']">
            {{ item.label }}
        </span>
    </NuxtLink>
</UTooltip>
</template>
