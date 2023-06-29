import AsyncStorage from '@react-native-community/async-storage';
import {legacy_createStore as createStore, applyMiddleware} from 'redux';
import {combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore, persistReducer} from 'redux-persist';
import registrationReducer from './reducers/registrationReducer';
import registrationInitialState from './initialState/registrationInitialState';
import rootSaga from './sagas';
import {createLogger} from 'redux-logger';
import profileReducer from './reducers/profileReducer';
import profileInitialState from './initialState/profileInitialState';
import communitiesReducer from './reducers/communitiesReducer';
import communitiesInitialState from './initialState/communitiesInitialState';
import eventsReducer from './reducers/eventsReducer';
import eventsInitialState from './initialState/eventsInitialState';
import appStateInitialState from './initialState/appStateInitialState';
import appStateReducer from './reducers/appStateReducer';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

const appReducer = combineReducers({
  registration: registrationReducer,
  profile: profileReducer,
  communities: communitiesReducer,
  events: eventsReducer,
  appState: appStateReducer,
});
const rootState = {
  registration: registrationInitialState,
  profile: profileInitialState,
  communities: communitiesInitialState,
  events: eventsInitialState,
  appState: appStateInitialState,
};

const rootPersistConfig = {
  key: 'keyOfStore',
  storage: AsyncStorage,
  timeout: 3600000,
  // blacklist: ['communities'],
};
let middleware = applyMiddleware(sagaMiddleware);
if (__DEV__) {
  middleware = applyMiddleware(sagaMiddleware, loggerMiddleware);
}
const persistedReducer = persistReducer(rootPersistConfig, appReducer);
const store = createStore(persistedReducer, rootState, middleware);
sagaMiddleware.run(rootSaga);

export type IRootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
export default store;
