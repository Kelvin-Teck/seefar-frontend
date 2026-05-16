import React, { useEffect, useState } from 'react';
import './TrendCard.css';
import { getTrends } from '../../api/postRequest';

const TrendCard = () => {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data } = await getTrends();
        setTrends(data);
      } catch (error) {
        console.error("Failed to fetch trends", error);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="TrendCard">
      <h3>Trends for you</h3>
      {trends?.map((trend, index) => {
        return (
          <div key={index} className="trend">
            <span>#{trend.name}</span>
            <span>{trend.shares}k shares</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrendCard;