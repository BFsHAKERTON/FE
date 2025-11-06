import { useEffect, useState } from 'react'
import { getWeeklyKeywords } from '../shared/api/services/stats'

// 채널톡 멀티 태그 구조
const TAG_CATEGORIES = {
  고객유형: {
    label: '고객유형',
    color: 'gray',
    tags: ['VIP', '반복컴플레인', '배송문의', '버그']
  },
  불량: {
    label: '불량',
    color: 'red',
    tags: ['청바지']
  },
  상품문의: {
    label: '상품문의',
    color: 'blue',
    tags: [
      { label: '교환', children: ['사이즈', '색상', '재고'] },
      { label: '반품', children: ['단순변심', '불량', '오배송'] },
      { label: '배송', children: ['배송지연', '배송조회', '재배송'] }
    ]
  }
}

// 더미 데이터
const DUMMY_STATS = {
  totalCases: 1234,
  avgWaitingTime: 120,
  avgReplyTime: 45,
  avgCsat: 4.7,
  completionRate: 94,
  stateDistribution: {
    '진행중': 23,
    '대기열': 8,
    '종료됨': 156,
    '부재중': 2,
    '보류됨': 5
  }
}

const DUMMY_CASES = [
  { id: 1, customer: '홍길동', state: '진행중', createdAt: '2025-11-07 13:20', tags: ['VIP', '교환/사이즈'], manager: '올무', team: '미니멀샵' },
  { id: 2, customer: '김철수', state: '대기열', createdAt: '2025-11-07 13:18', tags: ['배송문의'], manager: '올무', team: '미니멀샵' },
  { id: 3, customer: '이영희', state: '진행중', createdAt: '2025-11-07 13:15', tags: ['반복컴플레인', '청바지'], manager: '율무', team: '미니멀샵' },
  { id: 4, customer: '박민수', state: '종료됨', createdAt: '2025-11-07 13:10', tags: ['교환/색상'], manager: '올무', team: '미니멀샵' },
  { id: 5, customer: '최유리', state: '진행중', createdAt: '2025-11-07 13:05', tags: ['VIP', '배송/배송지연'], manager: '율무', team: '미니멀샵' },
  { id: 6, customer: '정민호', state: '대기열', createdAt: '2025-11-07 13:00', tags: ['교환/재고'], manager: '율무', team: '미니멀샵' },
  { id: 7, customer: '강서연', state: '진행중', createdAt: '2025-11-07 12:55', tags: ['VIP', '반품/불량', '청바지'], manager: '올무', team: '미니멀샵' },
  { id: 8, customer: '윤지우', state: '종료됨', createdAt: '2025-11-07 12:50', tags: ['배송/배송조회'], manager: '율무', team: '미니멀샵' },
  { id: 9, customer: '한서준', state: '진행중', createdAt: '2025-11-07 12:45', tags: ['교환/사이즈'], manager: '올무', team: '미니멀샵' },
  { id: 10, customer: '이도윤', state: '대기열', createdAt: '2025-11-07 12:40', tags: ['반품/단순변심'], manager: '율무', team: '미니멀샵' },
  { id: 11, customer: '박시우', state: '종료됨', createdAt: '2025-11-07 12:35', tags: ['배송/재배송'], manager: '올무', team: '미니멀샵' },
  { id: 12, customer: '최예준', state: '진행중', createdAt: '2025-11-07 12:30', tags: ['VIP', '교환/색상'], manager: '율무', team: '미니멀샵' },
  { id: 13, customer: '정하윤', state: '부재중', createdAt: '2025-11-07 12:25', tags: ['배송문의'], manager: '올무', team: '미니멀샵' },
  { id: 14, customer: '김민준', state: '종료됨', createdAt: '2025-11-07 12:20', tags: ['교환/재고'], manager: '율무', team: '미니멀샵' },
  { id: 15, customer: '이서진', state: '진행중', createdAt: '2025-11-07 12:15', tags: ['반복컴플레인', '배송/배송지연'], manager: '올무', team: '미니멀샵' },
  { id: 16, customer: '박지훈', state: '대기열', createdAt: '2025-11-07 12:10', tags: ['반품/오배송'], manager: '율무', team: '미니멀샵' },
  { id: 17, customer: '최서연', state: '종료됨', createdAt: '2025-11-07 12:05', tags: ['VIP', '교환/사이즈'], manager: '올무', team: '미니멀샵' },
  { id: 18, customer: '정유진', state: '보류됨', createdAt: '2025-11-07 12:00', tags: ['청바지', '반품/불량'], manager: '율무', team: '미니멀샵' },
  { id: 19, customer: '강민석', state: '진행중', createdAt: '2025-11-07 11:55', tags: ['배송/배송조회'], manager: '올무', team: '미니멀샵' },
  { id: 20, customer: '윤서아', state: '종료됨', createdAt: '2025-11-07 11:50', tags: ['교환/색상'], manager: '율무', team: '미니멀샵' },
  { id: 21, customer: '한지민', state: '대기열', createdAt: '2025-11-07 11:45', tags: ['VIP', '배송/재배송'], manager: '올무', team: '미니멀샵' },
  { id: 22, customer: '이수현', state: '진행중', createdAt: '2025-11-07 11:40', tags: ['반품/단순변심'], manager: '율무', team: '미니멀샵' },
  { id: 23, customer: '박예은', state: '종료됨', createdAt: '2025-11-07 11:35', tags: ['교환/재고'], manager: '올무', team: '미니멀샵' },
  { id: 24, customer: '최민재', state: '진행중', createdAt: '2025-11-07 11:30', tags: ['버그'], manager: '율무', team: '미니멀샵' },
  { id: 25, customer: '정아인', state: '종료됨', createdAt: '2025-11-07 11:25', tags: ['VIP', '교환/사이즈'], manager: '올무', team: '미니멀샵' },
  { id: 26, customer: '김도현', state: '대기열', createdAt: '2025-11-07 11:20', tags: ['배송/배송지연'], manager: '율무', team: '미니멀샵' },
  { id: 27, customer: '이채원', state: '진행중', createdAt: '2025-11-07 11:15', tags: ['반복컴플레인', '청바지'], manager: '올무', team: '미니멀샵' },
  { id: 28, customer: '박서준', state: '종료됨', createdAt: '2025-11-07 11:10', tags: ['교환/색상'], manager: '율무', team: '미니멀샵' },
  { id: 29, customer: '최지안', state: '보류됨', createdAt: '2025-11-07 11:05', tags: ['반품/불량'], manager: '올무', team: '미니멀샵' },
  { id: 30, customer: '정시현', state: '진행중', createdAt: '2025-11-07 11:00', tags: ['VIP', '배송/배송조회'], manager: '율무', team: '미니멀샵' },
  { id: 31, customer: '강태민', state: '종료됨', createdAt: '2025-11-07 10:55', tags: ['교환/재고'], manager: '올무', team: '미니멀샵' },
  { id: 32, customer: '윤하은', state: '대기열', createdAt: '2025-11-07 10:50', tags: ['배송문의'], manager: '율무', team: '미니멀샵' },
  { id: 33, customer: '한준서', state: '진행중', createdAt: '2025-11-07 10:45', tags: ['교환/사이즈'], manager: '올무', team: '미니멀샵' },
  { id: 34, customer: '이소율', state: '종료됨', createdAt: '2025-11-07 10:40', tags: ['반품/오배송'], manager: '율무', team: '미니멀샵' },
  { id: 35, customer: '박승우', state: '부재중', createdAt: '2025-11-07 10:35', tags: ['VIP', '배송/재배송'], manager: '올무', team: '미니멀샵' },
  { id: 36, customer: '최윤서', state: '진행중', createdAt: '2025-11-07 10:30', tags: ['청바지', '교환/색상'], manager: '율무', team: '미니멀샵' },
  { id: 37, customer: '정재윤', state: '종료됨', createdAt: '2025-11-07 10:25', tags: ['배송/배송조회'], manager: '올무', team: '미니멀샵' },
  { id: 38, customer: '김나연', state: '대기열', createdAt: '2025-11-07 10:20', tags: ['반품/단순변심'], manager: '율무', team: '미니멀샵' },
  { id: 39, customer: '이현우', state: '진행중', createdAt: '2025-11-07 10:15', tags: ['VIP', '교환/재고'], manager: '올무', team: '미니멀샵' },
  { id: 40, customer: '박지원', state: '보류됨', createdAt: '2025-11-07 10:10', tags: ['반복컴플레인', '배송/배송지연'], manager: '율무', team: '미니멀샵' }
]

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keywords, setKeywords] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedState, setSelectedState] = useState(null)
  const [expandedCategory, setExpandedCategory] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setError('')
      setLoading(true)
      try {
        const data = await getWeeklyKeywords({ limit: 5 })
        if (mounted) setKeywords(Array.isArray(data) ? data : [])
      } catch (err) {
        if (mounted) setError(err?.message || '데이터 로드 실패')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const toggleState = (state) => {
    setSelectedState(prev => prev === state ? null : state)
  }

  const filteredCases = DUMMY_CASES.filter(c => {
    if (selectedState && c.state !== selectedState) return false
    if (selectedTags.length > 0 && !selectedTags.some(tag => c.tags.includes(tag))) return false
    return true
  })

  const StateCard = ({ state, count, emoji }) => {
    const isSelected = selectedState === state
    return (
      <button
        onClick={() => toggleState(state)}
        className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 border-2 ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105' 
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
        }`}
      >
        <span className="text-2xl mb-2">{emoji}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{state}</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
      </button>
    )
  }

  const TagButton = ({ tag, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {tag}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 HACKY-TALKY 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            채널톡 고객상담 실시간 모니터링
          </p>
        </div>

        {/* KPI 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">총 상담 건수</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{DUMMY_STATS.totalCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">평균 첫 응대</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{DUMMY_STATS.avgWaitingTime}초</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">평균 응답</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{DUMMY_STATS.avgReplyTime}초</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">평균 CSAT</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{DUMMY_STATS.avgCsat}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">완료율</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{DUMMY_STATS.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 상태 분포 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📈 상담 상태 분포</h2>
          <div className="grid grid-cols-5 gap-4">
            <StateCard state="진행중" count={DUMMY_STATS.stateDistribution['진행중']} emoji="🔄" />
            <StateCard state="대기열" count={DUMMY_STATS.stateDistribution['대기열']} emoji="⏳" />
            <StateCard state="종료됨" count={DUMMY_STATS.stateDistribution['종료됨']} emoji="✅" />
            <StateCard state="부재중" count={DUMMY_STATS.stateDistribution['부재중']} emoji="📵" />
            <StateCard state="보류됨" count={DUMMY_STATS.stateDistribution['보류됨']} emoji="⏸️" />
          </div>
          {selectedState && (
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center mt-4">
              💡 <strong>{selectedState}</strong> 상담만 표시 중 (다시 클릭하여 해제)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 멀티 태그 필터 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                🏷️ 멀티 태그 필터
              </h2>
              
              {Object.entries(TAG_CATEGORIES).map(([key, category]) => (
                <div key={key} className="mb-4">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">{category.label}</span>
                    <span className="text-gray-500">{expandedCategory === key ? '▼' : '▶'}</span>
                  </button>
                  
                  {expandedCategory === key && (
                    <div className="mt-2 pl-4 space-y-2">
                      {category.tags.map((tag, idx) => {
                        if (typeof tag === 'string') {
                          return (
                            <TagButton
                              key={idx}
                              tag={tag}
                              isSelected={selectedTags.includes(tag)}
                              onClick={() => toggleTag(tag)}
                            />
                          )
                        } else {
                          return (
                            <div key={idx} className="space-y-1">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {tag.label}
                              </p>
                              <div className="flex flex-wrap gap-2 pl-4">
                                {tag.children.map((child, childIdx) => (
                                  <TagButton
                                    key={childIdx}
                                    tag={`${tag.label}/${child}`}
                                    isSelected={selectedTags.includes(`${tag.label}/${child}`)}
                                    onClick={() => toggleTag(`${tag.label}/${child}`)}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        }
                      })}
                    </div>
                  )}
                </div>
              ))}

              {selectedTags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      선택된 태그 ({selectedTags.length})
                    </span>
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      전체 해제
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 상담 케이스 리스트 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  📋 실시간 상담 리스트
                </h2>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredCases.length}건
                </span>
              </div>

              <div className="space-y-3">
                {filteredCases.map(caseItem => (
                  <div
                    key={caseItem.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {caseItem.customer}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {caseItem.createdAt}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        caseItem.state === '진행중' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        caseItem.state === '대기열' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        caseItem.state === '종료됨' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        {caseItem.state}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {caseItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                      <span>담당: {caseItem.manager}</span>
                      <span>팀: {caseItem.team}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 이번 주 핫 키워드 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔥 이번 주 핫 키워드</h2>
              {loading && <p className="text-gray-600 dark:text-gray-400">불러오는 중...</p>}
              {error && !loading && <p className="text-red-600 dark:text-red-400">{error}</p>}
              {!loading && !error && (
                <div className="space-y-2">
                  {keywords.map((k, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">{k.keyword}</span>
                      <span className="text-gray-600 dark:text-gray-400">{k.count}회</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


