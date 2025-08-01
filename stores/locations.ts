import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~/lib/constants";
import type { SuccessfulLocationsResponse } from "~/types/types";
import type { SuccessfulLocationResponse } from "~/types/types";
import type { MapPoint } from "~/types/types";

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
        if (locations.value && LOCATION_PAGES.has(route.name?.toString() || "")) {
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
        } else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
            // sidebarStore.sidebarItems = [];
            // mapStore.mapPoints = [currentLocation.value.data.location];

            const mapPoints: MapPoint[] = [];
            const sidebarItems: SidebarItem[] = [];

            currentLocation.value.data.location.location_logs.forEach((location_log) => {
                const mapPoint = createMapPointFromLocationLog(currentLocation.value!.data.location, location_log);
                sidebarItems.push({
                    _id: `location-log-${location_log._id}`,
                    label: location_log.name,
                    icon: "i-tabler-map-pin-filled",
                    href: `/dashboard/location/${currentLocation.value?.data.location.slug}/${location_log._id}`,
                    mapPoint,
                });
                mapPoints.push(mapPoint);
            });

            sidebarStore.sidebarItems = sidebarItems;

            if (mapPoints.length) {
                mapStore.mapPoints = mapPoints;
            } else {
                mapStore.mapPoints = [currentLocation.value.data.location];
            }
        }
        sidebarStore.loading = locationsStatus.value === "pending" || currentLocationStatus.value === "pending";

        if (sidebarStore.loading) {
            mapStore.mapPoints = [];
        }
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