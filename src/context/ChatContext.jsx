import { createContext } from 'react'; 
import { AuthContext } from './AuthContext';
import { useContext, useReducer } from 'react';

// createContext() creates a context object. When React renders a component 
// that subscribes to this Context object it will read the current context value 
// from the closest matching Provider above it in the tree.
export const ChatContext = createContext();

// provides the 'currentUser' state to any component that it wraps (those are the 'children').
export const ChatContextProvider = ({ children }) => { 
    const {currentUser} = useContext(AuthContext);
    // we'll use useReducer here instead of useState because we have a complex state
    const INITIAL_STATE = {
        chatId: 'null',
        user: {}
    }

    const chatReducer = (state, action) => {
        // when we click on a user, we'll update the user and the chat id.
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                }
            default:
                return state;
        } 
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE); 

    // Any component that is wrapped by ChatContextProvider will have access to the currentUser
    // state and will be re-rendered any time the currentUser state changes.
    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            { children }
        </ChatContext.Provider>
    );
}