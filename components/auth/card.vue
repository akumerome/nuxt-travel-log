<script lang="ts" setup>
defineProps({
    title: String,
    subtitle: String,
    redirect_text: String,
    redirect_link: String,
    link_to: String
})
</script>

<template>
<div class="w-9/10 sm:w-[400px] mx-auto">
    <UCard class="shadow-xl py-2 w-full mx-auto">
        <div class="flex flex-col items-center">
            <div class="relative">
                <div class="w-10 aspect-square bg-[#0f172b] border border-white absolute"></div>
                <div class="w-10 aspect-square bg-[#90a1b9] rotate-60"></div>
            </div>
            <div class="w-full">
                <div class="text-center py-6">
                    <h2 class="text-xl font-bold">{{ title }}</h2>
                    <p>{{ subtitle }}</p>
                </div>
                <slot></slot>
                <div class="mt-4 text-center">
                    <p>{{ redirect_text }} <ULink raw :to=link_to active-class="font-bold" inactive-class="text-muted">
                            {{ redirect_link }}</ULink>
                    </p>
                </div>
            </div>
        </div>
    </UCard>
</div>
</template>