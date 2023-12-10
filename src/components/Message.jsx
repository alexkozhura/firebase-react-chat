import React from 'react';
import { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

const Message = ({message}) => {
  // To get the current user
  const { currentUser } = useAuth();
  // To get the chat id and the user
  const { data } = useChat();
  // To check if the message is from the current user to style it correctly
  const isOwner = message.senderId === currentUser.uid;

  const timeSinceSent = formatDistanceToNow(message.date.toDate());

  // Assign a ref to the chat container
  const messagesEndRef = useRef(null);


  useEffect(() => {
    // Scroll to the bottom of the chat container
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message])

  return (
    <div ref={messagesEndRef} className={`message ${isOwner && 'owner'}`} >
      <div className='messageInfo'>
        <img src={
          message.senderId === currentUser.uid 
            ? currentUser.photoURL 
            : data.user.photoURL
          } 
          alt='' 
        />
        <span>{timeSinceSent} ago</span>
      </div>
      <div className='messageContent'>
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt='' />}
      </div>
    </div>
  )
}

export default Message;
