import type { Location } from "~/types/types";

export const useLocationsStore = defineStore("useLocationsStore", () => {
    const { data, status, refresh } = useFetch("/api/locations", {
        lazy: true,
    });

    const locations = computed(() => data.value?.data?.locations ?? []);
    const selectedLocation = ref<Location | null>(null);
    const addedLocation = ref<Location | null>(null);

    return {
        locations,
        status,
        refresh,
        selectedLocation,
        addedLocation,
    }
});