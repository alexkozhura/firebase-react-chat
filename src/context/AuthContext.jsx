import { createContext } from 'react'; 
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';


// createContext() creates a context object. When React renders a component 
// that subscribes to this Context object it will read the current context value 
// from the closest matching Provider above it in the tree.
export const AuthContext = createContext();

// provides the 'currentUser' state to any component that it wraps (those are the 'children').
export const AuthContextProvider = ({ children }) => { 
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);

    // useEffect() is a React hook that runs after the first render of the component.
    //  the empty array [] means that the effect will only run once after the first render.
    useEffect(() => {
        // Check whether we have a user or not using a Firebase method
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (loading) {
                setLoading(false);
            }
        })

        // add a cleanup function to unsubscribe from the listener when the component unmounts
        return () => {
            unsub();
        }
    }, [loading]);

    if (loading) {
        return <p>Loading...</p>
    }

    // Any component that is wrapped by AuthContextProvider will have access to the currentUser
    // state and will be re-rendered any time the currentUser state changes.
    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    );
}