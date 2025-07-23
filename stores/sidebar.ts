import type { MapPoint } from "~/types/types";

export type SidebarItem = {
    _id: string;
    label: string;
    icon: string;
    href: string;
    mapPoint: MapPoint | null;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItem[]>([]);
    const loading = ref(false);

    return {
        loading,
        sidebarItems,
    };
});