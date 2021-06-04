import { combineReducers } from "redux";
import calculator from "./calculator";

/**
 * Combined reducers of the redux store
 */
const reducers = combineReducers({
  calculator
});

export default reducers;
