import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const StreamingStatus = () => {
  const { user } = useAuth();
  const [streamingInfo, setStreamingInfo] = useState(null);

  useEffect(() => {
    if (user && user.subscription?.type === 'free') {
      fetchStreamingStatus();
    }
  }, [user]);

  const fetchStreamingStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`);
      setStreamingInfo(response.data.dailyStreams);
    } catch (error) {
      console.error('Error fetching streaming status:', error);
    }
  };

  if (!user || user.role === 'admin' || user.subscription?.type !== 'free' || !streamingInfo) {
    return null;
  }

  const today = new Date().toDateString();
  const streamDate = new Date(streamingInfo.date).toDateString();
  const isToday = today === streamDate;
  const remainingStreams = isToday ? Math.max(0, 1 - streamingInfo.count) : 1;

  return (
    <div className="streaming-status">
      <div className="status-info">
        <span className="status-text">
          Free Plan: {remainingStreams} movie{remainingStreams !== 1 ? 's' : ''} remaining today
        </span>
        {remainingStreams === 0 && (
          <span className="limit-reached">Daily limit reached</span>
        )}
      </div>
    </div>
  );
};

export default StreamingStatus;