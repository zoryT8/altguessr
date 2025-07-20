import {create} from "zustand";

interface UserStore {
    username: string
    setUsername: (newUsername: string) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
    username: "Guest",
    setUsername: (newUsername) => set({username: newUsername})
}));