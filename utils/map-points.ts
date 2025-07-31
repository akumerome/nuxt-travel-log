import type { ILocation, ILocationLog } from "~/types/types";
import type { MapPoint } from "~/types/types";

export function createMapPointFromLocation(location: ILocation): MapPoint {
    return {
        ...location,
        to: `/dashboard/location/${location.slug}`,
    };
}

export function createMapPointFromLocationLog(location: ILocation, locationLog: ILocationLog): MapPoint {
    return {
        ...locationLog,
        to: `/dashboard/location/${location.slug}/${locationLog._id}`,
    };
}

export function isPointSelected(item: Pick<MapPoint, "_id" | "lat" | "long"> | null | undefined, selectedPoint: MapPoint | null | undefined) {
    if (!item || !selectedPoint) {
        return false;
    }

    return item._id === selectedPoint._id
        && item.lat === selectedPoint.lat
        && item.long === selectedPoint.long;
}