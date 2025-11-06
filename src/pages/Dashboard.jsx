import { useEffect, useState } from 'react'
import { getWeeklyKeywords } from '../shared/api/services/stats'

function Dashboard({ isDark = true }) {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [keywords, setKeywords] = useState([])

	useEffect(() => {
		let mounted = true
		;(async () => {
			setError('')
			setLoading(true)
			try {
				const data = await getWeeklyKeywords({ limit: 5 })
				if (mounted) setKeywords(Array.isArray(data) ? data : [])
			} catch (err) {
				if (mounted) setError(err?.message || '데이터 로드 실패')
			} finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => { mounted = false }
	}, [])

	const textColor = isDark ? '#f9fafb' : '#111827'
	const secondaryColor = isDark ? '#9ca3af' : '#6b7280'
	const errorColor = isDark ? '#ef4444' : '#b91c1c'

	return (
		<div style={{ padding: 24 }}>
			<h1 style={{ marginTop: 0, color: textColor }}>대시보드</h1>
			<div style={{ marginTop: 16 }}>
				<h2 style={{ margin: 0, fontSize: 18, color: textColor }}>이번 주 핫 키워드</h2>
				{loading && <p style={{ color: secondaryColor }}>불러오는 중...</p>}
				{error && !loading && <p style={{ color: errorColor }}>{error}</p>}
				{!loading && !error && (
					<ul style={{ paddingLeft: 18 }}>
						{keywords.map((k, idx) => (
							<li key={idx} style={{ color: textColor }}>
								<span>{k.keyword}</span>
								<span style={{ color: secondaryColor }}> — {k.count}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}

export default Dashboard


