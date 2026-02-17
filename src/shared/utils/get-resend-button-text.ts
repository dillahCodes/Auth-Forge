interface GetResendButtonText {
  isReqPending: boolean;
  isCountdownDone: boolean;
  remaining: number;
}

export const getResendButtonText = ({ isReqPending, isCountdownDone, remaining }: GetResendButtonText) => {
  if (isReqPending) return "Sending...";
  if (!isCountdownDone) return `Resend in ${remaining}s`;
  return "Resend Code";
};
