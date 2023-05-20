import { create } from 'zustand';
import { Admin } from '../types/AuthTypes';
import { invoke } from '@tauri-apps/api';


interface AuthStore {
    admin_id: string, 
    username: string, 
    email: string,
    jwtoken: string,
    config: {
        headers: {
        'Content-Type': string,
        'Authorization': string
    }},
    setToken: (value: string) => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    admin_id: "", 
    username: "", 
    email: "",
    jwtoken: "",
    config: {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer`
    }},
    setToken: (value: string) => set({
        jwtoken: value
    }),
    getBackAuth: getProfile,
}))


const getProfile = async (jwt: string) => {
    const auth: Admin | string = await invoke('profile',{jwt: jwt});
}