import Axios from "axios";
import types from "./types";

export const editMenuItem = (menuItemId, changes) => async (dispatch) => {
  try {
    dispatch({ type: types.EDIT_VENDOR });
    const response = await Axios.post("/vendors/editMenuItem", {
      menuItemId,
      changes,
    });
    dispatch({ type: types.EDIT_VENDOR_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: types.EDIT_VENDOR_FAIL, error });
  }
};