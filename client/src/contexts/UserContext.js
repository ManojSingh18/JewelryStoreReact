import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch the user on initial load
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/users/profile', { withCredentials: true });
            setUser(response.data);
            console.log("Fetched user data:", response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
