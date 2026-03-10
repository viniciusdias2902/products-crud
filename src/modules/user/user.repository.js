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
  };
};

export { createUserRepository };
