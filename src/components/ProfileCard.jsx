import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/gok24code');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="profile-card">Loading...</div>;
  }

  if (!user) {
    return <div className="profile-card">Error loading user data.</div>;
  }

  return (
    <div className="profile-card">
      <img src={user.avatar_url} alt={`${user.name}'s avatar`} style={{ width: '150px', borderRadius: '10px' }} />
      <h2>Göktuğ Toyguç</h2>
      <p>A passionate full-stack developer with a knack for creating innovative and user-friendly web applications. With a strong foundation in front-end and back-end technologies, I enjoy bringing ideas to life and am always eager to explore new technologies. My portfolio showcases a diverse range of projects, from interactive websites to AI-powered applications.</p>
      <div className="social-links">
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
          <button className="youtube-btn">YouTube</button>
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <button className="linkedin-btn">LinkedIn</button>
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;
