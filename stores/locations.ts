export const useLocationsStore = defineStore("useLocationsStore", () => {
    const { data, status, refresh } = useFetch("/api/locations", {
        lazy: true,
    });

    const sidebarLocationsStore = useSidebarLocationsStore();

    watchEffect(() => {
        if (data.value) {
            sidebarLocationsStore.sidebarLocationsItems = data.value.data.locations.map((location) => ({
                href: `/${location.slug}`,
                icon: "i-lucide-map-pin",
                label: location.name
            }));
            sidebarLocationsStore.loading = status.value === "pending";
        }
    });

    const locations = computed(() => data.value?.data?.locations ?? []);

    return {
        locations,
        status,
        refresh
    }
});