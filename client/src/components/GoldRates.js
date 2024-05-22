import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoldRate = () => {
  const [goldRates, setGoldRates] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoldRates = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/gold-rate');
        setGoldRates(response.data.goldRates);
        setTimestamp(response.data.timestamp);
      } catch (err) {
        setError(err);
      }
    };

    fetchGoldRates();
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes} ${period}`;
    return `Updated on: ${day}/${month}/${year} ${formattedTime}`;
  };

  if (error) {
    return <div>Error fetching gold rates: {error.message}</div>;
  }

  return (
    <div>
      <h1>Current Gold Rates</h1>
      {goldRates ? (
        <div>
          <p>{`24KT: ${goldRates['24KT']}`}</p>
          <p>{`22KT: ${goldRates['22KT']}`}</p>
          <p>{`18KT: ${goldRates['18KT']}`}</p>
          <p>{`14KT: ${goldRates['14KT']}`}</p>
          {/* <p>{`Silver: ${goldRates['Silver']}`}</p> */}
          {timestamp && <p>{formatDateTime(timestamp)}</p>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GoldRate;
