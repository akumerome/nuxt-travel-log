<script lang="ts" setup>
const props = defineProps<{
    href: string;
    icon: string;
    label: string;
    showLabel: boolean;
}>();
</script>

<template>
<UTooltip :content="{
    align: 'center',
    side: 'right',
    sideOffset: 14
}" :disabled="showLabel" :text=label>
    <NuxtLink :to="href"
        class="rounded-md font-medium flex justify-start items-center transition-colors px-2.5 py-1.5 gap-3 text-default hover:bg-accented focus:outline-none focus-visible:bg-accented h-[var(--collapsed-sidebar-element-size)]"
        :class="[showLabel ? 'w-full' : 'w-[var(--collapsed-sidebar-element-size)]']">
        <UIcon class="shrink-0 size-[var(--sidebar-icon-size)]" :name="icon" />
        <span class="font-bold truncate transition-[opacity] duration-1000 ease-in-out tracking-wide"
            :class="[showLabel ? 'opacity-100' : 'opacity-0']">
            {{ label }}
        </span>
    </NuxtLink>
</UTooltip>
</template>
