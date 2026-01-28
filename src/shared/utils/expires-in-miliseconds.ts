function expiresInMiliseconds(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}
export { expiresInMiliseconds };
