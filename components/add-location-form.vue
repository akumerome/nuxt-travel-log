<script lang="ts" setup>
import { schema } from "~/shared/utils/validators/locations";
import type { Schema } from "~/shared/utils/validators/locations";
import type { FormSubmitEvent } from "@nuxt/ui";
import { FetchError } from "ofetch";

const { $csrfFetch } = useNuxtApp();
const form = useTemplateRef("form");
const submitted = ref(false);
const error = ref<string | null>(null);

const state = reactive<Partial<Schema>>({
    name: undefined,
    description: undefined,
    lat: undefined,
    long: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    error.value = null;
    try {
        const inserted = await $csrfFetch("/api/locations", {
            method: "POST",
            body: event.data,
        });
        submitted.value = true;
        navigateTo("/dashboard");
    } catch (e) {
        const fetchError = e as FetchError;
        if (fetchError.data?.data) {
            form.value?.setErrors(fetchError.data.data);
        }
        error.value = fetchError.statusMessage || "An error occured.";
    }
}

onBeforeRouteLeave(() => {
    if (!submitted.value && form.value?.dirty) {
        const confirm = window.confirm(
            "Are you sure you want to leave? All unsaved changes will be lost."
        );

        if (!confirm) {
            return false;
        }

        return true;
    }
});
</script>

<template>
<UForm ref="form" :schema :state class="space-y-3" @submit="onSubmit">
    <UFormField label="Name" name="name">
        <UInput v-model="state.name" class="w-full" color="neutral" placeholder="Paris" />
    </UFormField>

    <UFormField hint="Optional" label="Description" name="description">
        <UTextarea v-model="state.description" class="w-full" color="neutral" placeholder="The City of Lights" :rows="6"
            :maxrows="6" autoresize />
    </UFormField>

    <UFormField label="Latitude" name="lat">
        <UInput v-model="state.lat" class="w-full" color="neutral" type="number" placeholder="48.853" />
    </UFormField>

    <UFormField label="Longitude" name="long">
        <UInput v-model="state.long" class="w-full" color="neutral" type="number" placeholder="2.348" />
    </UFormField>

    <div class="mt-4 grid">
        <UAlert v-if="error" class="mb-4" color="error" icon="i-tabler-circle-x" :title="error" />

        <UButton class="justify-self-end" color="neutral" loading-auto type="submit">Add location
        </UButton>
    </div>
</UForm>
</template>
