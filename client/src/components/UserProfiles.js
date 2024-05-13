import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../UserProfile.css';  

function Profile() {
    const [userData, setUserData] = useState({ username: '', email: '', profilePicture: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/api/users/profile', { withCredentials: true })
            .then(response =>
                { 
                    setUserData(response.data);
                    setNewUsername(response.data.username);
                    setNewEmail(response.data.email);
                })
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);

        axios.post('http://localhost:3001/api/users/upload-profile-picture', formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                alert('Profile picture updated successfully!');
                // Reload profile data to reflect the new picture
                axios.get('http://localhost:3001/api/users/profile', { withCredentials: true })
                    .then(response => setUserData(response.data))
                    .catch(error => console.error('Error refreshing user data:', error));
            })
            .catch(error => console.error('Error updating profile picture:', error));
    };

    const handleEditProfile = () => {
        setEditMode(true);
    };

    const handleSaveProfile = () => {
        // Send updated data to the server
        axios.post('http://localhost:3001/api/users/update-profile', {
            username: newUsername,
            email: newEmail
        }, { withCredentials: true })
            .then(() => {
                alert('Profile updated successfully!');
                setEditMode(false);
                setUserData({ ...userData, username: newUsername, email: newEmail });
            })
            .catch(error => console.error('Error updating profile:', error));
    };


   // Inside your Profile component's return statement
return (
    <div className="profile-page">
        <div className="profile-container">
            <h2>User Profile</h2>
            <img
                src={`http://localhost:3001${userData.profilePicture || '/uploads/default-profile.png'}`}
                alt="Profile"
                className="profile-image"
            />
            <p><strong>Username:</strong> {editMode ? (
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            ) : userData.username}</p>
            <p><strong>Email:</strong> {editMode ? (
                <input type="text" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            ) : userData.email}</p>

            {editMode && (
                <>
                    <input type="file" onChange={handleFileChange} />
                    <button className='fizzy-button' onClick={handleFileUpload}>Upload Profile Picture</button>
                </>
            )}

            {!editMode ? (
                <button className='fizzy-button' onClick={handleEditProfile}>Edit Profile</button>
            ) : (
                <button className='fizzy-button' onClick={handleSaveProfile}>Save Profile</button>
            )}
        </div>
    </div>
);

}

export default Profile;
