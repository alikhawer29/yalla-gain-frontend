import React, { useState, useEffect } from "react";

const OrderTimer = ({ estimatedMinutes, orderId }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const makingTimeInMilliseconds = estimatedMinutes * 60 * 1000;

  useEffect(() => {
    const orderStartTimeKey = `orderStartTime_${orderId}`;
    let orderStartTime = localStorage.getItem(orderStartTimeKey);

    if (!orderStartTime) {
      const now = Date.now();
      localStorage.setItem(orderStartTimeKey, now);
      orderStartTime = now;
    } else {
      orderStartTime = parseInt(orderStartTime, 10);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - orderStartTime;
      setTimeLeft(makingTimeInMilliseconds - elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [orderId, makingTimeInMilliseconds]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.abs(Math.floor(milliseconds / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const timeColor = timeLeft >= 0 ? "greenColor" : "redColor";

  return (
    <div>
      {estimatedMinutes ? (
        <h6 className="primaryColor">
          Estimated Preparation Time:
          <span className={timeColor}>
            {timeLeft >= 0 ? formatTime(timeLeft) : `-${formatTime(timeLeft)}`}
          </span>
        </h6>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrderTimer;
