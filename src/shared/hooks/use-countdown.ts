"use client";
import { useEffect, useEffectEvent, useState } from "react";

interface OtpCountdownOptions {
  key: string; // localStorage key
  timeoutSeconds: number; // countdown length in seconds
}

interface OtpCountdownReturn {
  remaining: number;
  isCountdownDone: boolean;
}

// DOC: Get remaining time from localStorage
export const getCountdownRemaining = ({ key, timeoutSeconds }: OtpCountdownOptions): OtpCountdownReturn => {
  const stored = localStorage.getItem(key);
  if (!stored) return { remaining: 0, isCountdownDone: true };

  const lastCountdownDateValue = Number(stored);
  const elapsedTime = Math.floor((Date.now() - lastCountdownDateValue) / 1000);
  const timeLeft = timeoutSeconds - elapsedTime;

  return { remaining: timeLeft, isCountdownDone: timeLeft <= 1 };
};

export const useCountdown = ({ key, timeoutSeconds }: OtpCountdownOptions) => {
  const [stateRemaining, setStateRemaining] = useState(0);
  const internalState = { remaining: stateRemaining, isCountdownDone: stateRemaining <= 1 };

  // DOC: start countdown
  const startCountdown = () => {
    const { isCountdownDone } = getCountdownRemaining({ key, timeoutSeconds });
    if (!isCountdownDone) return;

    const timestamp = Date.now().toString();

    localStorage.setItem(key, timestamp);
    setStateRemaining(timeoutSeconds);
  };

  // DOC: event handler
  const handleSetReamining = useEffectEvent((remaining: number) => {
    setStateRemaining(remaining);
  });

  const handleRevomeCountdown = useEffectEvent(() => {
    localStorage.removeItem(key);
    setStateRemaining(0);
  });

  const decreaseCountdown = useEffectEvent(() => {
    setStateRemaining((prev) => Math.max(0, prev - 1));
    const localStorageState = getCountdownRemaining({ key, timeoutSeconds });
    if (localStorageState.isCountdownDone) return handleRevomeCountdown();
  });

  // DOC: resume countdown, deacreasing the remaining time
  useEffect(() => {
    const localStorageState = getCountdownRemaining({ key, timeoutSeconds });
    const { remaining, isCountdownDone } = localStorageState;

    if (isCountdownDone) return handleRevomeCountdown();
    handleSetReamining(remaining);
  }, [key, timeoutSeconds]);

  // DOC: start countdown
  useEffect(() => {
    const intervalId = setInterval(() => decreaseCountdown(), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    internalState,
    startCountdown,
  };
};
