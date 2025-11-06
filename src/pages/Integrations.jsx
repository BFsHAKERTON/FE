import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NotionConnectButton from '../shared/NotionConnectButton.jsx';
import { getMe, ensureDatabase, createRow } from '../shared/api/services/notion.js';

function useQuery() {
	const { search } = useLocation();
	return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Integrations({ isDark = true }) {
	const [connected, setConnected] = useState(false);
	const [me, setMe] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [ensureReq, setEnsureReq] = useState({ title: '' });
	const [ensureResult, setEnsureResult] = useState(null);
	const [ensureLoading, setEnsureLoading] = useState(false);
	const [rowReq, setRowReq] = useState({ title: '', content: '' });
	const [rowResult, setRowResult] = useState(null);
	const [rowLoading, setRowLoading] = useState(false);
	const qs = useQuery();

	useEffect(() => {
		let ignore = false;
		async function init() {
			setLoading(true);
			setError('');
			try {
				const resp = await getMe();
				if (!ignore) {
					setConnected(true);
					setMe(resp?.me || null);
				}
			} catch (e) {
				if (!ignore) setError('Failed to check Notion status');
			} finally {
				if (!ignore) setLoading(false);
			}
		}
		init();
		return () => { ignore = true };
	}, []);

	const justConnected = qs.get('connected') === 'notion';

	const bgColor = isDark ? '#1f2937' : '#fff'
	const textColor = isDark ? '#f9fafb' : '#111827'
	const borderColor = isDark ? '#374151' : '#ddd'
	const secondaryColor = isDark ? '#9ca3af' : '#6b7280'
	const successColor = isDark ? '#10b981' : 'green'
	const errorColor = isDark ? '#ef4444' : 'crimson'
	const codeBg = isDark ? '#111827' : '#f7f7f7'
	const codeText = isDark ? '#f9fafb' : '#111827'
	const sectionBorder = isDark ? '#4b5563' : '#eee'

	return (
		<div style={{ padding: 16, display: 'grid', gap: 12 }}>
			<h2 style={{ color: textColor }}>Integrations</h2>
			<section style={{ border: `1px solid ${borderColor}`, borderRadius: 8, padding: 16, background: bgColor }}>
				<h3 style={{ color: textColor }}>Notion</h3>
				{justConnected && <div style={{ color: successColor }}>Connected to Notion!</div>}
				{error && <div style={{ color: errorColor }}>{error}</div>}
				{loading ? (
					<div style={{ color: textColor }}>Loading...</div>
				) : connected ? (
					<div style={{ display: 'grid', gap: 12 }}>
						<div style={{ color: textColor }}>Status: Connected</div>
						{me && (
							<pre style={{ background: codeBg, color: codeText, padding: 12, borderRadius: 6, overflow: 'auto' }}>
								{JSON.stringify(me, null, 2)}
							</pre>
						)}
/* removed Create Database section — server v0.4.0 handles top-level page automatically */

						<div style={{ display: 'grid', gap: 8, borderTop: `1px solid ${sectionBorder}`, paddingTop: 12 }}>
							<h4 style={{ color: textColor }}>Ensure Database (create if missing)</h4>
							<input placeholder="Title (optional, default: App Database)" value={ensureReq.title} onChange={e => setEnsureReq(v => ({ ...v, title: e.target.value }))} style={{ padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 6, background: isDark ? '#374151' : '#fff', color: textColor }} />
							<button disabled={ensureLoading} onClick={async () => {
								setEnsureLoading(true);
								setEnsureResult(null);
								try {
									const res = await ensureDatabase(ensureReq.title ? { title: ensureReq.title } : undefined);
									setEnsureResult(res);
								} catch (e) {
									setEnsureResult({ error: e?.message || 'Failed' });
								} finally {
									setEnsureLoading(false);
								}
							}} style={{ padding: '8px 12px', border: '1px solid #111827', background: '#111827', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>{ensureLoading ? 'Ensuring...' : 'Ensure DB'}</button>
							{ensureResult && (
								<pre style={{ background: codeBg, color: codeText, padding: 12, borderRadius: 6, overflow: 'auto' }}>{JSON.stringify(ensureResult, null, 2)}</pre>
							)}
						</div>

						<div style={{ display: 'grid', gap: 8, borderTop: `1px solid ${sectionBorder}`, paddingTop: 12 }}>
							<h4 style={{ color: textColor }}>Create Row (Page)</h4>
							<input placeholder="Title" value={rowReq.title} onChange={e => setRowReq(v => ({ ...v, title: e.target.value }))} style={{ padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 6, background: isDark ? '#374151' : '#fff', color: textColor }} />
							<textarea placeholder="Content (optional, newline = new paragraph)" value={rowReq.content} onChange={e => setRowReq(v => ({ ...v, content: e.target.value }))} style={{ padding: '8px 12px', border: `1px solid ${borderColor}`, borderRadius: 6, background: isDark ? '#374151' : '#fff', color: textColor }} />
							<button disabled={rowLoading} onClick={async () => {
								setRowLoading(true);
								setRowResult(null);
								try {
									const res = await createRow({ title: rowReq.title, content: rowReq.content });
									setRowResult(res);
								} catch (e) {
									setRowResult({ error: e?.message || 'Failed' });
								} finally {
									setRowLoading(false);
								}
							}} style={{ padding: '8px 12px', border: '1px solid #111827', background: '#111827', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>{rowLoading ? 'Creating...' : 'Create Row'}</button>
							{rowResult && (
								<pre style={{ background: codeBg, color: codeText, padding: 12, borderRadius: 6, overflow: 'auto' }}>{JSON.stringify(rowResult, null, 2)}</pre>
							)}
						</div>

						{/* removed Append Content section per server v0.4.0 */}

						<button onClick={async () => {
							setLoading(true);
							try {
								const resp = await getMe();
								setConnected(true);
								setMe(resp?.me || null);
							} catch {
								setError('Failed to refresh Notion info');
							} finally {
								setLoading(false);
							}
						}} style={{ padding: '8px 12px', border: '1px solid #111827', background: '#111827', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>
							Refresh
						</button>
					</div>
				) : (
					<NotionConnectButton />
				)}
			</section>
		</div>
	);
}


