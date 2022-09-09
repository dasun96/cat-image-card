const { validate } = require("./util/validator");
const { mergeImages } = require("./services/catService");
const argv = require("minimist")(process.argv.slice(2));

const startApp = async () => {
	console.log("Images bind and save processing has started...");

	const {
		greeting = "Hello",
		who = "You",
		width = 400,
		height = 500,
		color = "Pink",
		size = 100,
	} = argv;

	const userInputs = {
		greeting,
		who,
		width,
		height,
		color,
		size,
	};

	console.log("Inputs are validating...");
	//validating inputs
	if (!validate(userInputs)) {
		return;
	}

	console.log("Validated.!");
	//images bind process
	const process = await mergeImages(userInputs);
	if (process) {
		console.log("End process.!");
	}
};

(async () => {
	await startApp();
})();
