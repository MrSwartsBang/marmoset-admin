import {ADD_CAROUSEL
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
    loading: false,
};
export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_CAROUSEL:
            
        console.log(action);
        
        return {
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };

        default:
            return state;
    }
}
