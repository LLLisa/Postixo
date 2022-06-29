import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

///get current database name-------------------
const GET_DBNAME = 'GET_DBNAME';

export const getDbName = () => {
  return async (dispatch) => {
    const response = await axios({
      url: '/dbName',
      baseURL: 'http://localhost:42069',
    });
    dispatch({ type: GET_DBNAME, payload: response.data });
  };
};

const dbName = (state = '', action) => {
  if (action.type === GET_DBNAME) return action.payload;
  return state;
};

//dblist slice------------------------------
const LOAD_DBNAMES = 'LOAD_DBNAMES';

export const loadDbNames = () => {
  return async (dispatch) => {
    const response = await axios({
      url: '/dbList',
      baseURL: 'http://localhost:42069',
    });
    dispatch({ type: LOAD_DBNAMES, payload: response.data.sort() });
  };
};

const dbList = (state = [], action) => {
  if (action.type === LOAD_DBNAMES) return action.payload;
  return state;
};

//models slice ---------------
const LOAD_MODELS = 'LOAD_MODELS';

export const loadModels = () => {
  return async (dispatch) => {
    const response = await axios({
      url: '/models',
      baseURL: 'http://localhost:42069',
    });
    dispatch({ type: LOAD_MODELS, payload: response.data.sort() });
  };
};

const models = (state = [], action) => {
  if (action.type === LOAD_MODELS) return action.payload;
  return state;
};

//general store-----------------------------
export const genericLoader = (slice) => {
  return async (dispatch) => {
    const response = await axios({
      url: `/generic/${slice}`,
      baseURL: 'http://localhost:42069',
    });
    dispatch({ type: `LOAD_${slice}`, payload: response.data });
  };
};

const genericReducer = (slice) => {
  return (state = [], action) => {
    if (action.type === `LOAD_${slice}`) return action.payload;
    return state;
  };
};

//conduct witchcraft on the reducer
const modelsPreLoad = await axios({
  url: '/models',
  baseURL: 'http://localhost:42069',
});

const preModels = modelsPreLoad.data;
const reducerBody = {};
for (let i = 0; i < preModels.length; i++) {
  reducerBody[preModels[i]] = genericReducer(preModels[i]);
}

//combine reducers------------------------------
const reducer = combineReducers({ dbName, dbList, models, ...reducerBody });

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
