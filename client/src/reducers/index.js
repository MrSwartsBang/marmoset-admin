import { combineReducers } from "redux";
import authReducer from "./authReducers";
import carouselReducer from "./carouselReducer";
import errorReducer from "./errorReducers";
export default combineReducers({
    auth: authReducer,
    carousel:carouselReducer,
    errors: errorReducer
});