const authReducer = (state = {authData: null, loading: false, error: false, updateLoading: false}, action) => {
    switch (action.type) {
      case "AUTH_START":
        return { ...state, loading: true, error: false };
      case "AUTH_SUCCESS":
        localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
        return {
          ...state,
          authData: action.payload,
          loading: false,
          error: false,
        };
      case "AUTH_FAIL":
        return { ...state, loading: false, error: true };
      case "UPDATING_START":
        return { ...state, updateLoading: true, error: false };
      case "UPDATING_SUCCESS":
        localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
        return {
          ...state,
          authData: action.payload,
          updateLoading: false,
          error: false,
        };
      case "UPDATING_FAIL":
        return { ...state, updateLoading: false, error: true };
      case "FOLLOW_USER":
        return {
          ...state,
          authData: {
            ...state.authData,
            user: {
              ...state.authData.user,
              following: [...state.authData.user.following, action.payload],
            },
          },
        };
      case "UNFOLLOW_USER":
        return {
          ...state,
          authData: {
            ...state.authData,
            user: {
              ...state.authData.user,
              following: [...state.authData.user.following.filter(personId => personId !== action.payload)],
            },
          },
        };

      case "LOG_OUT":
        localStorage.clear();
        return { ...state, authData: null, error: false, loading: false };

      default:
        return state;
    }
} 

export default authReducer;