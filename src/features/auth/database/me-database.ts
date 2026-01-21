const getMyUserData = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, verifiedAt: true },
  });
};
