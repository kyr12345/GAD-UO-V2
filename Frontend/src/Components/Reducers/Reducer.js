import { combineReducers } from 'redux'

 const initialUserState = {
  currentUser: null,
  isLoading: false,
}

const reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        currentUser: action.payload.currentUser,
        isLoading: true,
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user: reducer,
})

export default rootReducer
