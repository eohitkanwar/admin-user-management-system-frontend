const Joi = require("joi");

const userValidation = async (req, res, next) => {
  try {
    const uservalidation = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().min(18).required(),
      email: Joi.string().lowercase().email().required(),
      password: Joi.string().min(4).required(),
      });
    const { error } = uservalidation.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json(error.details);
    }
    next();
  } catch (error) {
    console.log("-----", error);
  }
};

module.exports = userValidation;
