const validator = (schemas) => {
  return (req, res, next) => {
    const locations = ["body", "params", "query"];

    for (const location of locations) {
      if (!schemas[location]) continue;
      const result = schemas[location].safeParse(req[location]);
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.flatten(),
        });
      }
      req.validated = req.validated || {};
      req.validated[location] = result.data;
    }

    next();
  };
};

export { validator };
