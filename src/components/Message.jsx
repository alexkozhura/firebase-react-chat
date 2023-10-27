import React from 'react';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';

const Message = ({message}) => {
  // To get the current user
  const { currentUser } = useContext(AuthContext);
  // To get the chat id and the user
  const { data } = useContext(ChatContext);
  // To check if the message is from the current user to style it correctly
  const isOwner = message.senderId === currentUser.uid;
  // Assign a ref to the chat container
  const messagesEndRef = useRef(null);

  const timeSinceSent = formatDistanceToNow(message.date.toDate());

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
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt='' />}
      </div>
    </div>
  )
}

export default Message;
