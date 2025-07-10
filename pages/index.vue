<script lang="ts" setup>
definePageMeta({
    middleware: ["dashboard"],
});
</script>

<template>
<div class="mx-4 my-6">
    <div class="flex justify-center border border-b-0 border-muted relative z-[1] rounded-t-md">
        <div class="relative isolate">
            <div
                class="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:grid py-24 sm:py-32 lg:py-40 gap-16 sm:gap-y-24">
                <div class="text-center">
                    <div>
                        <h1 class="text-5xl sm:text-7xl text-pretty tracking-tight font-bold text-highlighted">
                            Travel Log
                        </h1>
                        <div class="text-lg sm:text-xl/8 text-muted text-balance mt-6">
                            Keep track of your travels and adventures with this simple travel
                            log app. Add locations, photos and notes to create a digital
                            journal of your journeys.
                        </div>
                    </div>
                    <div class="mt-10">
                        <div class="flex flex-wrap gap-x-6 gap-y-3 justify-center">
                            <UButton class="border border-inverted" color="neutral" size="xl" to="/auth?action=login"
                                variant="outline">Log in</UButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
