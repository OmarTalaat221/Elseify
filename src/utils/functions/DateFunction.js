import React, { useState, useEffect } from 'react';

export const useArabicFormattedDate = (date) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const arabicDate = date && new Intl.DateTimeFormat('ar', options)?.format(new Date(date))
  return arabicDate
}

export const GetTime = ({ date }) => {
  const dateTime = new Date(date)

  let hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  const seconds = dateTime.getSeconds()

  let period = 'AM'

  
  if (hours > 12) {
    hours -= 12
    period = 'PM'
  } else if (hours === 12) {
    period = 'PM'
  } else if (hours === 0) {
    hours = 12
  }

  return (
    <div>
      {seconds} : {minutes} :{' '}
      <span className="fw-bolder " style={{ fontWeight: 'bolder' }}>
        {hours}
      </span>{' '}
      {period}
    </div>
  )
}

export const isToday = (date) => {
  const dateTime = new Date(date)

  const today = new Date()

  const isToday =
    dateTime.getFullYear() === today.getFullYear() &&
    dateTime.getMonth() === today.getMonth() &&
    dateTime.getDate() === today.getDate()

  return isToday
}

export const GetDifferenceInHours = ({ firstTime, secondTime }) => {
  const dateTime1 = new Date(firstTime)
  const dateTime2 = new Date(secondTime)

  const timeDifferenceMs = Math.abs(dateTime2 - dateTime1)

  
  const hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60))
  const minutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60))
  

  return (
    <div>
      {hours == 0
        ? ''
        : hours == 1
          ? 'ساعة'
          : hours == 2
            ? 'ساعتان'
            : hours < 10
              ? hours + ' ساعات  '
              : hours + 'ساعة'}{' '}
      {minutes > 0 && hours > 0 && 'و'}{' '}
      {minutes == 0
        ? ''
        : minutes == 1
          ? 'دقيقة واحدة'
          : minutes == 2
            ? 'دقيقتان'
            : minutes < 10
              ? minutes + ' دقائق '
              : minutes + ' دقيقة '}{' '}
      {hours <= 0 && minutes <= 0 && 'اقل من دقيقة'}
    </div>
  )
}



export function useCountdownTimer(targetDate) {

  function formatNumber(num) {
    return num < 10 ? `0${num}` : num;
  }

  const targetToDate = new Date(targetDate).getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const timeDifference =  now - targetToDate;

    if (timeDifference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = formatNumber(Math.floor(timeDifference / (1000 * 60 * 60)));
    const minutes = formatNumber(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = formatNumber(Math.floor((timeDifference % (1000 * 60)) / 1000));

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [targetDate]);

  return timeLeft;
}