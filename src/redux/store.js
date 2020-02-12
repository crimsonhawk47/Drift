import rootReducer from './reducers/index'; // imports ./redux/reducers/index.js
import rootSaga from './sagas/index'; // imports ./redux/sagas/index.js
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';


const sagaMiddleware = createSagaMiddleware();

const middlewareList = process.env.NODE_ENV === 'development' ?
  [sagaMiddleware, logger] :
  [sagaMiddleware];


  const store = createStore(
    // tells the saga middleware to use the rootReducer
    // rootSaga contains all of our other reducers
    rootReducer,
    // adds all middleware to our project including saga and logger
    // applyMiddleware(...middlewareList),
    applyMiddleware(...middlewareList),

  );
    
sagaMiddleware.run(rootSaga)

export default store
