import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NotionConnectButton from '../shared/NotionConnectButton.jsx';
import { getMe, ensureDatabase, createRow } from '../shared/api/services/notion.js';

function useQuery() {
	const { search } = useLocation();
	return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Integrations() {
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

	return (
		<div style={{ padding: 16, display: 'grid', gap: 12 }}>
			<h2>Integrations</h2>
			<section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
				<h3>Notion</h3>
				{justConnected && <div style={{ color: 'green' }}>Connected to Notion!</div>}
				{error && <div style={{ color: 'crimson' }}>{error}</div>}
				{loading ? (
					<div>Loading...</div>
				) : connected ? (
					<div style={{ display: 'grid', gap: 12 }}>
						<div>Status: Connected</div>
						{me && (
							<pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 6, overflow: 'auto' }}>
								{JSON.stringify(me, null, 2)}
							</pre>
						)}
/* removed Create Database section — server v0.4.0 handles top-level page automatically */

						<div style={{ display: 'grid', gap: 8, borderTop: '1px solid #eee', paddingTop: 12 }}>
							<h4>Ensure Database (create if missing)</h4>
							<input placeholder="Title (optional, default: App Database)" value={ensureReq.title} onChange={e => setEnsureReq(v => ({ ...v, title: e.target.value }))} />
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
							}}>{ensureLoading ? 'Ensuring...' : 'Ensure DB'}</button>
							{ensureResult && (
								<pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 6, overflow: 'auto' }}>{JSON.stringify(ensureResult, null, 2)}</pre>
							)}
						</div>

						<div style={{ display: 'grid', gap: 8, borderTop: '1px solid #eee', paddingTop: 12 }}>
							<h4>Create Row (Page)</h4>
							<input placeholder="Title" value={rowReq.title} onChange={e => setRowReq(v => ({ ...v, title: e.target.value }))} />
							<textarea placeholder="Content (optional, newline = new paragraph)" value={rowReq.content} onChange={e => setRowReq(v => ({ ...v, content: e.target.value }))} />
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
							}}>{rowLoading ? 'Creating...' : 'Create Row'}</button>
							{rowResult && (
								<pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 6, overflow: 'auto' }}>{JSON.stringify(rowResult, null, 2)}</pre>
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
						}}>
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


