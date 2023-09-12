import * as postApi from '../api/postRequest';

export const getTimelinePosts = (id) => async (dispatch) => {
  dispatch({ type: "RETRIEVING_START" });

  try {
    const { data } = await postApi.getTimelinePosts(id);
    dispatch({ type: "RETRIEVING_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "RETRIEVING_FAIL" });
    console.log(error);
  }
};
