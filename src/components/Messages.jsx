import React from 'react'
import Message from './Message.jsx'
import { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { onSnapshot, doc } from 'firebase/firestore';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

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
