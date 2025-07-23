import type { SuccessfulLocationsResponse } from "~/types/types";
import type { MapPoint } from "~/types/types";

export const useLocationsStore = defineStore("useLocationStore", () => {
    const { data, status, refresh } = useFetch<SuccessfulLocationsResponse>("/api/locations", {
        lazy: true,
    });

    const sidebarStore = useSidebarStore();
    const mapStore = useMapStore();

    effect(() => {
        if (data.value) {
            const mapPoints: MapPoint[] = [];
            const sidebarItems: SidebarItem[] = [];

            data.value.data.locations.forEach((location) => {
                const mapPoint = createMapPointFromLocation(location);
                sidebarItems.push({
                    _id: `location-${location._id}`,
                    label: location.name,
                    icon: "i-lucide-map-pin",
                    href: `/dashboard/location/${location.slug}`,
                    mapPoint,
                });
                mapPoints.push(mapPoint);
            });

            sidebarStore.sidebarItems = sidebarItems;
            mapStore.mapPoints = mapPoints;
        }
        sidebarStore.loading = status.value === "pending";
    });

    return {
        data,
        status,
        refresh,
    };
});