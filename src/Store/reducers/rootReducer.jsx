import { combineReducers } from "redux";
import setDataReducer from "./setDataReducer";
import resetDataReducer from "./resetDataReducer";
import imagesReducer from "./imagesReducer";
import tokenReducer from "./tokenReducer";
import roleReducer from "./roleReducer";
import logoutReducer from "./logoutReducer";

const rootReducer = combineReducers({
  data: setDataReducer,
  reset: resetDataReducer,
  image: imagesReducer,
  token: tokenReducer,
  role: roleReducer,
  logout: logoutReducer, // Add the logout reducer here
});

export default rootReducer;
