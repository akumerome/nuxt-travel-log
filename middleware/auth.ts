export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession();

    // Redirect the user to the login screen if they're not authenticated
    if (!loggedIn.value) {
        return navigateTo("/auth?action=login");
    }
});
