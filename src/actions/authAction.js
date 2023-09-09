import * as authAPi from "../api/authRequest";

export const logIn = (FormData) => async (dispatch) => {

    dispatch({ type: 'AUTH_START' });

    try {
        const { data } = await authAPi.logIn(FormData);
        dispatch({ type: 'AUTH_SUCCESS', payload: data });
    } catch (error) {
        console.log(error);
        dispatch({type: 'AUTH_FAIL'})
    }
}


export const signUp = (FormData) => async (dispatch) => {

    dispatch({ type: 'AUTH_START' });

    try {
        const { data } = await authAPi.signUp(FormData);
        dispatch({ type: 'AUTH_SUCCESS', payload: data });
    } catch (error) {
        console.log(error);
        dispatch({type: 'AUTH_FAIL'})
    }
}