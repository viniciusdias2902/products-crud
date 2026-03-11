const createAuthController = (service) => {
  return {
    async register(req, res) {
      const data = req.validated.body;
      const result = await service.register(data);
      return res.status(201).json(result);
    },
    async login(req, res) {
      const { email, password } = req.validated.body;
      console.log(email);
      console.log(password);
      const result = await service.login(email, password);
      return res.status(200).json(result);
    },
    async refresh(req, res) {
      const { refreshToken } = req.validated.body;
      const result = await service.refresh(refreshToken);
      return res.status(200).json(result);
    },

    async logout(req, res) {
      await service.logout(req.user.userId);
      return res.status(204).send();
    },
  };
};

export { createAuthController };
