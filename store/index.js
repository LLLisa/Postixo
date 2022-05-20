import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

//dbSwitcheroo-----------------
// export const dbSwitcheroo = (newDbName) => {
//   console.log(newDbName);
//   return async (dispatch) => {
//     const response = await axios({
//       url: `/dbChange/${newDbName}`,
//       baseURL: 'http://localhost:42069',
//     });
//   };
// };

//models slice ---------------
const LOAD_MODELS = 'LOAD_MODELS';

const models = (state = [], action) => {
  if (action.type === LOAD_MODELS) return action.payload;
  return state;
};

export const loadModels = () => {
  return async (dispatch) => {
    const response = await axios({
      url: '/models',
      baseURL: 'http://localhost:42069', //should be dynamic
    });
    dispatch({ type: LOAD_MODELS, payload: response.data });
  };
};

//general store-----------------------------
export const genericLoader = (slice) => {
  return async (dispatch) => {
    try {
      const response = await axios({
        url: `/generic/${slice}`,
        baseURL: 'http://localhost:42069',
      });
      dispatch({ type: `LOAD_${slice}`, payload: response.data });
    } catch (error) {
      console.log(error);
    }
  };
};

const genericReducer = (slice) => {
  return (state = [], action) => {
    if (action.type === `LOAD_${slice}`) return action.payload;
    return state;
  };
};

//conduct witchcraft on the reducer
const reducerBody = {};
const modelsPreLoad = await axios({
  url: '/models',
  baseURL: 'http://localhost:42069', //should be dynamic
});

const preModels = modelsPreLoad.data;

for (let i = 0; i < preModels.length; i++) {
  reducerBody[preModels[i]] = genericReducer(preModels[i]);
}

//combine reducers------------------------------
const reducer = combineReducers({ models, ...reducerBody });

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
