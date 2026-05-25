import { loadEnv, uploadFile } from './lib/r2-client.mjs';

function printUsage() {
	console.log('Usage: npm run cdn:upload -- <local-file> <cdn-key>');
	console.log('Example: npm run cdn:upload -- public/brand-logo.png brand/logo.png');
}

const [, , filePath, objectKey] = process.argv;

if (!filePath || !objectKey) {
	printUsage();
	process.exitCode = 1;
} else {
	uploadFile({ filePath, objectKey, env: loadEnv() }).catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	}).then((result) => {
		if (result) console.log(`Uploaded ${filePath} -> ${result.url}`);
	});
}
