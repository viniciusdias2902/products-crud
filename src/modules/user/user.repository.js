const createUserRepository = (prisma) => {
  return {
    async create(data) {
      console.log(data);
      const user = await prisma.user.create({ data });
      return user;
    },
    async findByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } });
      return user;
    },
    async findById(id) {
      const user = await prisma.user.findUnique({ where: { id } });
      return user;
    },
    async updateRefreshToken(id, refreshToken) {
      await prisma.user.update({
        where: { id },
        data: { refreshToken },
      });
    },
    async delete(id) {
      await prisma.user.delete({ where: { id } });
    },
  };
};

export { createUserRepository };
