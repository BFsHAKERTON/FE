import { useEffect, useState } from 'react'
import { getWeeklyKeywords } from '../shared/api/services/stats'

function Dashboard() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [keywords, setKeywords] = useState([])
	const [selectedTag, setSelectedTag] = useState('전체')
	
	// 더미 데이터 (실제로는 API에서 가져올 데이터)
	const [kpiData] = useState({
		totalInquiries: 1234,
		avgResponseTime: 145, // seconds
		avgCSAT: 4.7,
		completionRate: 89.5
	})

	// 태그별 히트맵 데이터 (최근 90일)
	const [heatmapData, setHeatmapData] = useState([])
	
	// 유입 페이지 x 태그 결합 데이터
	const [referrerTagData] = useState([
		{ 
			page: '/products/shoes',
			total: 342,
			tags: {
				'반품 및 교환': 142,
				'상담': 98,
				'사이즈': 67,
				'색상': 35
			}
		},
		{ 
			page: '/cart',
			total: 289,
			tags: {
				'결제': 128,
				'구매': 89,
				'배송': 52,
				'쿠폰': 20
			}
		},
		{ 
			page: '/products/bags',
			total: 198,
			tags: {
				'상담': 87,
				'재입고': 54,
				'반품 및 교환': 38,
				'가격': 19
			}
		},
		{ 
			page: '/my-page',
			total: 156,
			tags: {
				'회원': 78,
				'포인트': 43,
				'등급': 25,
				'정보수정': 10
			}
		},
		{ 
			page: '/orders',
			total: 123,
			tags: {
				'배송': 67,
				'취소': 34,
				'교환': 15,
				'영수증': 7
			}
		}
	])

	// 태그별 트렌드 데이터 (최근 7일)
	const [tagTrendData] = useState({
		'반품 및 교환': [45, 52, 48, 61, 58, 73, 68],
		'구매': [38, 42, 35, 44, 51, 47, 49],
		'상담': [62, 58, 65, 59, 72, 68, 71],
		'배송': [28, 31, 35, 29, 38, 42, 40],
		'결제': [22, 25, 19, 27, 24, 29, 31]
	})

	useEffect(() => {
		let mounted = true
		;(async () => {
			setError('')
			setLoading(true)
			try {
				const data = await getWeeklyKeywords({ limit: 10 })
				if (mounted) setKeywords(Array.isArray(data) ? data : [])
				
				// 히트맵 데이터 생성 (최근 90일)
				generateHeatmapData()
			} catch (err) {
				if (mounted) setError(err?.message || '데이터 로드 실패')
			} finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => { mounted = false }
	}, [])

	const generateHeatmapData = () => {
		const data = []
		const today = new Date()
		const tags = ['반품 및 교환', '구매', '상담', '배송', '결제']
		
		for (let i = 89; i >= 0; i--) {
			const date = new Date(today)
			date.setDate(date.getDate() - i)
			
			tags.forEach(tag => {
				// 랜덤하게 데이터 생성 (주말에는 적게)
				const isWeekend = date.getDay() === 0 || date.getDay() === 6
				const baseCount = isWeekend ? Math.random() * 30 : Math.random() * 80
				
				data.push({
					date: date.toISOString().split('T')[0],
					tag,
					count: Math.floor(baseCount)
				})
			})
		}
		setHeatmapData(data)
	}

	const getHeatmapColor = (count) => {
		if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
		if (count < 20) return 'bg-emerald-200 dark:bg-emerald-900'
		if (count < 40) return 'bg-emerald-400 dark:bg-emerald-700'
		if (count < 60) return 'bg-emerald-600 dark:bg-emerald-500'
		return 'bg-emerald-800 dark:bg-emerald-300'
	}

	// 날짜별로 선택된 태그의 데이터만 필터링
	const filteredHeatmapData = heatmapData.filter(d => 
		selectedTag === '전체' || d.tag === selectedTag
	)

	// 날짜별로 그룹화 (같은 날짜의 모든 태그 합산)
	const groupedByDate = filteredHeatmapData.reduce((acc, item) => {
		if (!acc[item.date]) acc[item.date] = 0
		acc[item.date] += item.count
		return acc
	}, {})

	// 주차별로 그룹화
	const getWeekNumber = (dateStr) => {
		const date = new Date(dateStr)
		const firstDay = new Date(date.getFullYear(), 0, 1)
		const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000))
		return Math.ceil(days / 7)
	}

	const weeks = []
	const today = new Date()
	for (let i = 12; i >= 0; i--) {
		const weekDays = []
		for (let j = 6; j >= 0; j--) {
			const date = new Date(today)
			date.setDate(date.getDate() - (i * 7 + j))
			const dateStr = date.toISOString().split('T')[0]
			weekDays.push({
				date: dateStr,
				count: groupedByDate[dateStr] || 0,
				day: date.getDay()
			})
		}
		weeks.push(weekDays)
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					📊 Relay Tok 대시보드
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">
					채널톡 상담 데이터 통합 분석
				</p>
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				{/* Tag Heatmap Calendar */}
				<div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
							🏷️ 태그별 활동 히트맵 (최근 90일)
						</h2>
						<select 
							value={selectedTag}
							onChange={(e) => setSelectedTag(e.target.value)}
							className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option>전체</option>
							<option>반품 및 교환</option>
							<option>구매</option>
							<option>상담</option>
							<option>배송</option>
							<option>결제</option>
						</select>
					</div>

					{/* Calendar Grid */}
					<div className="overflow-x-auto">
						<div className="flex gap-1 min-w-max">
							{weeks.map((week, weekIdx) => (
								<div key={weekIdx} className="flex flex-col gap-1">
									{week.map((day, dayIdx) => (
										<div
											key={dayIdx}
											className={`w-4 h-4 rounded-sm ${getHeatmapColor(day.count)} hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer`}
											title={`${day.date}: ${day.count}건`}
										/>
									))}
								</div>
							))}
						</div>
						
						{/* Legend */}
						<div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
							<span>적음</span>
							<div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
							<div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-900 rounded-sm"></div>
							<div className="w-4 h-4 bg-emerald-400 dark:bg-emerald-700 rounded-sm"></div>
							<div className="w-4 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-sm"></div>
							<div className="w-4 h-4 bg-emerald-800 dark:bg-emerald-300 rounded-sm"></div>
							<span>많음</span>
						</div>
					</div>
				</div>

				{/* Referrer Pages x Tags */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
					<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
						🔗 유입 페이지 × 태그 분석
					</h2>
					<div className="space-y-6">
						{referrerTagData.map((ref, idx) => (
							<div key={idx} className="space-y-3">
								{/* 페이지 헤더 */}
								<div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={ref.page}>
										{ref.page}
									</span>
									<span className="text-lg font-bold text-blue-600 dark:text-blue-400 ml-2">
										{ref.total}
									</span>
								</div>
								
								{/* 태그별 분포 */}
								<div className="space-y-2 pl-2">
									{Object.entries(ref.tags)
										.sort((a, b) => b[1] - a[1])
										.map(([tag, count], tagIdx) => {
											const percentage = (count / ref.total) * 100
											return (
												<div key={tagIdx} className="flex items-center gap-2">
													<span className="text-xs text-gray-600 dark:text-gray-400 w-20 truncate" title={tag}>
														{tag}
													</span>
													<div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
														<div 
															className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full transition-all"
															style={{ width: `${percentage}%` }}
														/>
													</div>
													<span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-8 text-right">
														{count}
													</span>
												</div>
											)
										})}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Tag Trends */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
					📈 태그별 트렌드 (최근 7일)
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
					{Object.entries(tagTrendData).map(([tag, data]) => (
						<div key={tag} className="space-y-4">
							<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
								{tag}
							</h3>
							<div className="flex items-end gap-1 h-32">
								{data.map((value, idx) => (
									<div key={idx} className="flex-1 flex flex-col items-center gap-1">
										<div 
											className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-colors"
											style={{ height: `${(value / Math.max(...data)) * 100}%` }}
											title={`${value}건`}
										/>
										<span className="text-xs text-gray-500 dark:text-gray-400">
											{['월', '화', '수', '목', '금', '토', '일'][idx]}
										</span>
									</div>
								))}
							</div>
							<div className="text-center">
								<span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									{data.reduce((a, b) => a + b, 0)}
								</span>
								<span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
									건
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Hot Keywords */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
					🔥 이번 주 핫 키워드
				</h2>
				{loading && (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					</div>
				)}
				{error && !loading && (
					<p className="text-red-600 dark:text-red-400 text-center py-8">{error}</p>
				)}
				{!loading && !error && (
					<div className="flex flex-wrap gap-3">
						{keywords.map((k, idx) => (
							<div 
								key={idx}
								className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:shadow-md transition-shadow"
							>
								<span className="text-gray-900 dark:text-gray-100 font-medium">
									{k.keyword}
								</span>
								<span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
									{k.count}회
								</span>
							</div>
						))}
					</div>
				)}
			</div>

			{/* KPI Cards (Less Important - Bottom) */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
				<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
					📈 부가 지표
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">총 상담 건수</p>
						<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{kpiData.totalInquiries.toLocaleString()}
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">평균 응답 시간</p>
						<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{Math.floor(kpiData.avgResponseTime / 60)}m {kpiData.avgResponseTime % 60}s
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">평균 CSAT</p>
						<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{kpiData.avgCSAT.toFixed(1)} ⭐
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">상담 완료율</p>
						<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{kpiData.completionRate}%
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard


