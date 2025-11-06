import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startKakaoLogin, mockLogin } from '../shared/api/services/auth'
import landpageBackground from '../assets/landpageBackground.png'

function Login({ isDark = true }) {
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
		<div className="min-h-screen grid place-items-center p-6 relative overflow-hidden">
			{/* 배경 이미지 레이어 */}
			<div
				className="fixed inset-0"
				style={{
					backgroundImage: `url(${landpageBackground})`,
					backgroundSize: "cover",
					backgroundPosition: "center 30%",
					backgroundRepeat: "no-repeat",
					filter: "blur(60px)",
					transform: "scale(1.1)",
					opacity: isDark ? 0.2 : 0.4,
					zIndex: -2,
				}}
			/>
			{/* 어두운 오버레이 레이어 */}
			<div
				className="fixed inset-0"
				style={{
					backgroundColor: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.1)",
					zIndex: -1,
				}}
			/>
			<form onSubmit={onSubmit} className={`relative z-10 w-full max-w-sm border rounded-xl p-5 flex flex-col gap-3 ${isDark ? 'bg-gray-700 border-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'}`}>
				<h1 className={`m-0 text-xl ${isDark ? 'text-gray-50' : 'text-gray-900'}`}>로그인</h1>
				<p className={`m-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>이메일과 비밀번호를 입력하세요.</p>
				<label className="flex flex-col gap-1.5">
					<span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>이메일</span>
					<input 
						value={email} 
						onChange={(e) => setEmail(e.target.value)} 
						type="email" 
						placeholder="you@example.com" 
						required 
						className={`px-3 py-2.5 border rounded-lg ${isDark ? 'bg-gray-600 border-gray-500 text-gray-50' : 'bg-white border-gray-300 text-gray-900'}`}
					/>
				</label>
				<label className="flex flex-col gap-1.5">
					<span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>비밀번호</span>
					<input 
						value={password} 
						onChange={(e) => setPassword(e.target.value)} 
						type="password" 
						placeholder="••••••••" 
						required 
						className={`px-3 py-2.5 border rounded-lg ${isDark ? 'bg-gray-600 border-gray-500 text-gray-50' : 'bg-white border-gray-300 text-gray-900'}`}
					/>
				</label>
				{error ? <div className="text-red-500 text-xs">{error}</div> : null}
				<button type="submit" disabled={loading} className="px-3 py-2.5 border border-gray-900 bg-gray-900 text-white rounded-lg cursor-pointer disabled:opacity-50">
					{loading ? '로그인 중...' : '로그인'}
				</button>
				<div className="flex items-center gap-2">
					<div className={`h-px flex-1 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
					<span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>또는</span>
					<div className={`h-px flex-1 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
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
						className="px-3 py-2.5 border border-emerald-500 bg-emerald-500 text-white rounded-lg cursor-pointer"
					>
						Mock 로그인 (개발)
					</button>
				) : null}
				<button
					type="button"
					onClick={() => startKakaoLogin(`${window.location.origin}/dashboard`)}
					className="px-3 py-2.5 border border-yellow-400 bg-yellow-400 text-gray-900 rounded-lg cursor-pointer"
				>
					카카오로 로그인
				</button>
				<button 
					type="button" 
					onClick={() => navigate('/')} 
					className={`px-3 py-2.5 border rounded-lg cursor-pointer ${isDark ? 'bg-gray-600 border-gray-600 text-gray-50' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
				>
					홈으로
				</button>
			</form>
		</div>
	)
}

export default Login


