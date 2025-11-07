function KPICards({ kpiData }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			{/* Total Inquiries */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">총 상담 건수</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
							{kpiData.totalInquiries.toLocaleString()}
						</p>
					</div>
					<div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
						<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
						</svg>
					</div>
				</div>
			</div>

			{/* Avg Response Time */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">평균 응답 시간</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
							{Math.floor(kpiData.avgResponseTime / 60)}분 {kpiData.avgResponseTime % 60}초
						</p>
					</div>
					<div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
						<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
			</div>

			{/* Avg CSAT */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">평균 만족도</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
							{kpiData.avgCSAT.toFixed(1)} / 5.0
						</p>
					</div>
					<div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
						<svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
						</svg>
					</div>
				</div>
			</div>

			{/* Completion Rate */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400 font-medium">완료율</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
							{kpiData.completionRate}%
						</p>
					</div>
					<div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
						<svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	)
}

export default KPICards
