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
import {saveAuthToken} from '../api/serverRequests';
import ticketsReducer from './reducers/ticketsReducer';
import ticketsINitialState from './initialState/ticketsINitialState';
import peopleReducer from './reducers/peopleReducer';
import peopleInitialState from './initialState/peopleInitialState';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

const appReducer = combineReducers({
  registration: registrationReducer,
  profile: profileReducer,
  communities: communitiesReducer,
  events: eventsReducer,
  appState: appStateReducer,
  tickets: ticketsReducer,
  people: peopleReducer,
});
const rootState = {
  registration: registrationInitialState,
  profile: profileInitialState,
  communities: communitiesInitialState,
  events: eventsInitialState,
  appState: appStateInitialState,
  tickets: ticketsINitialState,
  people: peopleInitialState,
};

const rootPersistConfig = {
  key: 'keyOfStore',
  storage: AsyncStorage,
  timeout: 3600000,
  // blacklist: ['communities'],
};
let middleware = applyMiddleware(sagaMiddleware, saveAuthToken);
if (__DEV__) {
  middleware = applyMiddleware(sagaMiddleware, loggerMiddleware, saveAuthToken);
}
const persistedReducer = persistReducer(rootPersistConfig, appReducer);
const store = createStore(persistedReducer, rootState, middleware);
sagaMiddleware.run(rootSaga);

export type IRootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
export default store;
