const DEFAULT_CDN_URL = 'https://cdn.jocky.website';

const publicCdnUrl = import.meta.env.PUBLIC_CDN_URL || DEFAULT_CDN_URL;

export function cdnUrl(path: string): string {
	const cleanBase = publicCdnUrl.replace(/\/+$/, '');
	const cleanPath = path.replace(/^\/+/, '');

	return `${cleanBase}/${cleanPath}`;
}

