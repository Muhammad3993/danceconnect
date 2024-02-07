import AsyncStorage from '@react-native-community/async-storage';
import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from 'redux';
import {createLogger} from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import {saveAuthToken} from '../api/serverRequests';
import appStateReducer from './reducers/appStateReducer';
import bootstrap from './reducers/bootstrapReducer';
import communitiesReducer from './reducers/communitiesReducer';
import eventsReducer from './reducers/eventsReducer';
import peopleReducer from './reducers/peopleReducer';
import profileReducer from './reducers/profileReducer';
import registrationReducer from './reducers/registrationReducer';
import ticketsReducer from './reducers/ticketsReducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();

const authPersistConfig = {
  key: 'appState',
  storage: AsyncStorage,
  timeout: 3600000,
  blacklist: ['onLoading'],
};

const appReducer = combineReducers({
  registration: registrationReducer,
  profile: profileReducer,
  communities: communitiesReducer,
  events: eventsReducer,
  appState: persistReducer(authPersistConfig, appStateReducer),
  tickets: ticketsReducer,
  people: peopleReducer,
  bootstrap: bootstrap,
});

const rootPersistConfig = {
  key: 'keyOfStore',
  storage: AsyncStorage,
  timeout: 3600000,
  blacklist: ['bootstrap', 'appState'],
};

let middleware = applyMiddleware(sagaMiddleware, saveAuthToken);
if (__DEV__) {
  middleware = applyMiddleware(sagaMiddleware, loggerMiddleware, saveAuthToken);
}
const persistedReducer = persistReducer(rootPersistConfig, appReducer);

const store = createStore(persistedReducer, middleware);

sagaMiddleware.run(rootSaga);

export type IRootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
export default store;
