<script lang="ts" setup>
import type { DropdownMenuItem } from '@nuxt/ui';
const { user } = useUserSession();

const items = ref<DropdownMenuItem[]>([
    {
        label: 'Settings',
        icon: 'i-lucide-cog'
    },
    {
        label: 'Log out',
        icon: 'i-tabler-logout',
        onSelect() {
            navigateTo('/logout');
        }
    }
])
</script>

<template>
<UDropdownMenu :items="items" :content="{
    align: 'end',
    side: 'bottom',
    sideOffset: 8
}">
    <button>
        <UAvatar :alt="user.username || 'G'" size="md" :ui="{
            root: 'bg-inverted',
            fallback: 'text-inverted'
        }" />
    </button>
</UDropdownMenu>
</template>
