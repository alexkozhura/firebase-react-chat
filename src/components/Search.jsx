import React, { useState } from 'react'
import { collection, query, where, getDocs, getDoc, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';


const Search = () => {
  // the user we're looking for
  const [username, setUsername] = useState('');
  // holds the data of the found user
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useAuth(); 
  const {dispatch} = useChat();

  const handleSearch = async () => {
    // check if user exists and it's not the current user
    if (username.trim() === '' || username.trim() == currentUser.displayName) {
      setErr(true);
      setUser(null);
      return;
    }

    const q = query(
      collection(db, 'users'), 
      where('displayName', '==', username));

  try {
    console.log('searching');
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      setErr(true);
      setUser(null);
      return;
    }
    querySnapshot.forEach((doc) => {
      setUser(doc.data());
      setErr(false);
      console.log(doc.id, ' => ', doc.data());
    })
  } catch (err) {
    console.error('User not found');
    setErr(true);
    } 
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    // check whether the group (i.e. chats collection in Firestore) exists;
    // if not -- create a new group
    const combinedId = currentUser.uid > user.uid 
      ? currentUser.uid + user.uid 
      : user.uid + currentUser.uid;

    console.log(combinedId);

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        // create a chat in chats collection. messages: [] to create an empty array
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        // create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          // that's how you updated nested objects in Firebase
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + '.date']: serverTimestamp()
        });

        // we do the same thing for the user who receives the message
        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + '.date']: serverTimestamp()
        });

      }
    } catch(err) {
      console.log(err);
    }

    // Dispatch the user to the reducer
    dispatch({
      type: 'CHANGE_USER',
      payload: user
    })
    
    // reset the state -- delete the user from the search bar after selecting the user
    setUser(null);
    setUsername('');
  }

  return (
    <div className='search'>
      <div className='searchForm'>
        <input 
          type='text' 
          placeholder='Find a user' 
          onKeyDown={handleKey} 
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span className='searchError'>User not found</span>}
      {/* Only return the div below if there's user*/}
      {user && <div className='userChat' onClick={handleSelect}>
        <img src={user.photoURL} alt='' />
        <div className='userChatInfo'>
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  );
}

export default Search;
