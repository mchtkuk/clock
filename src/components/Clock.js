import React from "react";
import { useState } from "react";

export default function Clock() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);




  const formatTime = (mytime) => {
    let minutes = Math.floor(mytime / 60);
    let seconds = mytime % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      // eslint-disable-next-line no-mixed-operators
      if (breakTime <= 60 && amount < 0 || (breakTime >= (60 * 60) && amount >=0)) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      // eslint-disable-next-line no-mixed-operators
      if (sessionTime <= 60 && amount < 0 || (sessionTime >= (60 * 60) && amount >= 0)) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
 
              onBreakVariable = false;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
         
              onBreakVariable = false;
              setOnBreak(true);
              return sessionTime;
            } else {
              return prev - 1;
            }
          });

          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  function Length({ title, changeTime, type, time, formatTime }) {
    return (
      <div>
        <h3>{title}</h3>
        <div className="show-time">
          <button onClick={() => changeTime(-60, type)}>
            <i>&darr;</i>
          </button>
          <h3>{formatTime(time)}</h3>
          <button onClick={() => changeTime(60, type)}>
            <i>&uarr;</i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appp">
      <h1>Pomodoro Clock</h1>
      <div className="dual-container">
        <Length
          title={"Break lenght"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title={"Session lenght"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <h3>{onBreak ? "Break" : "Session"}</h3>
      <h1>{formatTime(displayTime)}</h1>
      <button className="bottom-button1" onClick={controlTime}>
        {timerOn ? <i>&#x23f8;</i> : <i>&#x23f5;</i>}
      </button>
      <button onClick={resetTime} className="bottom-button2">
        <i>&#x21bb;</i>
      </button>
    </div>
  );
}
