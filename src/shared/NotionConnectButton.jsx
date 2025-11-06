import { getNotionAuthUrl } from './api/services/notion.js';

export default function NotionConnectButton() {
	const redirect = typeof window !== 'undefined' ? `${window.location.origin}/integrations?connected=notion` : undefined;
	const href = getNotionAuthUrl(redirect);
	return (
		<a href={href} style={{
			display: 'inline-block',
			padding: '8px 12px',
			borderRadius: 6,
			background: '#000',
			color: '#fff',
			textDecoration: 'none'
		}}>
			Connect Notion
		</a>
	);
}


