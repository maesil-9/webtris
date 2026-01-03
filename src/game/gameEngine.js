// 게임 엔진
// 모든 게임 로직을 통합 관리

import { createPiece, getCells, getSpawnPosition } from './tetrominos'
import { checkCollision, tryMove, rotateClockwise, rotateCounterClockwise, rotate180, getHardDropPosition, isOnGround } from './srs'
import { detectTSpin, getTSpinType } from './tSpin'
import { calculateScore, calculateHardDropScore, calculateSoftDropScore, calculateLevel, isPerfectClear, getActionName } from './scoring'
import { BagRandomizer } from './bagRandomizer'

// 빈 보드 생성
export const createBoard = (width, height, bufferHeight = 20) => {
  const totalHeight = height + bufferHeight
  return Array.from({ length: totalHeight }, () => 
    Array.from({ length: width }, () => null)
  )
}

// 블록을 보드에 고정
export const lockPieceToBoard = (board, piece, rotation, position) => {
  const newBoard = board.map(row => [...row])
  const cells = getCells(piece, rotation, position)
  
  for (const cell of cells) {
    if (cell.y >= 0 && cell.y < newBoard.length && cell.x >= 0 && cell.x < newBoard[0].length) {
      newBoard[cell.y][cell.x] = piece.color
    }
  }
  
  return newBoard
}

// 완성된 라인 찾기
export const findCompletedLines = (board) => {
  const completedLines = []
  
  for (let y = 0; y < board.length; y++) {
    if (board[y].every(cell => cell !== null)) {
      completedLines.push(y)
    }
  }
  
  return completedLines
}

// 라인 제거
export const clearLines = (board, linesToClear) => {
  if (linesToClear.length === 0) {
    return board
  }
  
  const newBoard = board.filter((_, index) => !linesToClear.includes(index))
  
  // 위에 빈 줄 추가
  const emptyLines = Array.from({ length: linesToClear.length }, () =>
    Array.from({ length: board[0].length }, () => null)
  )
  
  return [...emptyLines, ...newBoard]
}

// 스폰 가능 여부 확인
export const canSpawn = (board, piece, bufferHeight = 20) => {
  const position = getSpawnPosition(piece, board[0].length, bufferHeight)
  return !checkCollision(board, piece, 0, position)
}

// 게임 엔진 클래스
export class GameEngine {
  constructor(settings) {
    this.settings = settings
    this.randomizer = new BagRandomizer()
    this.reset()
  }
  
  // 리셋
  reset() {
    const { board: boardSettings } = this.settings
    
    this.board = createBoard(boardSettings.width, boardSettings.height, boardSettings.bufferHeight)
    this.currentPiece = null
    this.currentPosition = { x: 0, y: 0 }
    this.currentRotation = 0
    this.holdPiece = null
    this.canHold = true
    this.nextPieces = []
    this.score = 0
    this.level = this.settings.speed.startLevel
    this.lines = 0
    this.combo = -1
    this.lastClearWasTetrisOrTSpin = false
    this.lastAction = null
    this.lastKickIndex = -1
    this.isGameOver = false
    this.lockDelayTimer = null
    this.lockDelayResets = 0
    
    this.randomizer.reset()
    this.fillNextQueue()
  }
  
  // Next 큐 채우기
  fillNextQueue() {
    const count = this.settings.features.nextCount
    while (this.nextPieces.length < count + 1) {
      this.nextPieces.push(this.randomizer.getNext())
    }
  }
  
  // 새 블록 스폰
  spawnPiece() {
    this.fillNextQueue()
    
    const piece = this.nextPieces.shift()
    const { bufferHeight } = this.settings.board
    const position = getSpawnPosition(piece, this.board[0].length, bufferHeight)
    
    // 스폰 위치에서 충돌하면 게임 오버
    if (checkCollision(this.board, piece, 0, position)) {
      this.isGameOver = true
      return false
    }
    
    this.currentPiece = piece
    this.currentPosition = position
    this.currentRotation = 0
    this.canHold = true
    this.lastAction = null
    this.lastKickIndex = -1
    this.lockDelayResets = 0
    
    this.fillNextQueue()
    
    return true
  }
  
  // 이동
  move(dx, dy) {
    if (!this.currentPiece || this.isGameOver) return false
    
    const result = tryMove(this.board, this.currentPiece, this.currentRotation, this.currentPosition, dx, dy)
    
    if (result.success) {
      this.currentPosition = result.position
      this.lastAction = 'move'
      
      // 바닥에서 이동하면 lock delay 리셋
      if (isOnGround(this.board, this.currentPiece, this.currentRotation, this.currentPosition)) {
        this.lockDelayResets = Math.min(this.lockDelayResets + 1, this.settings.lockDelay.maxResets)
      }
      
      return true
    }
    
    return false
  }
  
  // 왼쪽 이동
  moveLeft() {
    return this.move(-1, 0)
  }
  
  // 오른쪽 이동
  moveRight() {
    return this.move(1, 0)
  }
  
  // 아래로 이동 (Soft Drop)
  moveDown() {
    return this.move(0, 1)
  }
  
  // 시계방향 회전
  rotateRight() {
    if (!this.currentPiece || this.isGameOver) return false
    
    const result = rotateClockwise(this.board, this.currentPiece, this.currentRotation, this.currentPosition)
    
    if (result.success) {
      this.currentPosition = result.position
      this.currentRotation = result.rotation
      this.lastAction = 'rotate'
      this.lastKickIndex = result.kickIndex
      
      if (isOnGround(this.board, this.currentPiece, this.currentRotation, this.currentPosition)) {
        this.lockDelayResets = Math.min(this.lockDelayResets + 1, this.settings.lockDelay.maxResets)
      }
      
      return true
    }
    
    return false
  }
  
  // 반시계방향 회전
  rotateLeft() {
    if (!this.currentPiece || this.isGameOver) return false
    
    const result = rotateCounterClockwise(this.board, this.currentPiece, this.currentRotation, this.currentPosition)
    
    if (result.success) {
      this.currentPosition = result.position
      this.currentRotation = result.rotation
      this.lastAction = 'rotate'
      this.lastKickIndex = result.kickIndex
      
      if (isOnGround(this.board, this.currentPiece, this.currentRotation, this.currentPosition)) {
        this.lockDelayResets = Math.min(this.lockDelayResets + 1, this.settings.lockDelay.maxResets)
      }
      
      return true
    }
    
    return false
  }
  
  // 180도 회전
  rotate180() {
    if (!this.currentPiece || this.isGameOver) return false
    
    const result = rotate180(this.board, this.currentPiece, this.currentRotation, this.currentPosition)
    
    if (result.success) {
      this.currentPosition = result.position
      this.currentRotation = result.rotation
      this.lastAction = 'rotate'
      this.lastKickIndex = result.kickIndex
      
      if (isOnGround(this.board, this.currentPiece, this.currentRotation, this.currentPosition)) {
        this.lockDelayResets = Math.min(this.lockDelayResets + 1, this.settings.lockDelay.maxResets)
      }
      
      return true
    }
    
    return false
  }
  
  // Hard Drop
  hardDrop() {
    if (!this.currentPiece || this.isGameOver) return null
    
    const startY = this.currentPosition.y
    const dropPosition = getHardDropPosition(this.board, this.currentPiece, this.currentRotation, this.currentPosition)
    const cellsDropped = dropPosition.y - startY
    
    this.currentPosition = dropPosition
    
    // Hard Drop 점수
    const dropScore = calculateHardDropScore(cellsDropped, this.settings)
    this.score += dropScore
    
    // 즉시 고정
    return this.lockPiece()
  }
  
  // Soft Drop
  softDrop() {
    if (!this.currentPiece || this.isGameOver) return false
    
    if (this.moveDown()) {
      const dropScore = calculateSoftDropScore(1, this.settings)
      this.score += dropScore
      return true
    }
    
    return false
  }
  
  // Hold
  hold() {
    if (!this.currentPiece || !this.canHold || !this.settings.features.holdEnabled || this.isGameOver) {
      return false
    }
    
    const currentType = this.currentPiece.type
    
    if (this.holdPiece) {
      // 홀드된 블록과 교체
      const temp = this.holdPiece
      this.holdPiece = createPiece(currentType)
      this.currentPiece = temp
    } else {
      // 첫 홀드
      this.holdPiece = createPiece(currentType)
      this.spawnPiece()
      // spawnPiece가 nextPieces에서 가져오므로 currentPiece가 이미 설정됨
    }
    
    // 위치 리셋
    if (this.currentPiece) {
      const { bufferHeight } = this.settings.board
      this.currentPosition = getSpawnPosition(this.currentPiece, this.board[0].length, bufferHeight)
      this.currentRotation = 0
    }
    
    this.canHold = false
    this.lastAction = null
    this.lastKickIndex = -1
    
    return true
  }
  
  // 블록 고정
  lockPiece() {
    if (!this.currentPiece || this.isGameOver) return null
    
    // T-Spin 감지
    const tSpinResult = this.lastAction === 'rotate' 
      ? detectTSpin(this.board, this.currentPiece, this.currentRotation, this.currentPosition, this.lastKickIndex > 0, this.lastKickIndex)
      : { isTSpin: false, isMini: false }
    
    // 블록 고정
    this.board = lockPieceToBoard(this.board, this.currentPiece, this.currentRotation, this.currentPosition)
    
    // 라인 클리어
    const completedLines = findCompletedLines(this.board)
    const linesCleared = completedLines.length
    
    if (linesCleared > 0) {
      this.board = clearLines(this.board, completedLines)
    }
    
    // Perfect Clear 확인
    const perfectClear = isPerfectClear(this.board)
    
    // 점수 계산
    const scoreResult = calculateScore({
      linesCleared,
      tSpinResult,
      level: this.level,
      combo: this.combo,
      wasLastClearTetrisOrTSpin: this.lastClearWasTetrisOrTSpin,
      isPerfectClear: perfectClear,
      settings: this.settings,
    })
    
    this.score += scoreResult.totalScore
    this.lines += linesCleared
    
    // 콤보 업데이트
    if (linesCleared > 0) {
      this.combo++
    } else {
      this.combo = -1
    }
    
    // Back-to-Back 상태 업데이트
    if (linesCleared > 0) {
      this.lastClearWasTetrisOrTSpin = scoreResult.isTetrisOrTSpin
    }
    
    // 레벨 계산
    const newLevel = calculateLevel(this.lines, this.settings)
    if (newLevel > this.level) {
      this.level = newLevel
    }
    
    // 액션 이름
    const actionName = linesCleared > 0 || tSpinResult.isTSpin
      ? getActionName(linesCleared, tSpinResult, scoreResult.isBackToBack, perfectClear)
      : null
    
    // 결과 객체
    const result = {
      linesCleared,
      tSpinResult,
      scoreResult,
      actionName,
      isPerfectClear: perfectClear,
      combo: this.combo,
      level: this.level,
    }
    
    // 다음 블록 스폰
    this.currentPiece = null
    
    return result
  }
  
  // Ghost Piece 위치 계산
  getGhostPosition() {
    if (!this.currentPiece || !this.settings.features.ghostEnabled) {
      return null
    }
    
    return getHardDropPosition(this.board, this.currentPiece, this.currentRotation, this.currentPosition)
  }
  
  // 바닥에 있는지 확인
  isOnGround() {
    if (!this.currentPiece) return false
    return isOnGround(this.board, this.currentPiece, this.currentRotation, this.currentPosition)
  }
  
  // 현재 상태 가져오기
  getState() {
    return {
      board: this.board,
      currentPiece: this.currentPiece,
      currentPosition: this.currentPosition,
      currentRotation: this.currentRotation,
      holdPiece: this.holdPiece,
      canHold: this.canHold,
      nextPieces: this.nextPieces.slice(0, this.settings.features.nextCount),
      score: this.score,
      level: this.level,
      lines: this.lines,
      combo: this.combo,
      isGameOver: this.isGameOver,
      ghostPosition: this.getGhostPosition(),
    }
  }
  
  // 보이는 보드만 가져오기 (버퍼 영역 제외)
  getVisibleBoard() {
    const { height, bufferHeight } = this.settings.board
    return this.board.slice(bufferHeight, bufferHeight + height)
  }
  
  // 설정 업데이트
  updateSettings(newSettings) {
    this.settings = newSettings
  }
}

export const createGameEngine = (settings) => {
  return new GameEngine(settings)
}

export default {
  createBoard,
  lockPieceToBoard,
  findCompletedLines,
  clearLines,
  canSpawn,
  GameEngine,
  createGameEngine,
}

