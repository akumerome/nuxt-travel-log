export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession();

    // Redirect the user to the dashboard screen if they're authenticated
    if (loggedIn.value) {
        return navigateTo("/dashboard");
    }
});