const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    next();
  };
};

const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email debe ser válido",
      "any.required": "Email es requerido",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password debe tener al menos 6 caracteres",
      "any.required": "Password es requerido",
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email debe ser válido",
      "any.required": "Email es requerido",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password es requerido",
    }),
  }),
};

const messageSchemas = {
  sendMessage: Joi.object({
    text: Joi.string().trim().min(1).max(1000).required().messages({
      "string.min": "El mensaje no puede estar vacío",
      "string.max": "El mensaje no puede exceder 1000 caracteres",
      "any.required": "Texto del mensaje es requerido",
    }),
  }),
};

module.exports = {
  validate,
  authSchemas,
  messageSchemas,
};
