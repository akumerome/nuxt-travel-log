<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"],
});
</script>

<template>
<div class="flex-1 flex">
    <div class="flex">
        <Sidebar></Sidebar>
        <div class="flex-1"> MAPA</div>
    </div>
</div>
</template>
