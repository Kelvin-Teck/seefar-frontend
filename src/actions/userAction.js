import * as userApi from '../api/userRequest';

export const updateUser = (id, formData) => async (dispatch) => {
    dispatch({ type: "UPDATING_START" });

    try {
        const { data } = await userApi.updateUser(id, formData);
        dispatch({ type: "UPDATING_SUCCES", payload: data });
        // localStorage.setItem('profile', JSON.stringify({})) 
    } catch (error) {
        console.log(error)
        dispatch({ type: "UPDATING_FAIL" });
    }
}

export const followUser = (id, data) => async (dispatch) => {
    dispatch({ type: "FOLLOW_USER" });
    userApi.followUser(id, data)
}

export const unFollowUser = (id, data) => async (dispatch) => {
  dispatch({ type: "UNFOLLOW_USER", payload: id });
  userApi.unFollowUser(id, data);
};