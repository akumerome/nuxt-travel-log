import type { SuccessfulLocationsResponse } from "~/types/types";
import type { SuccessfulLocationResponse } from "~/types/types";
import type { MapPoint } from "~/types/types";

const listLocationsInSidebar = new Set(["dashboard", "dashboard-add"]);
const listCurrentLocationInSidebar = new Set(["dashboard-location-slug", "dashboard-location-slug-edit", "dashboard-location-slug-add"]);


export const useLocationsStore = defineStore("useLocationsStore", () => {
    const route = useRoute();
    const { data: locations, status: locationsStatus, refresh: refreshLocations } = useFetch<SuccessfulLocationsResponse>("/api/locations", {
        lazy: true,
    });

    const locationUrlWithSlug = computed(() => `/api/locations/${route.params.slug}`);

    const { data: currentLocation, status: currentLocationStatus, error: currentLocationError, refresh: refreshCurrentLocation } = useFetch<SuccessfulLocationResponse>(locationUrlWithSlug, {
        lazy: true,
        immediate: false,
        watch: false,
    });

    const sidebarStore = useSidebarStore();
    const mapStore = useMapStore();

    effect(() => {
        if (locations.value && listLocationsInSidebar.has(route.name?.toString() || "")) {
            const mapPoints: MapPoint[] = [];
            const sidebarItems: SidebarItem[] = [];

            locations.value.data.locations.forEach((location) => {
                const mapPoint = createMapPointFromLocation(location);
                sidebarItems.push({
                    _id: `location-${location._id}`,
                    label: location.name,
                    icon: "i-tabler-map-pin-filled",
                    href: `/dashboard/location/${location.slug}`,
                    mapPoint,
                });
                mapPoints.push(mapPoint);
            });

            sidebarStore.sidebarItems = sidebarItems;
            mapStore.mapPoints = mapPoints;
        } else if (currentLocation.value && listCurrentLocationInSidebar.has(route.name?.toString() || "")) {
            sidebarStore.sidebarItems = [];
            mapStore.mapPoints = [currentLocation.value.data.location];
        }
        sidebarStore.loading = locationsStatus.value === "pending";
    });

    return {
        locations,
        locationsStatus,
        refreshLocations,
        currentLocation,
        currentLocationStatus,
        currentLocationError,
        refreshCurrentLocation,
    };
});