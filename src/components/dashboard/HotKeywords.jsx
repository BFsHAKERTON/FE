function HotKeywords({ keywords, loading, error }) {
	if (loading) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					주간 핫 키워드
				</h2>
				<div className="flex items-center justify-center h-48">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					주간 핫 키워드
				</h2>
				<div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
			<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
				주간 핫 키워드
			</h2>
			{keywords.length > 0 ? (
				<div className="space-y-3">
					{keywords.map((keyword, idx) => (
						<div key={idx} className="flex items-center gap-3">
							<div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
								idx === 0 ? 'bg-yellow-400 text-yellow-900' :
								idx === 1 ? 'bg-gray-300 text-gray-700' :
								idx === 2 ? 'bg-orange-300 text-orange-900' :
								'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
							}`}>
								{idx + 1}
							</div>
							<div className="flex-1">
								<div className="flex items-center justify-between mb-1">
									<span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
										{keyword.keyword}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{keyword.count}회
									</span>
								</div>
								<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
									<div
										className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all"
										style={{ width: `${(keyword.count / keywords[0]?.count) * 100}%` }}
									></div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
					키워드 데이터가 없습니다
				</div>
			)}
		</div>
	)
}

export default HotKeywords
