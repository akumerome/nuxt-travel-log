<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"],
});
</script>

<template>
<div class="flex-1 flex">
    <Sidebar></Sidebar>
    <div class="flex-1 flex">
        <NuxtPage></NuxtPage>
    </div>
</div>
</template>
