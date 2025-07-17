export type SidebarLocationItem = {
    href: string;
    icon: string;
    label: string;
}

export const useSidebarLocationsStore = defineStore("useSidebarLocationsStore", () => {
    const sidebarLocationsItems = ref<SidebarLocationItem[]>([]);
    const loading = ref(false);

    return {
        sidebarLocationsItems,
        loading,
    }
});