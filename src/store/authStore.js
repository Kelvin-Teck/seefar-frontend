import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as AuthApi from '../api/authRequest';
import * as UserApi from '../api/userRequest';
import * as UploadApi from '../api/uploadRequest';

const useAuthStore = create(
  persist(
    (set, get) => ({
      authData: null,
      loading: false,
      error: false,
      updateLoading: false,

      login: async (formData) => {
        set({ loading: true, error: false });
        try {
          const { data } = await AuthApi.logIn(formData);
          set({ authData: data, loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false, error: true });
        }
      },

      register: async (formData) => {
        set({ loading: true, error: false });
        try {
          const { data } = await AuthApi.signUp(formData);
          set({ authData: data, loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false, error: true });
        }
      },

      logout: () => {
        set({ authData: null, loading: false, error: false });
        localStorage.clear();
      },

      updateUser: async (id, formData, images = []) => {
        set({ updateLoading: true, error: false });
        try {
          // images is an array of FormData objects
          for (const imgData of images) {
            await UploadApi.uploadImage(imgData);
          }
          const { data } = await UserApi.updateUser(id, formData);
          set({ authData: data, updateLoading: false });
        } catch (error) {
          console.error(error);
          set({ updateLoading: false, error: true });
        }
      },

      followUser: async (personId) => {
        const { authData } = get();
        if (authData) {
          try {
            await UserApi.followUser(personId, { _id: authData.user._id });
            set({
              authData: {
                ...authData,
                user: {
                  ...authData.user,
                  following: [...authData.user.following, personId],
                },
              },
            });
          } catch (error) {
            console.error(error);
          }
        }
      },

      unfollowUser: async (personId) => {
        const { authData } = get();
        if (authData) {
          try {
            await UserApi.unFollowUser(personId, { _id: authData.user._id });
            set({
              authData: {
                ...authData,
                user: {
                  ...authData.user,
                  following: authData.user.following.filter((id) => id !== personId),
                },
              },
            });
          } catch (error) {
            console.error(error);
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
