<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"],
});

const { clear: clearSession } = useUserSession();

onMounted(async () => {
    await clearSession();
    await navigateTo("/");
});
</script>

<template>
<div class="flex justify-center items-center h-[calc(100vh-8rem-48px)]">
    <AppLoader />
</div>
</template>
