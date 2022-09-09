const fs = require("fs");
const { join } = require("path");
const fetch = require("node-fetch");
const { promisify } = require("util");
const blend = promisify(require("@mapbox/blend"));
const { existsSync, mkdirSync, chmodSync } = fs;
const writeFile = promisify(fs.writeFile);

const { CAT_API_URL, OUTPUT_FOLDER } = require("../constants/constants");

// Image merge and saving process
const mergeImages = async (inputs) => {
	const { greeting, who, width, height, color, size } = inputs;
	try {
		console.log("Images are fetching from cat service...");

		const [catImage1, catImage2] = await Promise.all([
			getCatImage({ label: greeting, width, height, color, size }),
			getCatImage({ label: who, width, height, color, size }),
		]);

		if (!catImage1 || !catImage2) {
			console.log("ERROR: Images fetch has failed.");
			return;
		}
		console.log("Fetched.!");
		const blendParams = [
			{ buffer: Buffer.from(catImage1), x: 0, y: 0 },
			{ buffer: Buffer.from(catImage2), x: width, y: 0 },
		];

		const blendImageConfig = {
			width: width * 2,
			height: height,
			format: "jpeg",
		};

		console.log("Image are binding...");

		const blendImage = await blend(blendParams, blendImageConfig);

		if (!blendImage) {
			console.log("ERROR: Image binding process has failed...");
		}

		console.log("Images bound.!");

		const savingPath = join(
			process.cwd(),
			`/${OUTPUT_FOLDER}/cat-card-${Date.now()}.jpg`
		);

		console.log("Image folder is validating...");
		// Check and create a folder if not exit
		if (!existsSync(OUTPUT_FOLDER)) {
			mkdirSync(OUTPUT_FOLDER);
			chmodSync(OUTPUT_FOLDER, 0o777); // Set permission to folder
		}

		console.log("Validated.! Bound image is saving...");
		await writeFile(savingPath, blendImage);

		console.log(
			`Your Bound image has saved successfully.(Image Path - ${savingPath})`
		);

		return true;
	} catch (error) {
		console.log("ERROR: Image blend process : ", error);
	}
};

// Fetch image from cat service
const getCatImage = async (data) => {
	const { label, width, height, color, size } = data;
	const url = `${CAT_API_URL}/${label}?width=${width}&height=${height}&c=${color}&s=${size}`;

	const response = await fetch(url);
	if (!response.ok) throw new Error("ERROR: Occurred while fetch image");

	return response.buffer();
};

module.exports = {
	mergeImages,
};
