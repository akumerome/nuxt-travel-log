import type { MapPoint } from "~/types/types";
import type { LngLatBounds } from "maplibre-gl";

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);
    const selectedPoint = ref<MapPoint | null>(null);
    const addedPoint = ref<MapPoint & { zoom?: number } | null>(null);

    async function init() {
        const { useMap } = await import("@indoorequal/vue-maplibre-gl");
        const { LngLatBounds } = await import("maplibre-gl");

        const map = useMap();

        let bounds: LngLatBounds | null = null;
        const padding = 60;

        effect(() => {
            const firstPoint = mapPoints.value[0];
            if (!firstPoint) {
                map.map?.flyTo({
                    center: [0.1, 0.1],
                    zoom: 10,
                });
                return;
            }

            bounds = calculateLocationsBounds();

            if (addedPoint.value) {
                calculateCenter();
            }

            map.map?.fitBounds(bounds, {
                padding,
                maxZoom: 10,
                speed: 0.8
            });
        });

        watch(addedPoint, (newValue, oldValue) => {
            if (newValue && !oldValue) {
                map.map?.flyTo({
                    center: [newValue.long, newValue.lat],
                    speed: 0.8,
                    zoom: newValue.zoom || 6,
                });
            }
        }, {
            immediate: true,
        });

        function calculateLocationsBounds() {
            const firstPoint = mapPoints.value[0];

            const bounds = mapPoints.value.reduce((bounds, point) => {
                return bounds.extend([point.long, point.lat]);
            }, new LngLatBounds(
                [firstPoint.long, firstPoint.lat],
                [firstPoint.long, firstPoint.lat],
            ));

            return bounds;
        };


        function calculateCenter() {

            const ne = bounds?._ne;
            const sw = bounds?._sw;

            const latitudeDifference = ne!.lat - sw!.lat;
            const longitudeDifference = ne!.lng - sw!.lng;

            const latitudeDifferenceHalf = latitudeDifference / 2;
            const longitudeDifferenceHalf = longitudeDifference / 2;

            addedPoint.value = {
                _id: "1",
                name: "Added Point",
                lat: sw!.lat + latitudeDifferenceHalf,
                long: sw!.lng + longitudeDifferenceHalf,
                zoom: addedPoint.value?.zoom || 6,
            };
        };
    }

    return {
        init,
        addedPoint,
        mapPoints,
        selectedPoint,
    };
});