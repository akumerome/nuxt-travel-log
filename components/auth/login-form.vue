<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const { fetch: refreshSession } = useUserSession();
const error = ref<string | null>(null)

const schema = z.object({
    email: z.string().nonempty("The email field is required.").email("The email field must be a valid email address."),
    password: z.string().nonempty("The password field is required."),
});

type Schema = z.output<typeof schema>;

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
        console.error("Log in error:", e.statusMessage);
        error.value = e.statusMessage || "An error occured";
    }
}
</script>

<template>
<UForm :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
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
