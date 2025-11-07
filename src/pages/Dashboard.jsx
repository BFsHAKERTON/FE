import { useEffect, useState } from 'react'
import { getWeeklyKeywords } from '../shared/api/services/stats'
import { mockInquiryData } from '../data/mockInquiryData'
import KPICards from '../components/dashboard/KPICards'
import TagHeatmapCalendar from '../components/dashboard/TagHeatmapCalendar'
import HotKeywords from '../components/dashboard/HotKeywords'
import MultiDimensionAnalysis from '../components/dashboard/MultiDimensionAnalysis'

function Dashboard() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [keywords, setKeywords] = useState([])
	const [selectedTag, setSelectedTag] = useState('전체')
	
	// 태그 필터링 (계층적 태그 시스템)
	const [tagFilter1, setTagFilter1] = useState('전체')
	const [tagFilter2, setTagFilter2] = useState('전체')
	const [hoveredDay, setHoveredDay] = useState(null)
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
	
	// 다차원 분석을 위한 차원(Dimension) 선택 (최대 3차원)
	const [dimension1, setDimension1] = useState('상담태그')
	const [dimension2, setDimension2] = useState('시간대')
	const [dimension3, setDimension3] = useState('없음')
	
	// 사용 가능한 차원들 (유입페이지 제거)
	const availableDimensions = [
		'상담태그',
		'시간대',
		'요일',
		'담당자',
		'고객등급',
		'상담상태'
	]
	
	// 시각화 타입 (GA4 스타일)
	const [visualizationType, setVisualizationType] = useState('막대그래프') // '히트맵', '막대그래프', '표'
	
	// 계층적 태그 시스템 (최대 3단계)
	const [hierarchicalTags] = useState([
		'전체',
		'고객유형/VIP',
		'고객유형/반복컴플레인',
		'고객유형/신규고객',
		'고객유형/휴면고객',
		'상품문의/교환/사이즈',
		'상품문의/교환/색상',
		'상품문의/교환/불량',
		'상품문의/반품/단순변심',
		'상품문의/반품/사이즈',
		'상품문의/재고/입고문의',
		'상품문의/재고/품절',
		'배송문의/배송지연',
		'배송문의/배송조회',
		'배송문의/배송변경',
		'결제문의/결제실패',
		'결제문의/환불',
		'결제문의/쿠폰',
		'이벤트/할인',
		'이벤트/포인트',
		'기타/문의',
		'기타/건의'
	])
	
	// Mock 상담 데이터 (별도 파일에서 import)
	const [inquiryData] = useState(mockInquiryData)
	
	// 현재 선택된 차원 조합의 데이터 가져오기 (2차원 또는 3차원)
	// inquiryData에서 실시간으로 필터링하여 생성
	
	// 더미 데이터 (실제로는 API에서 가져올 데이터)
	const [kpiData] = useState({
		totalInquiries: 1234,
		avgResponseTime: 145, // seconds
		avgCSAT: 4.7,
		completionRate: 89.5
	})

	// 태그별 히트맵 데이터 (최근 90일)
	const [heatmapData, setHeatmapData] = useState([])
	
	// 현재 선택된 차원 조합의 데이터 가져오기 (2차원 또는 3차원)
	// inquiryData에서 실시간으로 필터링하여 생성
	const getCurrentDimensionData = () => {
		// 차원별 속성 매핑
		const dimensionMapping = {
			'상담태그': 'tags',
			'시간대': 'timeSlot',
			'요일': 'weekday',
			'담당자': 'manager',
			'고객등급': 'customerGrade',
			'상담상태': 'status'
		}
		
		// 계층적 태그를 단순 카테고리로 변환하는 함수
		const simplifyTag = (tag) => {
			if (tag.startsWith('고객유형/')) return '고객유형'
			if (tag.startsWith('상품문의/교환/')) return '교환'
			if (tag.startsWith('상품문의/반품/')) return '반품'
			if (tag.startsWith('상품문의/재고/')) return '재고'
			if (tag.startsWith('배송문의/')) return '배송'
			if (tag.startsWith('결제문의/')) return '결제'
			if (tag.startsWith('이벤트/')) return '이벤트'
			if (tag.startsWith('기타/')) return '기타'
			return tag
		}
		
		const dim1Key = dimensionMapping[dimension1]
		const dim2Key = dimensionMapping[dimension2]
		const dim3Key = dimension3 !== '없음' ? dimensionMapping[dimension3] : null
		
		// 차원1의 고유 값들 추출
		const dim1Values = new Set()
		inquiryData.forEach(inquiry => {
			let value = inquiry[dim1Key]
			
			// 태그인 경우 배열 처리 및 단순화
			if (dim1Key === 'tags' && Array.isArray(value)) {
				value.forEach(v => dim1Values.add(simplifyTag(v)))
			} else if (Array.isArray(value)) {
				value.forEach(v => dim1Values.add(v))
			} else {
				dim1Values.add(value)
			}
		})
		
		// 각 차원1 값별로 데이터 집계
		const result = Array.from(dim1Values).map(dim1Value => {
			// 차원1에 해당하는 데이터 필터링
			const filteredByDim1 = inquiryData.filter(inquiry => {
				let value = inquiry[dim1Key]
				
				if (dim1Key === 'tags' && Array.isArray(value)) {
					return value.some(v => simplifyTag(v) === dim1Value)
				} else if (Array.isArray(value)) {
					return value.includes(dim1Value)
				} else {
					return value === dim1Value
				}
			})
			
			// 차원2별로 그룹화
			const dim2Breakdown = {}
			filteredByDim1.forEach(inquiry => {
				let dim2Value = inquiry[dim2Key]
				
				// 태그인 경우 배열 처리 및 단순화
				if (dim2Key === 'tags' && Array.isArray(dim2Value)) {
					dim2Value = dim2Value.map(v => simplifyTag(v))
				} else if (!Array.isArray(dim2Value)) {
					dim2Value = [dim2Value]
				}
				
				dim2Value.forEach(v => {
					if (!dim2Breakdown[v]) {
						dim2Breakdown[v] = 0
					}
					dim2Breakdown[v]++
				})
			})
			
			const itemData = {
				dimension1Value: dim1Value,
				total: filteredByDim1.length,
				breakdown: dim2Breakdown
			}
			
			// 3차원이 있으면 중첩 데이터 추가
			if (dim3Key) {
				// 차원2의 각 값별로 차원3 데이터 생성
				const dim3All = []
				Object.keys(dim2Breakdown).forEach(dim2Value => {
					const filteredByDim2 = filteredByDim1.filter(inquiry => {
						let value = inquiry[dim2Key]
						
						if (dim2Key === 'tags' && Array.isArray(value)) {
							return value.some(v => simplifyTag(v) === dim2Value)
						} else if (Array.isArray(value)) {
							return value.includes(dim2Value)
						} else {
							return value === dim2Value
						}
					})
					
					// 차원3별로 그룹화
					const dim3Counts = {}
					filteredByDim2.forEach(inquiry => {
						let dim3Value = inquiry[dim3Key]
						
						// 태그인 경우 배열 처리 및 단순화
						if (dim3Key === 'tags' && Array.isArray(dim3Value)) {
							dim3Value = dim3Value.map(v => simplifyTag(v))
						} else if (!Array.isArray(dim3Value)) {
							dim3Value = [dim3Value]
						}
						
						dim3Value.forEach(v => {
							if (!dim3Counts[v]) {
								dim3Counts[v] = 0
							}
							dim3Counts[v]++
						})
					})
					
					// 상위 3개 추가
					Object.entries(dim3Counts)
						.sort((a, b) => b[1] - a[1])
						.slice(0, 3)
						.forEach(([value, count]) => {
							dim3All.push({ value, count })
						})
				})
				
				itemData.dimension3Breakdown = dim3All
			}
			
			return itemData
		})
		
		// 총 건수 기준으로 정렬
		return result.sort((a, b) => b.total - a.total).slice(0, 8)
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
			} catch (err) {
				if (mounted) setError(err?.message || '데이터 로드 실패')
			} finally {
				if (mounted) setLoading(false)
			}
		})()
		return () => { mounted = false }
	}, [])

	// 태그 필터링된 히트맵 데이터 생성
	const generateTagFilteredHeatmap = () => {
		const dateData = {}
		
		// 필터 조건에 맞는 상담 데이터 필터링
		const filteredInquiries = inquiryData.filter(inquiry => {
			const hasTag1 = tagFilter1 === '전체' || inquiry.tags.includes(tagFilter1)
			const hasTag2 = tagFilter2 === '전체' || inquiry.tags.includes(tagFilter2)
			
			// AND 조건: 두 태그 모두 포함해야 함
			if (tagFilter1 !== '전체' && tagFilter2 !== '전체') {
				return hasTag1 && hasTag2
			}
			// OR 조건: 둘 중 하나라도 포함
			return hasTag1 || hasTag2
		})
		
		// 날짜별로 그룹화
		filteredInquiries.forEach(inquiry => {
			if (!dateData[inquiry.date]) {
				dateData[inquiry.date] = 0
			}
			dateData[inquiry.date]++
		})
		
		return dateData
	}

	const tagHeatmapData = generateTagFilteredHeatmap()
	const maxCount = Math.max(...Object.values(tagHeatmapData), 0)

	// 최댓값 기준 5등급제 색상 계산
	const getHeatmapColor = (count, max) => {
		if (count === 0 || max === 0) return 'bg-gray-100 dark:bg-gray-800'
		
		const percentage = (count / max) * 100
		
		if (percentage <= 20) return 'bg-emerald-200 dark:bg-emerald-900'
		if (percentage <= 40) return 'bg-emerald-400 dark:bg-emerald-700'
		if (percentage <= 60) return 'bg-emerald-600 dark:bg-emerald-500'
		if (percentage <= 80) return 'bg-emerald-700 dark:bg-emerald-400'
		return 'bg-emerald-800 dark:bg-emerald-300'
	}

	const getHeatmapColorOld = (count) => {
		if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
		if (count < 20) return 'bg-emerald-200 dark:bg-emerald-900'
		if (count < 40) return 'bg-emerald-400 dark:bg-emerald-700'
		if (count < 60) return 'bg-emerald-600 dark:bg-emerald-500'
		return 'bg-emerald-800 dark:bg-emerald-300'
	}

	// 주차별로 그룹화
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
				count: tagHeatmapData[dateStr] || 0,
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
					Relay Tok 대시보드
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-2">
					채널톡 상담 데이터 통합 분석
				</p>
			</div>

			{/* Main Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				{/* Tag Filtered Heatmap Calendar */}
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
								className="fixed z-50 pointer-events-none"
								style={{
									left: `${tooltipPosition.x}px`,
									top: `${tooltipPosition.y}px`,
									transform: 'translate(-50%, -100%)'
								}}
							>
								<div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 dark:border-blue-400 p-4 min-w-[220px] animate-pulse-subtle">
									<div className="text-center space-y-2">
										<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
											{hoveredDay.dayName}요일
										</div>
										<div className="text-sm font-medium text-gray-700 dark:text-gray-300">
											{hoveredDay.date}
										</div>
										<div className="border-t border-gray-200 dark:border-gray-600 pt-2">
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
						
						{/* Legend & Stats */}
						<div className="mt-4 flex items-center justify-between text-sm">
							<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
								<span className="text-xs">0%</span>
								<div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-300 dark:border-gray-600"></div>
								<div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-900 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-400 dark:bg-emerald-700 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-700 dark:bg-emerald-400 rounded-sm"></div>
								<div className="w-4 h-4 bg-emerald-800 dark:bg-emerald-300 rounded-sm"></div>
								<span className="text-xs">100%</span>
							</div>
							
							{/* Max Count */}
							<div className="text-xs text-gray-500 dark:text-gray-400">
								최대 <span className="font-bold text-gray-700 dark:text-gray-300">{maxCount.toLocaleString()}</span>건/일
							</div>
						</div>
					</div>
				</div>

				{/* Multi-Dimensional Analysis */}
				<MultiDimensionAnalysis
					availableDimensions={availableDimensions}
					dimension1={dimension1}
					setDimension1={setDimension1}
					dimension2={dimension2}
					setDimension2={setDimension2}
					dimension3={dimension3}
					setDimension3={setDimension3}
					visualizationType={visualizationType}
					setVisualizationType={setVisualizationType}
					getCurrentDimensionData={getCurrentDimensionData}
				/>
			</div>

			{/* Tag Trends */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
					태그별 트렌드 (최근 7일)
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
											className="w-full bg-linear-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-colors"
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
					이번 주 인기 키워드
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
								className="px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-full border border-blue-200 dark:border-gray-500 hover:shadow-md transition-shadow"
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
					부가 지표
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

			{/* KPI Cards */}
			<KPICards kpiData={kpiData} />
		</div>
	)
}

export default Dashboard


