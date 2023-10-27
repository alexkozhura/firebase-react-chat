// The component for the chat section of the app
import React, { useContext } from 'react';
import { IoVideocamOutline, IoPersonAddOutline, IoEllipsisHorizontalOutline } from 'react-icons/io5';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className='chat'>
      <div className='chatInfo'>
        {/* '?' means 'if there is no user, return undefined' */}
        <span>{data.user?.displayName}</span>
        <div className='chatIcons'>
          <IoVideocamOutline color='white' size='24px' />
          <IoPersonAddOutline color='white' size='24px' />
          <IoEllipsisHorizontalOutline color='white' size='24px' />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat;
