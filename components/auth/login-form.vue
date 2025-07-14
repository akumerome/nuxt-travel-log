<script lang="ts" setup>
import { schema } from "~/shared/utils/validators/login";
import type { Schema } from "~/shared/utils/validators/login";
import type { FormSubmitEvent } from "@nuxt/ui";
import { FetchError } from "ofetch";

const { fetch: refreshSession } = useUserSession();
const error = ref<string | null>(null);
const form = useTemplateRef("form");

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    error.value = null;
    try {
        await $fetch("/api/login", {
            method: "POST",
            body: event.data,
        });

        // Refresh session and redirect on success
        await refreshSession();
        await navigateTo("/dashboard");
    } catch (e) {
        const fetchError = e as FetchError;
        if (fetchError.data?.data) {
            form.value?.setErrors(fetchError.data.data);
        }
        error.value = fetchError.statusMessage || "An error occured";
    }
}
</script>

<template>
<UForm ref="form" :schema :state class="space-y-3" @submit="onSubmit">
    <UFormField label="Email" name="email">
        <UInput v-model="state.email" class="w-full" color="neutral" placeholder="@travellog.com" />
    </UFormField>

    <UFormField label="Password" name="password">
        <UInput v-model="state.password" class="w-full" color="neutral" placeholder="●●●●●●●●" type="password" />
    </UFormField>

    <div class="mt-4">
        <UAlert v-if="error" class="mb-4" color="error" icon="i-tabler-circle-x" :title="error" />

        <UButton block color="neutral" loading-auto type="submit">Log in
        </UButton>
    </div>
</UForm>
</template>
