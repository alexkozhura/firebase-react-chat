import React from 'react'
import Message from './Message.jsx'
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { useChat } from '../hooks/useChat.js';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useChat();

  useEffect(() => {
    // we're going to pass 'combinedId' from 'data'
    const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => {
      unsub();
    }
  }, [data.chatId])

  return (
    <div className='messages'>
        {/* message is an array so we need to map through it */}
        {messages.map((message) => (
          <Message message={message} key={message.id}/>
        ))}
    </div>
  )
}

export default Messages
