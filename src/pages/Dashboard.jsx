import { useEffect, useState } from 'react'
import { getWeeklyKeywords } from '../shared/api/services/stats'

function Dashboard() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [keywords, setKeywords] = useState([])
	const [selectedTag, setSelectedTag] = useState('전체')
	const [hoveredDay, setHoveredDay] = useState(null)
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
	
	// 다차원 분석을 위한 차원(Dimension) 선택
	const [dimension1, setDimension1] = useState('유입페이지')
	const [dimension2, setDimension2] = useState('상담태그')
	
	// 사용 가능한 차원들
	const availableDimensions = [
		'유입페이지',
		'상담태그',
		'시간대',
		'요일',
		'담당자',
		'고객등급',
		'상담상태'
	]
	
	// 더미 데이터 (실제로는 API에서 가져올 데이터)
	const [kpiData] = useState({
		totalInquiries: 1234,
		avgResponseTime: 145, // seconds
		avgCSAT: 4.7,
		completionRate: 89.5
	})

	// 태그별 히트맵 데이터 (최근 90일)
	const [heatmapData, setHeatmapData] = useState([])
	
	// 다차원 히트맵 데이터 저장소 (날짜별 조합 데이터)
	const [dimensionalHeatmapData] = useState({})
	
	// 다차원 데이터 저장소 (모든 조합 가능한 데이터)
	const [multiDimensionalData] = useState({
		// 유입페이지 × 상담태그
		'유입페이지-상담태그': [
			{ 
				dimension1Value: '/products/shoes',
				total: 342,
				breakdown: {
					'반품 및 교환': 142,
					'상담': 98,
					'사이즈': 67,
					'색상': 35
				}
			},
			{ 
				dimension1Value: '/cart',
				total: 289,
				breakdown: {
					'결제': 128,
					'구매': 89,
					'배송': 52,
					'쿠폰': 20
				}
			},
			{ 
				dimension1Value: '/products/bags',
				total: 198,
				breakdown: {
					'상담': 87,
					'재입고': 54,
					'반품 및 교환': 38,
					'가격': 19
				}
			},
			{ 
				dimension1Value: '/my-page',
				total: 156,
				breakdown: {
					'회원': 78,
					'포인트': 43,
					'등급': 25,
					'정보수정': 10
				}
			},
			{ 
				dimension1Value: '/orders',
				total: 123,
				breakdown: {
					'배송': 67,
					'취소': 34,
					'교환': 15,
					'영수증': 7
				}
			}
		],
		
		// 시간대 × 상담태그
		'시간대-상담태그': [
			{
				dimension1Value: '09-11시',
				total: 234,
				breakdown: {
					'구매': 89,
					'상담': 67,
					'배송': 45,
					'반품 및 교환': 33
				}
			},
			{
				dimension1Value: '11-13시',
				total: 198,
				breakdown: {
					'결제': 78,
					'배송': 56,
					'상담': 42,
					'구매': 22
				}
			},
			{
				dimension1Value: '13-15시',
				total: 267,
				breakdown: {
					'반품 및 교환': 112,
					'상담': 78,
					'배송': 54,
					'사이즈': 23
				}
			},
			{
				dimension1Value: '15-17시',
				total: 312,
				breakdown: {
					'상담': 134,
					'구매': 87,
					'결제': 61,
					'배송': 30
				}
			},
			{
				dimension1Value: '17-19시',
				total: 223,
				breakdown: {
					'배송': 98,
					'상담': 67,
					'취소': 38,
					'환불': 20
				}
			}
		],
		
		// 요일 × 상담태그
		'요일-상담태그': [
			{
				dimension1Value: '월요일',
				total: 189,
				breakdown: {
					'배송': 87,
					'상담': 54,
					'취소': 32,
					'환불': 16
				}
			},
			{
				dimension1Value: '화요일',
				total: 234,
				breakdown: {
					'구매': 98,
					'상담': 76,
					'결제': 43,
					'배송': 17
				}
			},
			{
				dimension1Value: '수요일',
				total: 267,
				breakdown: {
					'상담': 112,
					'반품 및 교환': 89,
					'사이즈': 44,
					'색상': 22
				}
			},
			{
				dimension1Value: '목요일',
				total: 298,
				breakdown: {
					'구매': 134,
					'결제': 87,
					'상담': 56,
					'배송': 21
				}
			},
			{
				dimension1Value: '금요일',
				total: 312,
				breakdown: {
					'결제': 156,
					'구매': 89,
					'배송': 47,
					'상담': 20
				}
			},
			{
				dimension1Value: '토요일',
				total: 156,
				breakdown: {
					'상담': 67,
					'구매': 54,
					'반품 및 교환': 25,
					'배송': 10
				}
			},
			{
				dimension1Value: '일요일',
				total: 123,
				breakdown: {
					'상담': 56,
					'구매': 38,
					'배송': 20,
					'기타': 9
				}
			}
		],
		
		// 담당자 × 상담태그
		'담당자-상담태그': [
			{
				dimension1Value: '김민수',
				total: 287,
				breakdown: {
					'상담': 123,
					'구매': 89,
					'배송': 54,
					'반품 및 교환': 21
				}
			},
			{
				dimension1Value: '이지은',
				total: 312,
				breakdown: {
					'반품 및 교환': 145,
					'상담': 98,
					'사이즈': 47,
					'색상': 22
				}
			},
			{
				dimension1Value: '박준호',
				total: 234,
				breakdown: {
					'결제': 112,
					'구매': 76,
					'쿠폰': 32,
					'환불': 14
				}
			},
			{
				dimension1Value: '최서연',
				total: 267,
				breakdown: {
					'배송': 134,
					'취소': 78,
					'교환': 38,
					'환불': 17
				}
			},
			{
				dimension1Value: '정우진',
				total: 198,
				breakdown: {
					'상담': 98,
					'회원': 56,
					'포인트': 32,
					'등급': 12
				}
			}
		],
		
		// 고객등급 × 상담태그
		'고객등급-상담태그': [
			{
				dimension1Value: 'VIP',
				total: 234,
				breakdown: {
					'상담': 112,
					'구매': 78,
					'배송': 32,
					'포인트': 12
				}
			},
			{
				dimension1Value: 'GOLD',
				total: 312,
				breakdown: {
					'구매': 145,
					'상담': 98,
					'결제': 47,
					'배송': 22
				}
			},
			{
				dimension1Value: 'SILVER',
				total: 398,
				breakdown: {
					'상담': 178,
					'반품 및 교환': 112,
					'배송': 76,
					'구매': 32
				}
			},
			{
				dimension1Value: '일반',
				total: 456,
				breakdown: {
					'상담': 198,
					'배송': 134,
					'반품 및 교환': 89,
					'결제': 35
				}
			}
		],
		
		// 상담상태 × 상담태그
		'상담상태-상담태그': [
			{
				dimension1Value: '진행중',
				total: 156,
				breakdown: {
					'상담': 78,
					'구매': 43,
					'배송': 25,
					'결제': 10
				}
			},
			{
				dimension1Value: '대기중',
				total: 89,
				breakdown: {
					'긴급': 45,
					'상담': 28,
					'배송': 12,
					'기타': 4
				}
			},
			{
				dimension1Value: '완료',
				total: 892,
				breakdown: {
					'상담': 312,
					'구매': 234,
					'배송': 198,
					'반품 및 교환': 148
				}
			},
			{
				dimension1Value: '보류',
				total: 67,
				breakdown: {
					'복잡한 문의': 34,
					'상담': 18,
					'반품 및 교환': 10,
					'기타': 5
				}
			}
		],
		
		// 유입페이지 × 시간대
		'유입페이지-시간대': [
			{
				dimension1Value: '/products/shoes',
				total: 342,
				breakdown: {
					'09-11시': 45,
					'11-13시': 67,
					'13-15시': 98,
					'15-17시': 89,
					'17-19시': 43
				}
			},
			{
				dimension1Value: '/cart',
				total: 289,
				breakdown: {
					'09-11시': 34,
					'11-13시': 78,
					'13-15시': 67,
					'15-17시': 76,
					'17-19시': 34
				}
			},
			{
				dimension1Value: '/products/bags',
				total: 198,
				breakdown: {
					'09-11시': 23,
					'11-13시': 45,
					'13-15시': 56,
					'15-17시': 52,
					'17-19시': 22
				}
			}
		],
		
		// 요일 × 시간대
		'요일-시간대': [
			{
				dimension1Value: '월요일',
				total: 189,
				breakdown: {
					'09-11시': 34,
					'11-13시': 45,
					'13-15시': 52,
					'15-17시': 43,
					'17-19시': 15
				}
			},
			{
				dimension1Value: '화요일',
				total: 234,
				breakdown: {
					'09-11시': 45,
					'11-13시': 56,
					'13-15시': 62,
					'15-17시': 54,
					'17-19시': 17
				}
			},
			{
				dimension1Value: '수요일',
				total: 267,
				breakdown: {
					'09-11시': 52,
					'11-13시': 67,
					'13-15시': 76,
					'15-17시': 58,
					'17-19시': 14
				}
			}
		]
	})

	// 현재 선택된 차원 조합의 데이터 가져오기
	const getCurrentDimensionData = () => {
		const key = `${dimension1}-${dimension2}`
		return multiDimensionalData[key] || []
	}

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

	// 다차원 히트맵 데이터 생성 (선택된 차원 조합에 따라)
	const generateDimensionalHeatmap = () => {
		const currentData = getCurrentDimensionData()
		if (currentData.length === 0) return {}
		
		const dateData = {}
		const today = new Date()
		
		// 최근 90일의 날짜별 데이터 생성
		for (let i = 89; i >= 0; i--) {
			const date = new Date(today)
			date.setDate(date.getDate() - i)
			const dateStr = date.toISOString().split('T')[0]
			const isWeekend = date.getDay() === 0 || date.getDay() === 6
			
			// 각 dimension1 값에 대해 랜덤 데이터 생성
			currentData.forEach(item => {
				// 해당 날짜에 이 조합이 발생한 횟수 (랜덤)
				const baseMultiplier = isWeekend ? 0.3 : 1.0
				const dailyCount = Math.floor((item.total / 90) * (Math.random() * 1.5 + 0.5) * baseMultiplier)
				
				if (!dateData[dateStr]) dateData[dateStr] = 0
				dateData[dateStr] += dailyCount
			})
		}
		
		return dateData
	}

	// 선택된 차원 조합에 따라 히트맵 데이터 생성
	const dimensionalHeatmap = generateDimensionalHeatmap()
	
	// 날짜별로 그룹화 (다차원 분석 기반)
	const groupedByDate = dimensionalHeatmap

	// 최댓값 기준 5등급제 색상 계산
	const getHeatmapColor = (count, maxCount) => {
		if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
		if (maxCount === 0) return 'bg-gray-100 dark:bg-gray-800'
		
		const percentage = (count / maxCount) * 100
		
		if (percentage <= 20) return 'bg-emerald-200 dark:bg-emerald-900'
		if (percentage <= 40) return 'bg-emerald-400 dark:bg-emerald-700'
		if (percentage <= 60) return 'bg-emerald-600 dark:bg-emerald-500'
		if (percentage <= 80) return 'bg-emerald-700 dark:bg-emerald-400'
		return 'bg-emerald-800 dark:bg-emerald-300'
	}

	// 최댓값 계산
	const maxCount = Math.max(...Object.values(groupedByDate), 0)

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
				{/* Dimensional Heatmap Calendar */}
				<div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
					<div className="mb-6">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
								📊 다차원 활동 히트맵 (최근 90일)
							</h2>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							<span className="font-semibold text-blue-600 dark:text-blue-400">{dimension1}</span>
							<span className="mx-2">×</span>
							<span className="font-semibold text-purple-600 dark:text-purple-400">{dimension2}</span>
							<span className="ml-2">조합의 일별 발생 빈도</span>
						</p>
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
													percentage: maxCount > 0 ? ((day.count / maxCount) * 100).toFixed(1) : 0,
													dayName: ['일', '월', '화', '수', '목', '금', '토'][day.day]
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
						
						{/* Floating Tooltip */}
						{hoveredDay && (
							<div 
								className="fixed z-50 pointer-events-none animate-bounce-subtle"
								style={{
									left: `${tooltipPosition.x}px`,
									top: `${tooltipPosition.y}px`,
									transform: 'translate(-50%, -100%)'
								}}
							>
								<div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 dark:border-blue-400 p-4 min-w-[200px]">
									<div className="text-center space-y-2">
										<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											{hoveredDay.dayName}요일
										</div>
										<div className="text-sm font-medium text-gray-700 dark:text-gray-300">
											{hoveredDay.date}
										</div>
										<div className="border-t border-gray-200 dark:border-gray-600 pt-2">
											<div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
												{dimension1} × {dimension2}
											</div>
											<div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
												{hoveredDay.count.toLocaleString()}
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												건
											</div>
										</div>
										<div className="flex items-center justify-center gap-2 text-xs">
											<div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
												최댓값 대비 {hoveredDay.percentage}%
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
						
						{/* Statistics */}
						<div className="mt-4 flex items-center justify-between text-sm">
							<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
								<span>0%</span>
								<div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-300 dark:border-gray-600"></div>
								<div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-900 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-400 dark:bg-emerald-700 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-700 dark:bg-emerald-400 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-800 dark:bg-emerald-300 rounded-sm"></div>
								<span>100%</span>
							</div>
							
							{/* Total Count */}
							<div className="text-gray-700 dark:text-gray-300 flex items-baseline gap-2">
								<div>
									<span className="font-semibold text-xs">총 </span>
									<span className="text-lg font-bold text-blue-600 dark:text-blue-400">
										{Object.values(groupedByDate).reduce((sum, count) => sum + count, 0).toLocaleString()}
									</span>
									<span className="font-semibold text-xs"> 건</span>
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">
									(최대 {maxCount.toLocaleString()}건/일)
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Multi-Dimensional Analysis */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
					<div className="mb-6">
						<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
							� 다차원 분석 (nC2 조합)
						</h2>
						
						{/* Dimension Selector */}
						<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
							<div className="flex items-center gap-2">
								<label className="text-sm text-gray-600 dark:text-gray-400">차원 1:</label>
								<select 
									value={dimension1}
									onChange={(e) => setDimension1(e.target.value)}
									className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								>
									{availableDimensions.map(dim => (
										<option key={dim} value={dim}>{dim}</option>
									))}
								</select>
							</div>
							
							<span className="text-gray-400">×</span>
							
							<div className="flex items-center gap-2">
								<label className="text-sm text-gray-600 dark:text-gray-400">차원 2:</label>
								<select 
									value={dimension2}
									onChange={(e) => setDimension2(e.target.value)}
									className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
								>
									{availableDimensions.filter(d => d !== dimension1).map(dim => (
										<option key={dim} value={dim}>{dim}</option>
									))}
								</select>
							</div>
							
							<div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
								{getCurrentDimensionData().length > 0 
									? `${getCurrentDimensionData().reduce((sum, item) => sum + item.total, 0)} 건` 
									: '데이터 없음'}
							</div>
						</div>
					</div>
					
					{/* Data Display */}
					{getCurrentDimensionData().length > 0 ? (
						<div className="space-y-6">
							{getCurrentDimensionData().map((item, idx) => (
								<div key={idx} className="space-y-3">
									{/* Header */}
									<div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
										<span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate" title={item.dimension1Value}>
											{item.dimension1Value}
										</span>
										<span className="text-lg font-bold text-blue-600 dark:text-blue-400 ml-2">
											{item.total}
										</span>
									</div>
									
									{/* Breakdown */}
									<div className="space-y-2 pl-2">
										{Object.entries(item.breakdown)
											.sort((a, b) => b[1] - a[1])
											.map(([key, count], tagIdx) => {
												const percentage = (count / item.total) * 100
												return (
													<div key={tagIdx} className="flex items-center gap-2">
														<span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate" title={key}>
															{key}
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
														<span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
															{percentage.toFixed(1)}%
														</span>
													</div>
												)
											})}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500 dark:text-gray-400 text-sm">
								해당 조합의 데이터가 없습니다.
							</p>
							<p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
								다른 차원 조합을 선택해주세요.
							</p>
						</div>
					)}
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


