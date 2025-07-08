<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const { fetch: refreshSession } = useUserSession();
const error = ref<string | null>(null)

const schema = z
    .object({
        username: z.string().nonempty("The username field is required."),
        email: z
            .string()
            .nonempty("The email field is required.")
            .email("The email field must be a valid email address."),
        password: z
            .string()
            .nonempty("The password field is required.")
            .min(8, "The password field must be at least 8 characters.")
            .regex(/^(?=.*[a-z])/, "The password field must include at least a lowercase character.")
            .regex(/^(?=.*[A-Z])/, "The password field must include at least an uppercase character.")
            .regex(/^(?=.*\d)/, "The password field must include at least a number.")
            .regex(/^(?=.*[\W_])/, "The password field must include at least a special character."),

        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match.",
        path: ["password_confirmation"],
    });

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    username: undefined,
    email: undefined,
    password: undefined,
    password_confirmation: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
    error.value = null;
    try {
        await $fetch("/api/signup", {
            method: "POST",
            body: event.data,
        });

        // Refresh session and redirect on success
        await refreshSession();
        await navigateTo("/dashboard");
    } catch (e) {
        console.error("Sign up error:", e.statusMessage);
        error.value = e.statusMessage || "An error occured";
    }
}
</script>

<template>
<UForm :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">

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
