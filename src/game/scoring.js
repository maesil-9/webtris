// 점수 계산 시스템
// 설정 연동 가능한 유연한 점수 시스템

/**
 * 점수 계산 공식:
 * 최종 점수 = (기본 점수 × 레벨 배율) × Back-to-Back 배율 × 전체 배율 + 콤보 보너스
 */

// 기본 점수 가져오기
const getBaseScore = (linesCleared, tSpinResult, settings) => {
  const { score, bonus } = settings
  
  // T-Spin인 경우
  if (tSpinResult.isTSpin && bonus.tSpinEnabled) {
    if (tSpinResult.isMini) {
      // T-Spin Mini
      if (linesCleared === 0) return score.tSpinMini * 0.5
      if (linesCleared === 1) return score.tSpinMini
      if (linesCleared === 2) return score.tSpinDouble * 0.5
    } else {
      // 일반 T-Spin
      if (linesCleared === 0) return score.tSpinMini * 2 // T-Spin Zero
      if (linesCleared === 1) return score.tSpinSingle
      if (linesCleared === 2) return score.tSpinDouble
      if (linesCleared === 3) return score.tSpinTriple
    }
  }
  
  // 일반 라인 클리어
  if (linesCleared === 1) return score.single
  if (linesCleared === 2) return score.double
  if (linesCleared === 3) return score.triple
  if (linesCleared === 4) return score.tetris
  
  return 0
}

// 점수 계산
export const calculateScore = ({
  linesCleared,
  tSpinResult,
  level,
  combo,
  wasLastClearTetrisOrTSpin,
  isPerfectClear,
  settings,
}) => {
  const { score, bonus, level: levelSettings } = settings
  
  if (linesCleared === 0 && !tSpinResult.isTSpin) {
    return {
      lineScore: 0,
      comboBonus: 0,
      perfectClearBonus: 0,
      totalScore: 0,
      isBackToBack: false,
      isTetrisOrTSpin: false,
    }
  }
  
  // 기본 점수
  let baseScore = getBaseScore(linesCleared, tSpinResult, settings)
  
  // 레벨 배율 적용
  baseScore *= level * levelSettings.levelMultiplier
  
  // Back-to-Back 판정 (테트리스 또는 T-Spin이 연속으로 발생)
  const isTetrisOrTSpin = linesCleared === 4 || (tSpinResult.isTSpin && linesCleared > 0)
  const isBackToBack = isTetrisOrTSpin && wasLastClearTetrisOrTSpin && bonus.backToBackEnabled
  
  if (isBackToBack) {
    baseScore *= bonus.backToBackMultiplier
  }
  
  // 콤보 보너스
  let comboBonus = 0
  if (combo > 0 && bonus.comboEnabled) {
    comboBonus = bonus.comboMultiplier * combo * level
  }
  
  // Perfect Clear 보너스
  let perfectClearBonus = 0
  if (isPerfectClear) {
    perfectClearBonus = score.perfectClear * level
  }
  
  // 전체 배율 적용
  const lineScore = Math.floor(baseScore * score.globalMultiplier)
  const totalScore = lineScore + Math.floor(comboBonus) + perfectClearBonus
  
  return {
    lineScore,
    comboBonus: Math.floor(comboBonus),
    perfectClearBonus,
    totalScore,
    isBackToBack,
    isTetrisOrTSpin,
  }
}

// Soft Drop 점수
export const calculateSoftDropScore = (cellsDropped, settings) => {
  return Math.floor(cellsDropped * settings.score.softDropPerCell * settings.score.globalMultiplier)
}

// Hard Drop 점수
export const calculateHardDropScore = (cellsDropped, settings) => {
  return Math.floor(cellsDropped * settings.score.hardDropPerCell * settings.score.globalMultiplier)
}

// 레벨 계산
export const calculateLevel = (totalLines, settings) => {
  const { speed, level } = settings
  const calculatedLevel = Math.floor(totalLines / level.linesPerLevel) + speed.startLevel
  return Math.min(calculatedLevel, speed.maxLevel)
}

// Perfect Clear 감지 (보드가 완전히 비어있는지)
export const isPerfectClear = (board) => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x]) {
        return false
      }
    }
  }
  return true
}

// 액션 이름 가져오기 (화면 표시용)
export const getActionName = (linesCleared, tSpinResult, isBackToBack, isPerfectClear) => {
  const parts = []
  
  if (isBackToBack) {
    parts.push('Back-to-Back')
  }
  
  if (tSpinResult.isTSpin) {
    if (tSpinResult.isMini) {
      parts.push('T-Spin Mini')
    } else {
      parts.push('T-Spin')
    }
  }
  
  const lineNames = ['', 'Single', 'Double', 'Triple', 'Tetris']
  if (linesCleared > 0 && linesCleared <= 4) {
    parts.push(lineNames[linesCleared])
  }
  
  if (isPerfectClear) {
    parts.push('Perfect Clear!')
  }
  
  return parts.join(' ')
}

export default {
  calculateScore,
  calculateSoftDropScore,
  calculateHardDropScore,
  calculateLevel,
  isPerfectClear,
  getActionName,
}

