<template>
<header class="bg-default border-b border-default h-[4rem] sticky top-0 z-50 w-full">
    <div class="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full">
        <div class="lg:flex-1 flex items-center gap-1.5">
            <NuxtLink to="/">Travel Log</NuxtLink>
        </div>
        <div class="hidden lg:flex">

        </div>
        <div class="flex items-center justify-end lg:flex-1 gap-1.5">
            <UButton color="neutral" to="/auth?action=signup">Sign up
            </UButton>
            <UButton class="border border-inverted" color="neutral" to="/auth?action=login" variant="outline">Log in
            </UButton>
            <AppColorModeButton></AppColorModeButton>
        </div>
    </div>
</header>
</template>