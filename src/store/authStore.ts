import create from 'solid-zustand';
import { Admin } from '../types/AuthTypes';
import { invoke } from '@tauri-apps/api';

interface AuthStore {
  auth: Admin | null;
  jwtoken: string;
  config: {
    headers: {
      'Content-Type': string;
      Authorization: string;
    };
  };
  willKeepSession: boolean;
  idToChase: string | null;
  setIdToChase: (value: string | null) => void;
  setToken: (value: string) => void;
  getBackAuth: (str: string) => void;
  keepSession: (option: boolean) => void;
  closeSesion: () => void;
}

async function getProfile(jwt: string): Promise<Admin> {
  const auth: JSON | string = await invoke('profile', { jwt: jwt });
  if (typeof auth === 'object') {
    console.log(auth);
    return <Admin>{
      admin_id: (auth as any).admin_id,
      username: (auth as any).username,
      email: (auth as any).email
    };
  } else {
    console.log('err->', typeof auth);
    throw new Error(auth);
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  auth: null,
  jwtoken: '',
  config: {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer`
    }
  },
  willKeepSession: false,
  idToChase: null,
  setIdToChase: (value) => {
    set({
      idToChase: value,
    });
  },
  setToken: (value: string) => {
    set({
      jwtoken: value,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${value}`
        }
      }
    });
  },
  getBackAuth: async (jwt: string) => {
    let d: Admin;
    getProfile(jwt)
      .then((r) => {
        d = r;
        set({
          auth: d
        });
      })
      .catch((e) => {
        throw new Error(`store --->  ${e}`);
      });
  },
  keepSession: (option) => set({
    willKeepSession: option
  }),
  closeSesion: () => {
    localStorage.removeItem('hydmot_token');
    set({
        auth: null
    })
  }
}));
