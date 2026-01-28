import { useEffect, useEffectEvent, useState } from "react";

interface OtpCountdownOptions {
  key: string; // localStorage key
  timeoutSeconds: number; // countdown length in seconds
}

export const useCountdown = ({ key, timeoutSeconds }: OtpCountdownOptions) => {
  const [remaining, setRemaining] = useState(0);
  const isCountdownDone = remaining <= 1;

  const setCountDownvalue = (timestamp: string) => {
    localStorage.setItem(key, timestamp);
    setRemaining(timeoutSeconds);
  };

  const handleSetReamining = useEffectEvent((remaining: number) => {
    setRemaining(remaining);
  });

  const decreaseCountdown = useEffectEvent(() => {
    setRemaining((prev) => Math.max(0, prev - 1));
  });

  // DOC: resume countdown, deacreasing the remaining time
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (!stored) return;

    const lastCountdownDateValue = Number(stored);
    const elapsedTime = Math.floor((Date.now() - lastCountdownDateValue) / 1000);
    const timeLeft = timeoutSeconds - elapsedTime;

    if (timeLeft > 0) handleSetReamining(timeLeft);
  }, [key, timeoutSeconds]);

  // DOC: start countdown
  useEffect(() => {
    const isCountdownDone = remaining <= 1;
    if (isCountdownDone) return;

    const intervalId = setInterval(() => decreaseCountdown(), 1000);
    return () => clearInterval(intervalId);
  }, [remaining]);

  return {
    remaining,
    isCountdownDone,
    setCountDownvalue,
  };
};
