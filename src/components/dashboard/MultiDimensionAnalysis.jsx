function MultiDimensionAnalysis({
	availableDimensions,
	dimension1,
	setDimension1,
	dimension2,
	setDimension2,
	dimension3,
	setDimension3,
	visualizationType,
	setVisualizationType,
	getCurrentDimensionData
}) {
	const dimensionData = getCurrentDimensionData()

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
			<div className="mb-6">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					다차원 분석 (최대 3차원, GA4 스타일)
				</h2>
				
				{/* Dimension Selectors - 3D */}
				<div className="space-y-3 mb-4">
					<div className="flex items-center gap-2">
						<label className="text-sm text-gray-600 dark:text-gray-400 w-16">차원 1:</label>
						<select 
							value={dimension1}
							onChange={(e) => setDimension1(e.target.value)}
							className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						>
							{availableDimensions.map(dim => (
								<option key={dim} value={dim}>{dim}</option>
							))}
						</select>
					</div>
					
					<div className="flex items-center gap-2">
						<label className="text-sm text-gray-600 dark:text-gray-400 w-16">차원 2:</label>
						<select 
							value={dimension2}
							onChange={(e) => setDimension2(e.target.value)}
							className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						>
							{availableDimensions.filter(d => d !== dimension1).map(dim => (
								<option key={dim} value={dim}>{dim}</option>
							))}
						</select>
					</div>
					
					<div className="flex items-center gap-2">
						<label className="text-sm text-gray-600 dark:text-gray-400 w-16">차원 3:</label>
						<select 
							value={dimension3}
							onChange={(e) => setDimension3(e.target.value)}
							className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
						>
							<option value="없음">없음 (2차원)</option>
							{availableDimensions.filter(d => d !== dimension1 && d !== dimension2).map(dim => (
								<option key={dim} value={dim}>{dim}</option>
							))}
						</select>
					</div>
				</div>
				
				{/* Visualization Type Selector (GA4 스타일) */}
				<div className="flex items-center gap-3 mb-4">
					<label className="text-sm text-gray-600 dark:text-gray-400">시각화:</label>
					<div className="flex gap-2">
						<button
							onClick={() => setVisualizationType('막대그래프')}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
								visualizationType === '막대그래프'
									? 'bg-blue-600 text-white shadow-md'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
							}`}
						>
							📊 막대그래프
						</button>
						<button
							onClick={() => setVisualizationType('히트맵')}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
								visualizationType === '히트맵'
									? 'bg-blue-600 text-white shadow-md'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
							}`}
						>
							🔥 히트맵
						</button>
						<button
							onClick={() => setVisualizationType('표')}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
								visualizationType === '표'
									? 'bg-blue-600 text-white shadow-md'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
							}`}
						>
							📋 표
						</button>
					</div>
				</div>
				
				{/* Info */}
				<div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
					{dimension3 === '없음' 
						? `2차원 분석: ${dimension1} × ${dimension2}`
						: `3차원 분석: ${dimension1} × ${dimension2} × ${dimension3} (중첩 구조)`
					}
					{dimensionData.length > 0 && (
						<span className="ml-2 font-semibold">
							· 총 {dimensionData.reduce((sum, item) => sum + item.total, 0)} 건
						</span>
					)}
				</div>
			</div>
			
			{/* Data Display - 시각화 타입별 렌더링 (GA4 스타일) */}
			{dimensionData.length > 0 ? (
				<div className="space-y-4">
					{visualizationType === '막대그래프' && dimensionData.map((item, idx) => (
						<div key={idx} className="space-y-3">
							<div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
								<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.dimension1Value}</span>
								<span className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.total}</span>
							</div>
							<div className="space-y-2 pl-2">
								{Object.entries(item.breakdown).sort((a, b) => b[1] - a[1]).map(([key, count], tagIdx) => {
									const percentage = (count / item.total) * 100
									return (
										<div key={tagIdx}>
											<div className="flex items-center gap-2">
												<span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate">{key}</span>
												<div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
													<div className="bg-linear-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
												</div>
												<span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">{count}</span>
												<span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">{percentage.toFixed(1)}%</span>
											</div>
											{dimension3 !== '없음' && item.dimension3Breakdown && (
												<div className="ml-8 mt-1 space-y-1">
													{item.dimension3Breakdown.map((d3, d3Idx) => (
														<div key={d3Idx} className="flex items-center gap-2 text-xs">
															<span className="text-gray-500 w-20 truncate">↳ {d3.value}</span>
															<div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1">
																<div className="bg-blue-400 h-1 rounded-full" style={{ width: `${(d3.count / count) * 100}%` }} />
															</div>
															<span className="text-gray-600 dark:text-gray-400 w-8 text-right">{d3.count}</span>
														</div>
													))}
												</div>
											)}
										</div>
									)
								})}
							</div>
						</div>
					))}
					
					{visualizationType === '히트맵' && dimensionData.map((item, idx) => {
						const maxValue = Math.max(...Object.values(item.breakdown))
						return (
							<div key={idx} className="space-y-2">
								<div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.dimension1Value}</div>
								<div className="grid grid-cols-4 gap-2">
									{Object.entries(item.breakdown).sort((a, b) => b[1] - a[1]).map(([key, count], tagIdx) => {
										const intensity = (count / maxValue) * 100
										return (
											<div
												key={tagIdx}
												className="relative p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
												style={{
													backgroundColor: `rgba(16, 185, 129, ${intensity / 100 * 0.8})`
												}}
											>
												<div className="text-xs font-medium text-gray-900 dark:text-white truncate">{key}</div>
												<div className="text-lg font-bold text-gray-900 dark:text-white mt-1">{count}</div>
												<div className="text-xs text-gray-700 dark:text-gray-200">{((count / item.total) * 100).toFixed(1)}%</div>
											</div>
										)
									})}
								</div>
							</div>
						)
					})}
					
					{visualizationType === '표' && (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="bg-gray-50 dark:bg-gray-700">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											{dimension1}
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											{dimension2}
										</th>
										{dimension3 !== '없음' && (
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
												{dimension3}
											</th>
										)}
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											건수
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											비율
										</th>
									</tr>
								</thead>
								<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
									{dimensionData.map((item, idx) => (
										Object.entries(item.breakdown).sort((a, b) => b[1] - a[1]).map(([key, count], tagIdx) => (
											<tr key={`${idx}-${tagIdx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
												<td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
													{item.dimension1Value}
												</td>
												<td className="px-4 py-3 text-gray-700 dark:text-gray-300">
													{key}
												</td>
												{dimension3 !== '없음' && (
													<td className="px-4 py-3 text-gray-600 dark:text-gray-400">
														-
													</td>
												)}
												<td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
													{count}
												</td>
												<td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
													{((count / item.total) * 100).toFixed(1)}%
												</td>
											</tr>
										))
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			) : (
				<div className="text-center py-12 text-gray-500 dark:text-gray-400">
					선택한 차원 조합에 대한 데이터가 없습니다.
				</div>
			)}
		</div>
	)
}

export default MultiDimensionAnalysis
