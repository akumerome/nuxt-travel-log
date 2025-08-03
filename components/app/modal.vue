<script lang="ts" setup>
import { FetchError } from "ofetch";

const props = defineProps<{
    title: string;
    description: string;
    onConfirmedLabel: string;
    onConfirmed: () => Promise<void>;
}>();

const open = ref(false);
const error = ref<string | null>(null);
const submitting = ref(false);

watch(open, (newValue) => {
    if (newValue === true) {
        error.value = null;
    }
});

async function handleConfirm() {
    try {
        error.value = null;
        submitting.value = true;
        await props.onConfirmed();
    } catch (e) {
        const fetchError = e as FetchError;
        error.value = fetchError.statusMessage || "An error occured.";
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
<UModal v-model:open="open" :title="props.title" :ui="{ content: 'divide-y-0' }">
    <slot name="trigger" />

    <template #body="{ close }">
        <div>
            <p>{{ props.description }}</p>
            <div class="mt-10 grid">
                <UAlert v-if="error" class="mb-4" color="error" icon="i-tabler-circle-x" :title="error" />

                <div class="flex justify-end gap-2">
                    <UButton color="neutral" size="lg" variant="outline" @click="close">Cancel
                    </UButton>
                    <UButton color="error" size="lg" variant="solid" :loading="submitting" @click="handleConfirm">
                        {{ props.onConfirmedLabel }}
                    </UButton>
                </div>
            </div>
        </div>
    </template>
</UModal>
</template>