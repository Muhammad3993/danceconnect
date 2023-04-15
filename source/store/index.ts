import AsyncStorage from '@react-native-community/async-storage';
import {legacy_createStore as createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore, persistReducer} from 'redux-persist';
import registrationReducer from './reducers/registrationReducer';
import registrationInitialState from './initialState/registrationInitialState';
import rootSaga from './sagas';
import {createLogger} from 'redux-logger';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

const appReducer = combineReducers({
  registration: registrationReducer,
});
const rootState = {
  registration: registrationInitialState,
};

const rootPersistConfig = {
  key: 'keyOfStore',
  storage: AsyncStorage,
  timeout: null,
};
let middleware = applyMiddleware(sagaMiddleware, loggerMiddleware);
const persistedReducer = persistReducer(rootPersistConfig, appReducer);
const store = createStore(persistedReducer, rootState, middleware);
sagaMiddleware.run(rootSaga);

export type IRootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
export default store;
