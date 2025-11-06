export default function Signup({ isDark = true }) {
	return (
		<div className={`min-h-screen grid place-items-center p-6 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
			<div className={`w-full max-w-sm border rounded-xl p-5 flex flex-col gap-3 ${isDark ? 'bg-gray-700 border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'}`}>
				<h1 className={`m-0 text-xl ${isDark ? 'text-gray-50' : 'text-gray-900'}`}>회원가입</h1>
				<p className={`m-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>회원가입 페이지입니다.</p>
			</div>
		</div>
	)
}

