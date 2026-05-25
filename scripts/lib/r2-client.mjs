import { createHash, createHmac } from 'node:crypto';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

const contentTypes = new Map([
	['.avif', 'image/avif'],
	['.css', 'text/css; charset=utf-8'],
	['.gif', 'image/gif'],
	['.html', 'text/html; charset=utf-8'],
	['.ico', 'image/x-icon'],
	['.jpeg', 'image/jpeg'],
	['.jpg', 'image/jpeg'],
	['.js', 'text/javascript; charset=utf-8'],
	['.json', 'application/json; charset=utf-8'],
	['.md', 'text/markdown; charset=utf-8'],
	['.mov', 'video/quicktime'],
	['.mp4', 'video/mp4'],
	['.png', 'image/png'],
	['.svg', 'image/svg+xml'],
	['.webm', 'video/webm'],
	['.webp', 'image/webp'],
]);

export function loadEnv() {
	const envPath = resolve(root, '.env');
	if (!existsSync(envPath)) {
		throw new Error('Missing .env file. Create it from .env.example first.');
	}

	const entries = {};
	const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);

	for (const line of lines) {
		if (!line.trim() || line.trimStart().startsWith('#')) continue;

		const separator = line.indexOf('=');
		if (separator === -1) continue;

		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
		entries[key] = value;
	}

	return entries;
}

export function required(env, key) {
	const value = env[key];
	if (!value) {
		throw new Error(`Missing ${key} in .env`);
	}

	return value;
}

export function publicCdnUrl(env, objectKey) {
	const publicCdnUrl = required(env, 'PUBLIC_CDN_URL').replace(/\/+$/, '');
	return `${publicCdnUrl}/${objectKey.replace(/^\/+/, '')}`;
}

export function guessContentType(filePath) {
	return contentTypes.get(extname(filePath).toLowerCase()) || 'application/octet-stream';
}

function hash(value) {
	return createHash('sha256').update(value).digest('hex');
}

function hmac(key, value, encoding) {
	return createHmac('sha256', key).update(value).digest(encoding);
}

function encodeKey(key) {
	return key
		.split('/')
		.map((part) => encodeURIComponent(part))
		.join('/');
}

function getSigningKey(secretAccessKey, dateStamp, region, service) {
	const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
	const kRegion = hmac(kDate, region);
	const kService = hmac(kRegion, service);
	return hmac(kService, 'aws4_request');
}

export async function uploadBody({ body, contentType, env, objectKey, size }) {
	const bucket = required(env, 'R2_BUCKET');
	const endpoint = required(env, 'R2_ENDPOINT').replace(/\/+$/, '');
	const accessKeyId = required(env, 'R2_ACCESS_KEY_ID');
	const secretAccessKey = required(env, 'R2_SECRET_ACCESS_KEY');
	const safeKey = objectKey.replace(/^\/+/, '');
	const url = new URL(`${endpoint}/${bucket}/${encodeKey(safeKey)}`);
	const now = new Date();
	const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
	const dateStamp = amzDate.slice(0, 8);
	const region = 'auto';
	const service = 's3';
	const payloadHash = 'UNSIGNED-PAYLOAD';

	const headers = {
		'cache-control': 'public, max-age=31536000, immutable',
		'content-length': String(size),
		'content-type': contentType,
		host: url.host,
		'x-amz-content-sha256': payloadHash,
		'x-amz-date': amzDate,
	};

	const signedHeaders = Object.keys(headers).sort().join(';');
	const canonicalHeaders = Object.keys(headers)
		.sort()
		.map((key) => `${key}:${headers[key]}\n`)
		.join('');
	const canonicalRequest = [
		'PUT',
		url.pathname,
		'',
		canonicalHeaders,
		signedHeaders,
		payloadHash,
	].join('\n');
	const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
	const stringToSign = [
		'AWS4-HMAC-SHA256',
		amzDate,
		credentialScope,
		hash(canonicalRequest),
	].join('\n');
	const signature = hmac(getSigningKey(secretAccessKey, dateStamp, region, service), stringToSign, 'hex');

	headers.authorization = [
		`AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}`,
		`SignedHeaders=${signedHeaders}`,
		`Signature=${signature}`,
	].join(', ');

	const response = await fetch(url, {
		method: 'PUT',
		headers,
		body,
		duplex: 'half',
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(`Upload failed (${response.status}): ${message}`);
	}

	return {
		key: safeKey,
		url: publicCdnUrl(env, safeKey),
	};
}

export async function uploadFile({ env, filePath, objectKey }) {
	const resolvedFile = resolve(root, filePath);
	if (!existsSync(resolvedFile)) {
		throw new Error(`File not found: ${filePath}`);
	}

	const { size } = statSync(resolvedFile);
	const contentType = guessContentType(resolvedFile);

	return uploadBody({
		body: createReadStream(resolvedFile),
		contentType,
		env,
		objectKey,
		size,
	});
}

