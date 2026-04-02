export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      res.status(400).json({
        message: result.error.issues[0]?.message || "Invalid request"
      });
      return;
    }

    req.validated = result.data;
    next();
  };
}
