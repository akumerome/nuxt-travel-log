<script lang="ts" setup>
definePageMeta({
    middleware: ["dashboard"],
});

const route = useRoute();
const action = computed(() =>
    route.query.action === "signup" ? "signup" : "login"
);
</script>

<template>
<div class="mx-4 my-6">
    <AuthCard v-if="action === 'signup'" title="Sign up" subtitle="Please enter your credentials to sign up"
        redirectText="Already have an account? " redirectLink="Log in" linkTo="/auth?action=login">
        <AuthSignupForm></AuthSignupForm>
    </AuthCard>
    <AuthCard v-else title="Welcome back" subtitle="Please enter your credentials to log in"
        redirectText="Don't have an account? " redirectLink="Sign up" linkTo="/auth?action=signup">
        <AuthLoginForm></AuthLoginForm>
    </AuthCard>
</div>
</template>
