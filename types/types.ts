import mongoose from "mongoose";

export type LatLongItem = {
    lat: number;
    long: number;
};

export type MapPoint = {
    _id: string;
    name: string;
    description?: string;
    to?: string;
} & LatLongItem;

export type SuccessfulResponse = {
    statusCode: number,
    statusMessage: string,
}

export interface ILocation {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    lat: number;
    long: number;
    location_logs: Array<any>;
    user: mongoose.Schema.Types.ObjectId;
    created_at: number;
    updated_at: number;
};

export interface ILocationLog {
    _id: string;
    name: string;
    description?: string;
    started_at: number;
    ended_at: number;
    lat: number;
    long: number;
    location: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId;
    created_at: number;
    updated_at: number;
};

export type SuccessfulLocationsResponse = {
    data: {
        locations: ILocation[];
    }
} & SuccessfulResponse;

export type SuccessfulLocationResponse = {
    data: {
        location: ILocation;
    }
} & SuccessfulResponse;