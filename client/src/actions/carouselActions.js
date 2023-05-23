import axios from "axios";
import {
    GET_ERRORS,
    ADD_CAROUSEL
} from "./types";

export const addCarousel = (carouselData, history) => dispatch => {
    axios
        .post("/api/carousel-add", carouselData)
        .then(res =>{
            
            dispatch({
                type: ADD_CAROUSEL,
                payload: res,
            });
        }
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
