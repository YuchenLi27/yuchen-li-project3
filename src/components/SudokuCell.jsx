import { useGame } from '../context/GameContext'

export default function SudokuCell({
  rowIndex,
  colIndex,
  value,
  isLocked,
  isInvalid,
  isHint,
  maxValue,
}) {
  const { state, dispatch } = useGame()

  function handleChange(event) {
    if (state.isComplete || isLocked) {
      return
    }

    const rawValue = event.target.value

    if (rawValue === '') {
      dispatch({
        type: 'UPDATE_CELL',
        payload: {
          row: rowIndex,
          col: colIndex,
          value: 0,
        },
      })
      return
    }

    if (!/^\d$/.test(rawValue)) {
      return
    }

    const parsedValue = Number(rawValue)

    if (parsedValue < 1 || parsedValue > maxValue) {
      return
    }

    dispatch({
      type: 'UPDATE_CELL',
      payload: {
        row: rowIndex,
        col: colIndex,
        value: parsedValue,
      },
    })
  }

  const className = [
    'sudoku-cell',
    isLocked ? 'locked' : '',
    isInvalid ? 'invalid' : '',
    isHint ? 'hint' : '',
    state.isComplete ? 'complete' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <input
      className={className}
      type="text"
      inputMode="numeric"
      pattern="[1-9]*"
      maxLength={1}
      value={value === 0 ? '' : value}
      onChange={handleChange}
      disabled={isLocked || state.isComplete}
      aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
    />
  )
}