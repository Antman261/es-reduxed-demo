import {createStore} from "redux";
import {eventStoreReduxEnhancer} from "es-reduxed";
import {pollsReducer, initialState} from "./reducer.js";

export const store = createStore(pollsReducer, initialState, eventStoreReduxEnhancer);

export type PollsStore = typeof store;