// The component for the chats section of the app
import React, { useEffect, useState, useContext } from 'react';
import { db } from '../firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {
  // use useState to manage a state variable chats which will hold the chat data.
  const [chats, setChats] = useState({});

  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  // set up a listener on the userChats document in Firestore to get the chat data
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      
      // we need to clean up the listener when the component unmounts
      return () => {
        unsub();
      };
    }
    // only run the function if we have a user
    currentUser.uid && getChats();
  }, [currentUser.uid]); // currentUser.uid is a dependency. If it changes, the effect will run again

  // u = user
  const handleSelect = (u) => {
    // we'll use dispatch to update the user and the chat id.
    dispatch({
      type: 'CHANGE_USER',
      payload: u
    })
  }
  return (
    <div className='chats'>
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        // chat[0] is the chat id, chat[1] is the chat data
        <div className='userChat' key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}> 
        <img src={chat[1].userInfo.photoURL} alt='' />
        <div className='userChatInfo'>
          <span>{chat[1].userInfo.displayName}</span>
          <p>{chat[1].lastMessage?.text}</p>
        </div>
      </div>
      ))}
    </div>
  )
}

export default Chats;
