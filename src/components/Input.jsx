import React, { useState, useContext } from 'react'
import { IoImageOutline, IoDocumentAttachOutline } from 'react-icons/io5'
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../firebase';
import { updateDoc, doc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () => {
    const messageText = text;
    setText('');
    setImg(null);
    if(img) {
      // upload image to firebase storage
      // get the url of the image
      // send the url to the database
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on( 
        (error) => {
            // Handle unsuccessful uploads
            console.log('Error uploading file')
            setErr(true);
        }, 
        () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
              await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: messageText,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL
                }),
              });
        });
      }
    );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: messageText,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      });
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      // we're updating a nested object in the userChats collection
      [data.chatId + '.lastMessage']: {
        text
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    // clear the input
    // setText('');
    // setImg(null);
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
