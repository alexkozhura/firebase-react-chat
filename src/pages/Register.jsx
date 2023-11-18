import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from '../firebase';
import { IoPersonAddOutline } from 'react-icons/io5';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";  // for adding user to firestore database
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const avatar = e.target[3].files[0];
        
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            // displayName will be the name of the image file
            const storageRef = ref(storage, displayName);

            const uploadTaskSnapshot = await uploadBytes(storageRef, avatar);  // use avatar here
            const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);

            await updateProfile(res.user, {
                    displayName,
                    photoURL: downloadURL
                })
            
            // add user to firestore (uid = unique user id)
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: downloadURL
            })

            await setDoc(doc(db, "userChats", res.user.uid), {})
            
            navigate('/');
        } catch (err) {
            console.log(err);
            setErr(true);
            console.log('Error signing up');
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Fearless Chat</span>
                <span className='title'>Register</span>
                <form onSubmit={handleSubmit}>
                    <input type='text' placeholder='display name'/>
                    <input type='email' placeholder='email'/>
                    <input type='password' placeholder='password'/> 
                    <input style={{display: 'none'}} type='file' id='file'/>
                    <label htmlFor='file'>
                        <IoPersonAddOutline color='darkgray' size='24px' />
                        <span>Add an avatar</span>
                    </label>
                    <button>Sign up</button>
                    {err && <span className='err'>Something went wrong!</span>}
                </form>
                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    );
}

export default Register;
