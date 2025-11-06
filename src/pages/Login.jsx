import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startKakaoLogin, mockLogin } from '../shared/api/services/auth'

function Login() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			// TODO: 실제 로그인 API 연결 시 여기서 호출
			await new Promise((r) => setTimeout(r, 600))
			navigate('/dashboard')
		} catch (err) {
			setError(err?.message || '로그인에 실패했습니다')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
			<form onSubmit={onSubmit} style={{ width: '100%', maxWidth: 380, border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
				<h1 style={{ margin: 0, fontSize: 22 }}>로그인</h1>
				<p style={{ margin: 0, color: '#6b7280' }}>이메일과 비밀번호를 입력하세요.</p>
				<label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
					<span style={{ fontSize: 13, color: '#374151' }}>이메일</span>
					<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
				</label>
				<label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
					<span style={{ fontSize: 13, color: '#374151' }}>비밀번호</span>
					<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 }} />
				</label>
				{error ? <div style={{ color: '#b91c1c', fontSize: 13 }}>{error}</div> : null}
				<button type="submit" disabled={loading} style={{ padding: '10px 12px', border: '1px solid #111827', background: '#111827', color: '#fff', borderRadius: 8, cursor: 'pointer' }}>{loading ? '로그인 중...' : '로그인'}</button>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<div style={{ height: 1, background: '#e5e7eb', flex: 1 }} />
					<span style={{ color: '#9ca3af', fontSize: 12 }}>또는</span>
					<div style={{ height: 1, background: '#e5e7eb', flex: 1 }} />
				</div>
				{true ? (
					<button
						type="button"
						onClick={async () => {
							setError('')
							setLoading(true)
							try {
								const data = await mockLogin({ email, password })
								try { localStorage.setItem('accessToken', data.accessToken); localStorage.setItem('refreshToken', data.refreshToken) } catch {}
								navigate('/dashboard')
							} catch (err) {
								setError(err?.message || 'Mock 로그인 실패')
							} finally {
								setLoading(false)
							}
						}}
						style={{ padding: '10px 12px', border: '1px solid #10B981', background: '#10B981', color: '#fff', borderRadius: 8, cursor: 'pointer' }}
					>
						Mock 로그인 (개발)
					</button>
				) : null}
				<button
					type="button"
					onClick={() => startKakaoLogin(`${window.location.origin}/dashboard`)}
					style={{ padding: '10px 12px', border: '1px solid #F7E600', background: '#F7E600', color: '#111827', borderRadius: 8, cursor: 'pointer' }}
				>
					카카오로 로그인
				</button>
				<button type="button" onClick={() => navigate('/')} style={{ padding: '10px 12px', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#111827', borderRadius: 8, cursor: 'pointer' }}>홈으로</button>
			</form>
		</div>
	)
}

export default Login


