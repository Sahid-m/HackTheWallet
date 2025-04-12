interface StatsBoxProps {
  name: string
  stats: {
    hp?: number
    en?: number
    trust?: number
  }
  showSingleStat?: boolean
  singleStatName?: string
  playerName?: string
  betAmount?: number
}

export default function StatsBox({
  name,
  stats,
  showSingleStat = false,
  singleStatName = "TRUST",
  playerName,
  betAmount,
}: StatsBoxProps) {
  return (
    <div className="bg-[#f8f8d8] border-4 border-[#a8a878] rounded-lg p-2 font-pixel text-black">
      <div className="text-lg font-bold mb-1">{name}</div>

      {playerName && (
        <div className="mb-2">
          <div className="flex items-center">
            <span className="w-16 text-sm font-bold">NAME</span>
            <span className="text-sm">{playerName}</span>
          </div>
        </div>
      )}

      {betAmount !== undefined && (
        <div className="mb-2">
          <div className="flex items-center">
            <span className="w-16 text-sm font-bold">BET</span>
            <span className="text-sm">{betAmount} coins</span>
          </div>
        </div>
      )}

      {showSingleStat ? (
        <div className="mb-1">
          <div className="flex items-center">
            <span className="w-16 text-sm font-bold">{singleStatName}</span>
            <div className="flex-1 h-4 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${stats.trust}%` }}></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {stats.hp !== undefined && (
            <div className="mb-1">
              <div className="flex items-center">
                <span className="w-8 text-sm font-bold">HP</span>
                <div className="flex-1 h-4 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${stats.hp}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {stats.en !== undefined && (
            <div>
              <div className="flex items-center">
                <span className="w-8 text-sm font-bold">EN</span>
                <div className="flex-1 h-4 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${stats.en}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
