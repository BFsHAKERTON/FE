import { useState } from 'react'

function TagHeatmapCalendar({ 
	hierarchicalTags, 
	tagFilter1, 
	setTagFilter1, 
	tagFilter2, 
	setTagFilter2,
	weeks,
	tagHeatmapData,
	maxCount,
	getHeatmapColor 
}) {
	const [hoveredDay, setHoveredDay] = useState(null)
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

	return (
		<div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
						계층적 태그 필터 히트맵 (최근 90일)
					</h2>
				</div>
				
				{/* Tag Filter Selectors */}
				<div className="flex flex-col sm:flex-row gap-3 mb-4">
					<div className="flex-1">
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
							태그 필터 1
						</label>
						<select 
							value={tagFilter1}
							onChange={(e) => setTagFilter1(e.target.value)}
							className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
						>
							{hierarchicalTags.map(tag => (
								<option key={tag} value={tag}>{tag}</option>
							))}
						</select>
					</div>
					
					<div className="flex items-end justify-center">
						<div className="px-3 py-2 text-gray-400 dark:text-gray-500 font-bold">
							{tagFilter1 !== '전체' && tagFilter2 !== '전체' ? 'AND' : 'OR'}
						</div>
					</div>
					
					<div className="flex-1">
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
							태그 필터 2
						</label>
						<select 
							value={tagFilter2}
							onChange={(e) => setTagFilter2(e.target.value)}
							className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
						>
							{hierarchicalTags.map(tag => (
								<option key={tag} value={tag}>{tag}</option>
							))}
						</select>
					</div>
				</div>
				
				{/* Filter Info */}
				<div className="flex items-center justify-between text-sm">
					<p className="text-gray-600 dark:text-gray-400">
						{tagFilter1 === '전체' && tagFilter2 === '전체' && '모든 상담 데이터'}
						{tagFilter1 !== '전체' && tagFilter2 === '전체' && (
							<><span className="font-semibold text-blue-600 dark:text-blue-400">{tagFilter1}</span> 태그 포함</>
						)}
						{tagFilter1 === '전체' && tagFilter2 !== '전체' && (
							<><span className="font-semibold text-purple-600 dark:text-purple-400">{tagFilter2}</span> 태그 포함</>
						)}
						{tagFilter1 !== '전체' && tagFilter2 !== '전체' && (
							<>
								<span className="font-semibold text-blue-600 dark:text-blue-400">{tagFilter1}</span>
								<span className="mx-1">AND</span>
								<span className="font-semibold text-purple-600 dark:text-purple-400">{tagFilter2}</span>
								<span className="ml-1">모두 포함</span>
							</>
						)}
					</p>
					<div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
						총 {Object.values(tagHeatmapData).reduce((sum, count) => sum + count, 0).toLocaleString()}건
					</div>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="overflow-x-auto relative">
				<div className="flex gap-1 min-w-max relative">
					{weeks.map((week, weekIdx) => (
						<div key={weekIdx} className="flex flex-col gap-1">
							{week.map((day, dayIdx) => (
								<div
									key={dayIdx}
									className={`w-4 h-4 rounded-sm ${getHeatmapColor(day.count, maxCount)} hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer relative`}
									onMouseEnter={(e) => {
										const rect = e.currentTarget.getBoundingClientRect()
										setHoveredDay({
											date: day.date,
											count: day.count,
											weekday: ['일', '월', '화', '수', '목', '금', '토'][new Date(day.date).getDay()]
										})
										setTooltipPosition({
											x: rect.left + rect.width / 2,
											y: rect.top - 10
										})
									}}
									onMouseLeave={() => setHoveredDay(null)}
								/>
							))}
						</div>
					))}
				</div>
				
				{/* Tooltip */}
				{hoveredDay && (
					<div
						className="fixed z-50 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-xl text-xs whitespace-nowrap pointer-events-none"
						style={{
							left: `${tooltipPosition.x}px`,
							top: `${tooltipPosition.y}px`,
							transform: 'translate(-50%, -100%)'
						}}
					>
						<div className="font-semibold">{hoveredDay.date} ({hoveredDay.weekday})</div>
						<div className="text-gray-300 dark:text-gray-400 mt-1">{hoveredDay.count}건의 상담</div>
					</div>
				)}
			</div>

			{/* Legend */}
			<div className="mt-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
				<span>모든 상담 데이터</span>
				<div className="flex items-center gap-1">
					<span>0%</span>
					<div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></div>
					<div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900"></div>
					<div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700"></div>
					<div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500"></div>
					<div className="w-3 h-3 rounded-sm bg-emerald-800 dark:bg-emerald-400"></div>
					<div className="w-3 h-3 rounded-sm bg-emerald-950 dark:bg-emerald-300"></div>
					<span>100%</span>
				</div>
			</div>
		</div>
	)
}

export default TagHeatmapCalendar
