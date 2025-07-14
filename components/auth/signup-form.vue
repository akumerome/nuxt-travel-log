<script lang="ts" setup>
import { schema } from "~/shared/utils/validators/signup";
import type { Schema } from "~/shared/utils/validators/signup";
import type { FormSubmitEvent } from "@nuxt/ui";
import { FetchError } from "ofetch";

const { fetch: refreshSession } = useUserSession();
const { $csrfFetch } = useNuxtApp();
const form = useTemplateRef("form");
const error = ref<string | null>(null);

const state = reactive<Partial<Schema>>({
    username: undefined,
    email: undefined,
    password: undefined,
    password_confirmation: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    error.value = null;
    try {
        await $csrfFetch("/api/signup", {
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

    <UFormField label="Username" name="username">
        <UInput v-model="state.username" class="w-full" color="neutral" placeholder="username" />
    </UFormField>

    <UFormField label="Email" name="email">
        <UInput v-model="state.email" class="w-full" color="neutral" placeholder="@travellog.com" />
    </UFormField>

    <UFormField label="Password" name="password">
        <UInput v-model="state.password" class="w-full" color="neutral" placeholder="●●●●●●●●" type="password" />
    </UFormField>

    <UFormField label="Confirm password" name="password_confirmation">
        <UInput v-model="state.password_confirmation" class="w-full" color="neutral" placeholder="●●●●●●●●"
            type="password" />
    </UFormField>

    <div class="mt-4">
        <UAlert v-if="error" class="mb-4" color="error" icon="i-tabler-circle-x" :title="error" />

        <UButton block color="neutral" loading-auto type="submit">Sign up
        </UButton>
    </div>
</UForm>
</template>
