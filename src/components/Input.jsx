import React, { useState } from 'react'
import { IoImageOutline, IoDocumentAttachOutline } from 'react-icons/io5'
import { db, storage } from '../firebase';
import { updateDoc, doc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
// library that we use to generate unique ids for messages
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const {currentUser} = useAuth();
  const {data} = useChat();

  const handleSend = async () => {
    const trimmedText = text.trim();

    if (!trimmedText && !img) {
      console.log('Nothing to send');
      return;
    }
    
    // create a message object
    let message = {
      id: uuid(),
      senderId: currentUser.uid,
      date: Timestamp.now()
    };

    // Add text to the trimmed message if it exists
    if (trimmedText) {
      message.text = trimmedText;
    }

    // Add image to the message if it exists
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          (error) => {
            console.log('Error uploading file');
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              message.img = downloadURL;
              resolve();
            })
          }
        )
      })
    }

    // Send the message
    await updateDoc(doc(db, 'chats', data.chatId), {
      messages: arrayUnion(message)
    });

    // Update the userChats collection
    const lastMessageContent = img ? '[Image]' : trimmedText;
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text: lastMessageContent
      },
      [data.chatId + '.date']: serverTimestamp(),
    });
    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text: lastMessageContent
      },
      [data.chatId + '.date']: serverTimestamp(),
    });
    setText('');
    setImg(null);

  };
  return (
    <div className='input'>
      <input type='text' 
        placeholder='Type something...' 
        onChange={e=>setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()} 
        value={text}/>
        <div className='send'>
          <span title='Attach an image'>
            <IoImageOutline color='darkgray' size='24px' style={{ cursor: 'pointer' }} />
          </span>
          <input type='file' style={{ display: 'none' }} id='file' onChange={e=>setImg(e.target.files[0])}/>
          <label htmlFor='file'>
            <span title='Attach a document'>
              <IoDocumentAttachOutline color='darkgray' size='24px' style={{ cursor: 'pointer' }} />
            </span>
          </label>
          <button onClick={handleSend} disabled={!text.trim() && !img}>Send</button>
        </div>
    </div>
  )
}

export default Input;
