import { createServer } from 'node:http';
import { loadEnv, uploadBody } from './lib/r2-client.mjs';

const env = loadEnv();
const host = '127.0.0.1';
const port = Number(process.env.CDN_STUDIO_PORT || 8787);
const maxUploadMb = Number(process.env.CDN_STUDIO_MAX_MB || 250);
const maxUploadBytes = maxUploadMb * 1024 * 1024;

function sendJson(response, statusCode, payload) {
	response.writeHead(statusCode, {
		'content-type': 'application/json; charset=utf-8',
	});
	response.end(JSON.stringify(payload));
}

function sendHtml(response) {
	response.writeHead(200, {
		'content-type': 'text/html; charset=utf-8',
	});
	response.end(`<!doctype html>
<html lang="th">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>CDN Studio</title>
		<style>
			:root {
				--bg: #11100e;
				--panel: #181714;
				--text: #eee9dd;
				--muted: #b7ad9d;
				--subtle: #83796b;
				--line: #263230;
				--accent: #36cfc0;
				--accent-soft: #a5eee6;
				font-family: 'Noto Sans Thai Looped', system-ui, sans-serif;
			}

			* {
				box-sizing: border-box;
			}

			body {
				margin: 0;
				background: var(--bg);
				color: var(--text);
				font-size: 17px;
				line-height: 1.7;
			}

			main {
				width: 760px;
				max-width: calc(100% - 2rem);
				margin: 0 auto;
				padding: 4rem 0;
			}

			h1 {
				margin: 0 0 0.5rem;
				font-size: 2.2rem;
				line-height: 1.2;
			}

			p {
				margin: 0;
				color: var(--muted);
			}

			.panel {
				margin-top: 2rem;
				border: 1px solid var(--line);
				background: var(--panel);
				border-radius: 8px;
				padding: 1rem;
			}

			label {
				display: block;
				margin-bottom: 0.45rem;
				color: var(--muted);
				font-size: 0.9rem;
			}

			input,
			select,
			button {
				width: 100%;
				min-height: 2.75rem;
				border: 1px solid var(--line);
				border-radius: 6px;
				background: #11100e;
				color: var(--text);
				font: inherit;
			}

			input,
			select {
				padding: 0.45rem 0.65rem;
			}

			button {
				cursor: pointer;
				border-color: rgba(54, 207, 192, 0.45);
				background: rgba(54, 207, 192, 0.12);
				color: var(--accent-soft);
				font-weight: 600;
			}

			button:disabled {
				cursor: not-allowed;
				opacity: 0.45;
			}

			.grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 1rem;
			}

			.drop {
				margin-top: 1rem;
				padding: 2rem;
				border: 1px dashed rgba(54, 207, 192, 0.45);
				border-radius: 8px;
				text-align: center;
			}

			.drop.active {
				background: rgba(54, 207, 192, 0.08);
			}

			.actions {
				display: grid;
				grid-template-columns: 1fr 9rem;
				gap: 1rem;
				margin-top: 1rem;
			}

			.files {
				margin-top: 1.25rem;
				display: grid;
				gap: 0.65rem;
			}

			.file {
				display: grid;
				grid-template-columns: 1fr auto;
				gap: 1rem;
				align-items: center;
				padding: 0.75rem 0;
				border-top: 1px solid var(--line);
			}

			.file code,
			.result code {
				color: var(--accent-soft);
				word-break: break-all;
			}

			.result {
				margin-top: 1rem;
				display: grid;
				gap: 0.7rem;
			}

			.result a {
				color: var(--accent-soft);
			}

			@media (max-width: 720px) {
				main {
					padding: 2rem 0;
				}

				.grid,
				.actions {
					grid-template-columns: 1fr;
				}
			}
		</style>
	</head>
	<body>
		<main>
			<h1>CDN Studio</h1>
			<p>Local uploader สำหรับส่งรูปและวิดีโอขึ้น CDN โดยใช้ key จากไฟล์ .env ในเครื่องนี้</p>

			<section class="panel">
				<div class="grid">
					<div>
						<label for="prefix">Folder</label>
						<select id="prefix">
							<option value="images">images</option>
							<option value="videos">videos</option>
							<option value="brand">brand</option>
							<option value="posts">posts</option>
						</select>
					</div>
					<div>
						<label for="customPrefix">Custom folder</label>
						<input id="customPrefix" placeholder="เช่น posts/2026" />
					</div>
				</div>

				<div id="drop" class="drop">
					<p>ลากไฟล์มาวาง หรือเลือกไฟล์จากเครื่อง</p>
				</div>

				<div class="actions">
					<input id="fileInput" type="file" multiple accept="image/*,video/*,.svg,.webp,.avif" />
					<button id="upload" disabled>Upload</button>
				</div>

				<div id="files" class="files"></div>
				<div id="result" class="result"></div>
			</section>
		</main>

		<script>
			const fileInput = document.querySelector('#fileInput');
			const uploadButton = document.querySelector('#upload');
			const filesEl = document.querySelector('#files');
			const resultEl = document.querySelector('#result');
			const drop = document.querySelector('#drop');
			const prefix = document.querySelector('#prefix');
			const customPrefix = document.querySelector('#customPrefix');
			let selectedFiles = [];

			function slugName(name) {
				const dot = name.lastIndexOf('.');
				const base = dot === -1 ? name : name.slice(0, dot);
				const ext = dot === -1 ? '' : name.slice(dot).toLowerCase();
				const clean = base
					.normalize('NFKD')
					.replace(/[\\u0300-\\u036f]/g, '')
					.toLowerCase()
					.replace(/[^a-z0-9ก-๙]+/g, '-')
					.replace(/^-+|-+$/g, '');

				return (clean || 'file') + ext;
			}

			function folder() {
				return (customPrefix.value || prefix.value).replace(/^\\/+|\\/+$/g, '');
			}

			function objectKey(file) {
				return [folder(), slugName(file.name)].filter(Boolean).join('/');
			}

			function renderFiles() {
				uploadButton.disabled = selectedFiles.length === 0;
				filesEl.innerHTML = selectedFiles
					.map((file) => {
						const size = (file.size / 1024 / 1024).toFixed(2);
						return '<div class="file"><div><strong>' + file.name + '</strong><br /><code>' + objectKey(file) + '</code></div><span>' + size + ' MB</span></div>';
					})
					.join('');
			}

			function setFiles(files) {
				selectedFiles = Array.from(files);
				resultEl.innerHTML = '';
				renderFiles();
			}

			fileInput.addEventListener('change', () => setFiles(fileInput.files));
			prefix.addEventListener('change', renderFiles);
			customPrefix.addEventListener('input', renderFiles);

			for (const eventName of ['dragenter', 'dragover']) {
				drop.addEventListener(eventName, (event) => {
					event.preventDefault();
					drop.classList.add('active');
				});
			}

			for (const eventName of ['dragleave', 'drop']) {
				drop.addEventListener(eventName, (event) => {
					event.preventDefault();
					drop.classList.remove('active');
				});
			}

			drop.addEventListener('drop', (event) => {
				setFiles(event.dataTransfer.files);
			});

			uploadButton.addEventListener('click', async () => {
				uploadButton.disabled = true;
				resultEl.innerHTML = '';

				for (const file of selectedFiles) {
					const key = objectKey(file);
					const row = document.createElement('div');
					row.innerHTML = '<code>' + key + '</code> uploading...';
					resultEl.append(row);

					try {
						const response = await fetch('/upload?key=' + encodeURIComponent(key), {
							method: 'POST',
							headers: {
								'x-file-name': file.name,
								'x-file-type': file.type || 'application/octet-stream',
							},
							body: file,
						});
						const payload = await response.json();

						if (!response.ok) throw new Error(payload.error || 'Upload failed');

						row.innerHTML = '<a href="' + payload.url + '" target="_blank" rel="noreferrer">' + payload.url + '</a>';
					} catch (error) {
						row.textContent = key + ' failed: ' + error.message;
					}
				}

				uploadButton.disabled = selectedFiles.length === 0;
			});
		</script>
	</body>
</html>`);
}

async function readRequestBody(request) {
	const chunks = [];
	let size = 0;

	for await (const chunk of request) {
		size += chunk.length;
		if (size > maxUploadBytes) {
			throw new Error(`File is larger than ${maxUploadMb} MB`);
		}
		chunks.push(chunk);
	}

	return Buffer.concat(chunks);
}

function cleanObjectKey(value) {
	return value
		.replace(/^\/+/, '')
		.replace(/\\/g, '/')
		.replace(/\.\./g, '')
		.replace(/\/+/g, '/');
}

const server = createServer(async (request, response) => {
	try {
		const url = new URL(request.url, `http://${host}:${port}`);

		if (request.method === 'GET' && url.pathname === '/') {
			sendHtml(response);
			return;
		}

		if (request.method === 'POST' && url.pathname === '/upload') {
			const key = cleanObjectKey(url.searchParams.get('key') || '');
			if (!key) {
				sendJson(response, 400, { error: 'Missing upload key' });
				return;
			}

			const body = await readRequestBody(request);
			const result = await uploadBody({
				body,
				contentType: request.headers['x-file-type'] || 'application/octet-stream',
				env,
				objectKey: key,
				size: body.length,
			});

			sendJson(response, 200, result);
			return;
		}

		sendJson(response, 404, { error: 'Not found' });
	} catch (error) {
		sendJson(response, 500, { error: error.message });
	}
});

server.listen(port, host, () => {
	console.log(`CDN Studio ready: http://${host}:${port}`);
	console.log(`Max upload size: ${maxUploadMb} MB`);
});

