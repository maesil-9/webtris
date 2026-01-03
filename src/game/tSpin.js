// T-Spin 감지 로직
// 공식 테트리스 가이드라인 기준

/**
 * T-Spin 판정 조건:
 * 1. T 블록만 해당
 * 2. 마지막 동작이 회전이어야 함
 * 3. T 블록 중심 기준 4개 코너 중 3개 이상이 채워져 있어야 함
 * 4. T-Spin vs T-Spin Mini 판정:
 *    - T블록의 "앞쪽" 2개 코너가 모두 채워져 있으면 T-Spin
 *    - 그렇지 않으면 T-Spin Mini
 *    - 단, 5번째 wall kick을 사용한 경우 무조건 T-Spin
 */

// T블록의 회전 상태별 코너 위치 (중심 기준 상대 좌표)
// 각 회전 상태에서 앞쪽 2개 코너와 뒤쪽 2개 코너 정의
const T_CORNERS = {
  // 0도: T가 위를 향함 (▲ 모양)
  0: {
    front: [{ x: 0, y: 0 }, { x: 2, y: 0 }],  // 위쪽 2개
    back: [{ x: 0, y: 2 }, { x: 2, y: 2 }],   // 아래쪽 2개
  },
  // 90도: T가 오른쪽을 향함 (▶ 모양)
  1: {
    front: [{ x: 2, y: 0 }, { x: 2, y: 2 }],  // 오른쪽 2개
    back: [{ x: 0, y: 0 }, { x: 0, y: 2 }],   // 왼쪽 2개
  },
  // 180도: T가 아래를 향함 (▼ 모양)
  2: {
    front: [{ x: 0, y: 2 }, { x: 2, y: 2 }],  // 아래쪽 2개
    back: [{ x: 0, y: 0 }, { x: 2, y: 0 }],   // 위쪽 2개
  },
  // 270도: T가 왼쪽을 향함 (◀ 모양)
  3: {
    front: [{ x: 0, y: 0 }, { x: 0, y: 2 }],  // 왼쪽 2개
    back: [{ x: 2, y: 0 }, { x: 2, y: 2 }],   // 오른쪽 2개
  },
}

// 코너가 채워져 있는지 확인
const isCornerFilled = (board, position, corner) => {
  const x = position.x + corner.x
  const y = position.y + corner.y
  
  // 보드 밖이면 채워진 것으로 간주
  if (x < 0 || x >= board[0].length || y < 0 || y >= board.length) {
    return true
  }
  
  return board[y][x] !== null && board[y][x] !== 0
}

// T-Spin 감지
export const detectTSpin = (board, piece, rotation, position, wasKick, kickIndex) => {
  // T 블록만 T-Spin 가능
  if (piece.type !== 'T') {
    return {
      isTSpin: false,
      isMini: false,
    }
  }
  
  // 마지막 동작이 회전이 아니면 T-Spin 아님
  // (wasKick 또는 회전 여부는 호출하는 쪽에서 관리)
  
  const normalizedRotation = ((rotation % 4) + 4) % 4
  const corners = T_CORNERS[normalizedRotation]
  
  // 4개 코너 중 채워진 개수 확인
  const allCorners = [...corners.front, ...corners.back]
  let filledCount = 0
  
  for (const corner of allCorners) {
    if (isCornerFilled(board, position, corner)) {
      filledCount++
    }
  }
  
  // 3개 이상 채워져야 T-Spin
  if (filledCount < 3) {
    return {
      isTSpin: false,
      isMini: false,
    }
  }
  
  // 앞쪽 2개 코너 확인
  const frontFilled = corners.front.every(corner => 
    isCornerFilled(board, position, corner)
  )
  
  // 5번째 wall kick (kickIndex === 4)을 사용한 경우 무조건 T-Spin
  const usedLastKick = kickIndex === 4
  
  // T-Spin vs T-Spin Mini 판정
  if (frontFilled || usedLastKick) {
    return {
      isTSpin: true,
      isMini: false,
    }
  }
  
  return {
    isTSpin: true,
    isMini: true,
  }
}

// T-Spin 타입 문자열 반환
export const getTSpinType = (tSpinResult, linesCleared) => {
  if (!tSpinResult.isTSpin) {
    return null
  }
  
  if (tSpinResult.isMini) {
    if (linesCleared === 0) return 'T-Spin Mini'
    if (linesCleared === 1) return 'T-Spin Mini Single'
    if (linesCleared === 2) return 'T-Spin Mini Double'
  }
  
  if (linesCleared === 0) return 'T-Spin'
  if (linesCleared === 1) return 'T-Spin Single'
  if (linesCleared === 2) return 'T-Spin Double'
  if (linesCleared === 3) return 'T-Spin Triple'
  
  return 'T-Spin'
}

export default {
  detectTSpin,
  getTSpinType,
}

