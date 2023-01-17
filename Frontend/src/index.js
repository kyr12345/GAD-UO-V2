import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { composeWithDevTools } from '@redux-devtools/extension'
import { legacy_createStore as createStore } from 'redux'
import rootReducer from './Components/Reducers/Reducer'

const store = createStore(rootReducer, composeWithDevTools())

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />,
    </Provider>
    ,
  </React.StrictMode>,
)

reportWebVitals()
