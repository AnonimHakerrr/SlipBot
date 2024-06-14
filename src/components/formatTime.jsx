// formatTime.js
import React from 'react'; // Якщо використовуєте React JSX

const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Форматуємо числа, щоб додати ведучі нулі
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

   
    return (
        <span className='time'>{formattedHours}:{formattedMinutes} </span>
    );
};

export default formatTime;
