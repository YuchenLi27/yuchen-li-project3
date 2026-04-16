import { useGame } from '../context/GameContext'

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const minuteText = String(minutes).padStart(2, '0')
  const secondText = String(seconds).padStart(2, '0')

  return `${minuteText}:${secondText}`
}

export default function Timer() {
  const { state } = useGame()

  return (
    <div className="timer-box">
      Time: {formatTime(state.elapsedTime)}
    </div>
  )
}