import { useState } from 'react'

// 더미 데이터
const RECENT_INQUIRIES = [
  { id: 1, customer: '김OO', time: '2분 전', status: '진행중', tag: '배송 문의', priority: 'high' },
  { id: 2, customer: '이OO', time: '5분 전', status: '대기', tag: 'VIP 고객', priority: 'high' },
  { id: 3, customer: '박OO', time: '12분 전', status: '진행중', tag: '교환/환불', priority: 'normal' },
  { id: 4, customer: '최OO', time: '18분 전', status: '완료', tag: '일반 문의', priority: 'low' },
  { id: 5, customer: '정OO', time: '25분 전', status: '진행중', tag: '결제 문의', priority: 'normal' },
  { id: 6, customer: '강OO', time: '32분 전', status: '대기', tag: '상품 문의', priority: 'normal' },
]

const HOT_KEYWORDS = [
  { keyword: '배송', count: 127, trend: '+12%' },
  { keyword: '환불', count: 89, trend: '+8%' },
  { keyword: '교환', count: 76, trend: '-3%' },
  { keyword: '사이즈', count: 54, trend: '+15%' },
  { keyword: '결제', count: 43, trend: '+5%' },
]

function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState(null)

  const stats = {
    waiting: 8,
    inProgress: 23,
    completed: 156,
  }

  const filteredInquiries = selectedStatus
    ? RECENT_INQUIRIES.filter(i => i.status === selectedStatus)
    : RECENT_INQUIRIES

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 실시간 상담 현황
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            채널톡 고객상담 모니터링 대시보드
          </p>
        </div>

        {/* 상태 카드 - 가로 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setSelectedStatus(selectedStatus === '대기' ? null : '대기')}
            className={`p-6 rounded-xl transition-all ${
              selectedStatus === '대기'
                ? 'bg-yellow-500 dark:bg-yellow-600 shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  selectedStatus === '대기' 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  ⏳ 대기중
                </p>
                <p className={`text-3xl font-bold ${
                  selectedStatus === '대기' 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {stats.waiting}
                </p>
              </div>
              <div className={`text-4xl ${
                selectedStatus === '대기' ? 'opacity-100' : 'opacity-40'
              }`}>
                ⏳
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === '진행중' ? null : '진행중')}
            className={`p-6 rounded-xl transition-all ${
              selectedStatus === '진행중'
                ? 'bg-blue-500 dark:bg-blue-600 shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  selectedStatus === '진행중' 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  🔄 진행중
                </p>
                <p className={`text-3xl font-bold ${
                  selectedStatus === '진행중' 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {stats.inProgress}
                </p>
              </div>
              <div className={`text-4xl ${
                selectedStatus === '진행중' ? 'opacity-100' : 'opacity-40'
              }`}>
                🔄
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === '완료' ? null : '완료')}
            className={`p-6 rounded-xl transition-all ${
              selectedStatus === '완료'
                ? 'bg-green-500 dark:bg-green-600 shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium mb-1 ${
                  selectedStatus === '완료' 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  ✅ 오늘 완료
                </p>
                <p className={`text-3xl font-bold ${
                  selectedStatus === '완료' 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {stats.completed}
                </p>
              </div>
              <div className={`text-4xl ${
                selectedStatus === '완료' ? 'opacity-100' : 'opacity-40'
              }`}>
                ✅
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 최근 상담 내역 - 2/3 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  💬 최근 상담
                </h2>
                {selectedStatus && (
                  <button
                    onClick={() => setSelectedStatus(null)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    전체 보기
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {inquiry.customer}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          inquiry.status === '대기'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : inquiry.status === '진행중'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        }`}>
                          {inquiry.status}
                        </span>
                        {inquiry.priority === 'high' && (
                          <span className="text-red-500 text-xs">🔥</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {inquiry.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {inquiry.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 핫 키워드 - 1/3 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔥 이번 주 핫 키워드
              </h2>
              <div className="space-y-3">
                {HOT_KEYWORDS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                        #{idx + 1}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.keyword}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.count}
                      </div>
                      <div className={`text-xs ${
                        item.trend.startsWith('+')
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {item.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


