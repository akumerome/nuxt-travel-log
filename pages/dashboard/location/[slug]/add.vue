<script setup lang="ts">
const locationsStore = useLocationsStore();
</script>

<template>
<div class="max-w-lg">
    <div class="mb-4">
        <h1 class="text-2xl font-bold">Add location log</h1>
        <p class="text-sm text-dimmed">A location is a place you have travelled or will travel to. It can be a city,
            country, state or point of interest. You can add specific times you visited this location after adding it.
        </p>
    </div>
    <AddLocationLogForm v-if="locationsStore.currentLocationStatus !== 'pending'"></AddLocationLogForm>
</div>
</template>