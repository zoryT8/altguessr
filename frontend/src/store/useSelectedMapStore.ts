import {create} from "zustand";

interface SelectedMapStore {
    selectedMapId: number,
    selectedMapName: string,
    setSelectedMap: (id: number, name: string) => void
}

export const useSelectedMapStore = create<SelectedMapStore>((set, get) => ({
    selectedMapId: 2,
    selectedMapName: "Demo",
    setSelectedMap: (id, name) => set({selectedMapId: id, selectedMapName: name})
}));