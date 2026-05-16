import { create } from 'zustand';
import * as PostApi from '../api/postRequest';
import * as UploadApi from '../api/uploadRequest';

const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  uploading: false,
  error: false,
  hasMore: true,
  page: 1,

  getTimelinePosts: async (id, isNewPage = false) => {
    if (get().loading || (!isNewPage && !get().hasMore)) return;

    set({ loading: true, error: false });
    try {
      const currentPage = isNewPage ? get().page + 1 : 1;
      const { data } = await PostApi.getTimelinePosts(id, currentPage);
      
      set((state) => ({
        posts: isNewPage ? [...state.posts, ...data] : data,
        loading: false,
        page: currentPage,
        hasMore: data.length === 10 // Assuming limit is 10
      }));
    } catch (error) {
      console.error(error);
      set({ loading: false, error: true });
    }
  },

  resetPosts: () => {
    set({ posts: [], page: 1, hasMore: true });
  },

  uploadPost: async (newPost, imageData) => {
    set({ uploading: true, error: false });
    try {
      if (imageData) {
        await UploadApi.uploadImage(imageData);
      }
      const { data } = await UploadApi.uploadPost(newPost);
      set((state) => ({
        posts: [data, ...state.posts],
        uploading: false,
      }));
    } catch (error) {
      console.error(error);
      set({ uploading: false, error: true });
    }
  },
}));

export default usePostStore;
