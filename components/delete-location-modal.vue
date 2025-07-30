<script lang="ts" setup>
import { FetchError } from "ofetch";

const route = useRoute();
const open = ref(false);
const error = ref<string | null>(null);

watch(open, (newValue) => {
    if (newValue === true) {
        error.value = null
    }
});

async function confirm() {
    error.value = null;
    try {
        const deleted = await $fetch(`/api/locations/${route.params.slug}`, {
            method: "DELETE",
        });

        await navigateTo("/dashboard");
        open.value = false;
    } catch (e) {
        const fetchError = e as FetchError;
        error.value = fetchError.statusMessage || "An error occured.";
    }
}
</script>

<template>
<UModal v-model:open="open" title="Delete location?" :ui="{ content: 'divide-y-0' }">
    <UButton color="error" icon="i-tabler-trash-x-filled" variant="outline" />

    <template #body="{ close }">
        <div>
            <p>Deleting this location will also delete all of the associated logs. This
                action cannot be undoned.</p>
            <div class="mt-10 grid">
                <UAlert v-if="error" class="mb-4" color="error" icon="i-tabler-circle-x" :title="error" />

                <div class="flex justify-end gap-2">
                    <UButton color="neutral" size="lg" variant="outline" @click="close">Cancel
                    </UButton>
                    <UButton color="error" size="lg" variant="solid" loading-auto @click="confirm">
                        Delete
                    </UButton>
                </div>
            </div>
        </div>
    </template>
</UModal>
</template>