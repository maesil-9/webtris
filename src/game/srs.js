// Super Rotation System (SRS)
// 공식 테트리스 가이드라인 회전 시스템

import { getShape, getCells } from './tetrominos'

// Wall Kick 데이터
// J, L, S, T, Z 블록용 (3x3 블록)
const WALL_KICKS_JLSTZ = {
  '0->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '1->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '1->2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '2->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '2->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '3->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '3->0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '0->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
}

// I 블록용 Wall Kick (4x4 블록)
const WALL_KICKS_I = {
  '0->1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
  '1->0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  '1->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
  '2->1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
  '2->3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
  '3->2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
  '3->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
  '0->3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
}

// O 블록은 회전하지 않음 (wall kick 없음)
const WALL_KICKS_O = {
  '0->1': [{ x: 0, y: 0 }],
  '1->0': [{ x: 0, y: 0 }],
  '1->2': [{ x: 0, y: 0 }],
  '2->1': [{ x: 0, y: 0 }],
  '2->3': [{ x: 0, y: 0 }],
  '3->2': [{ x: 0, y: 0 }],
  '3->0': [{ x: 0, y: 0 }],
  '0->3': [{ x: 0, y: 0 }],
}

// 180도 회전용 Wall Kick 데이터
const WALL_KICKS_180_JLSTZ = {
  '0->2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: -1, y: 0 }, { x: -2, y: 0 }, { x: -1, y: 1 }, { x: -2, y: 1 }, { x: 0, y: -1 }, { x: 3, y: 0 }, { x: -3, y: 0 }],
  '2->0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }, { x: -1, y: -1 }, { x: -2, y: -1 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: -1 }, { x: 2, y: -1 }, { x: 0, y: 1 }, { x: -3, y: 0 }, { x: 3, y: 0 }],
  '1->3': [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: -1, y: 1 }, { x: -1, y: 2 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: -1, y: -1 }, { x: -1, y: -2 }, { x: 1, y: 0 }, { x: 0, y: 3 }, { x: 0, y: -3 }],
  '3->1': [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 1, y: -1 }, { x: 1, y: -2 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: -1, y: 0 }, { x: 0, y: -3 }, { x: 0, y: 3 }],
}

const WALL_KICKS_180_I = {
  '0->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }],
  '2->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }, { x: 0, y: -1 }],
  '1->3': [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: -1, y: 0 }],
  '3->1': [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 0 }],
}

// 블록 타입에 따른 Wall Kick 데이터 가져오기
const getWallKicks = (pieceType, fromRotation, toRotation) => {
  const key = `${fromRotation}->${toRotation}`
  
  // 180도 회전인지 확인
  const is180 = Math.abs(toRotation - fromRotation) === 2 || Math.abs(toRotation - fromRotation) === 2
  
  if (pieceType === 'O') {
    return WALL_KICKS_O[key] || [{ x: 0, y: 0 }]
  }
  
  if (pieceType === 'I') {
    if (is180) {
      return WALL_KICKS_180_I[key] || [{ x: 0, y: 0 }]
    }
    return WALL_KICKS_I[key] || [{ x: 0, y: 0 }]
  }
  
  if (is180) {
    return WALL_KICKS_180_JLSTZ[key] || [{ x: 0, y: 0 }]
  }
  return WALL_KICKS_JLSTZ[key] || [{ x: 0, y: 0 }]
}

// 충돌 감지
export const checkCollision = (board, piece, rotation, position) => {
  const cells = getCells(piece, rotation, position)
  const boardHeight = board.length
  const boardWidth = board[0].length
  
  for (const cell of cells) {
    // 보드 경계 체크
    if (cell.x < 0 || cell.x >= boardWidth) {
      return true
    }
    if (cell.y >= boardHeight) {
      return true
    }
    // 위쪽 경계는 허용 (스폰 영역)
    if (cell.y < 0) {
      continue
    }
    // 다른 블록과 충돌 체크
    if (board[cell.y][cell.x]) {
      return true
    }
  }
  
  return false
}

// 회전 시도 (SRS Wall Kick 적용)
export const tryRotate = (board, piece, currentRotation, targetRotation, currentPosition) => {
  const normalizedCurrent = ((currentRotation % 4) + 4) % 4
  const normalizedTarget = ((targetRotation % 4) + 4) % 4
  
  const wallKicks = getWallKicks(piece.type, normalizedCurrent, normalizedTarget)
  
  for (let i = 0; i < wallKicks.length; i++) {
    const kick = wallKicks[i]
    const newPosition = {
      x: currentPosition.x + kick.x,
      y: currentPosition.y + kick.y,
    }
    
    if (!checkCollision(board, piece, normalizedTarget, newPosition)) {
      return {
        success: true,
        position: newPosition,
        rotation: normalizedTarget,
        kickIndex: i, // 어떤 kick이 사용됐는지 (T-Spin 감지용)
        wasKick: i > 0, // 첫 번째(기본 위치)가 아니면 kick 사용
      }
    }
  }
  
  return {
    success: false,
    position: currentPosition,
    rotation: currentRotation,
    kickIndex: -1,
    wasKick: false,
  }
}

// 시계방향 회전
export const rotateClockwise = (board, piece, currentRotation, currentPosition) => {
  const targetRotation = (currentRotation + 1) % 4
  return tryRotate(board, piece, currentRotation, targetRotation, currentPosition)
}

// 반시계방향 회전
export const rotateCounterClockwise = (board, piece, currentRotation, currentPosition) => {
  const targetRotation = (currentRotation + 3) % 4 // +3 = -1 in mod 4
  return tryRotate(board, piece, currentRotation, targetRotation, currentPosition)
}

// 180도 회전
export const rotate180 = (board, piece, currentRotation, currentPosition) => {
  const targetRotation = (currentRotation + 2) % 4
  return tryRotate(board, piece, currentRotation, targetRotation, currentPosition)
}

// 이동 시도
export const tryMove = (board, piece, rotation, currentPosition, dx, dy) => {
  const newPosition = {
    x: currentPosition.x + dx,
    y: currentPosition.y + dy,
  }
  
  if (!checkCollision(board, piece, rotation, newPosition)) {
    return {
      success: true,
      position: newPosition,
    }
  }
  
  return {
    success: false,
    position: currentPosition,
  }
}

// Hard Drop 위치 계산
export const getHardDropPosition = (board, piece, rotation, currentPosition) => {
  let position = { ...currentPosition }
  
  while (!checkCollision(board, piece, rotation, { x: position.x, y: position.y + 1 })) {
    position.y += 1
  }
  
  return position
}

// 바닥에 닿았는지 확인
export const isOnGround = (board, piece, rotation, position) => {
  return checkCollision(board, piece, rotation, { x: position.x, y: position.y + 1 })
}

export default {
  checkCollision,
  tryRotate,
  rotateClockwise,
  rotateCounterClockwise,
  rotate180,
  tryMove,
  getHardDropPosition,
  isOnGround,
}

