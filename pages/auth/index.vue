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
<AuthCard v-if="action === 'signup'" title="Sign up" subtitle="Please enter your credentials to sign up"
    redirect_text="Already have an account? " redirect_link="Log in" link_to="/auth?action=login">
    <AuthSignupForm></AuthSignupForm>
</AuthCard>
<AuthCard v-else title="Welcome back" subtitle="Please enter your credentials to log in"
    redirect_text="Don't have an account? " redirect_link="Sign up" link_to="/auth?action=signup">
    <AuthLoginForm></AuthLoginForm>
</AuthCard>
</template>
