const Joi = require("joi");

const validate = (inputs) => {
	const schema = Joi.object({
		greeting: Joi.string()
			.alphanum()
			.trim()
			.label("Please enter valid [greeting]"),
		who: Joi.string().alphanum().trim().label("Please enter valid [who]"),
		width: Joi.number()
			.integer()
			.greater(0)
			.label("Please enter valid [width]"),
		height: Joi.number()
			.integer()
			.greater(0)
			.label("Please enter valid [height]"),
		color: Joi.string().alphanum().trim().label("Please enter valid [color]"),
		size: Joi.number().integer().greater(0).label("Please enter valid [size]"),
	});

	const result = schema.validate(inputs);
	if (result.error) {
		console.log("ERROR validation :", result.error.message);
	}

	return !result.error;
};

module.exports = {
	validate,
};
