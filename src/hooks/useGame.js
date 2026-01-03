import { useState, useCallback, useRef, useEffect } from 'react'
import { GameEngine } from '../game/gameEngine'
import { getDropInterval } from '../config/defaultSettings'
import { loadHighScore, saveHighScore } from '../utils/storage'

export const useGame = (settings) => {
  const [gameState, setGameState] = useState({
    status: 'idle', // 'idle' | 'playing' | 'paused' | 'gameover'
    board: null,
    currentPiece: null,
    currentPosition: { x: 0, y: 0 },
    currentRotation: 0,
    holdPiece: null,
    canHold: true,
    nextPieces: [],
    score: 0,
    level: 1,
    lines: 0,
    combo: -1,
    ghostPosition: null,
    actionName: null,
    stats: {
      piecesPlaced: 0,
      singles: 0,
      doubles: 0,
      triples: 0,
      tetrises: 0,
      tSpins: 0,
      tSpinMinis: 0,
      perfectClears: 0,
      maxCombo: 0,
    },
  })

  const engineRef = useRef(null)
  const dropTimerRef = useRef(null)
  const lockTimerRef = useRef(null)
  const actionTimerRef = useRef(null)
  const startTimeRef = useRef(null)
  const highScoreRef = useRef(loadHighScore())
  const gameStatusRef = useRef(gameState.status)
  const levelRef = useRef(gameState.level)
  
  // 상태 ref 동기화
  useEffect(() => {
    gameStatusRef.current = gameState.status
  }, [gameState.status])
  
  useEffect(() => {
    levelRef.current = gameState.level
  }, [gameState.level])

  // 게임 엔진 초기화
  const initEngine = useCallback(() => {
    engineRef.current = new GameEngine(settings)
  }, [settings])

  // 상태 동기화
  const syncState = useCallback(() => {
    if (!engineRef.current) return

    const state = engineRef.current.getState()
    setGameState(prev => ({
      ...prev,
      board: state.board,
      currentPiece: state.currentPiece,
      currentPosition: state.currentPosition,
      currentRotation: state.currentRotation,
      holdPiece: state.holdPiece,
      canHold: state.canHold,
      nextPieces: state.nextPieces,
      score: state.score,
      level: state.level,
      lines: state.lines,
      combo: state.combo,
      ghostPosition: state.ghostPosition,
    }))
  }, [])

  // 타이머 정리
  const clearTimers = useCallback(() => {
    if (dropTimerRef.current) {
      clearInterval(dropTimerRef.current)
      dropTimerRef.current = null
    }
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current)
      lockTimerRef.current = null
    }
    if (actionTimerRef.current) {
      clearTimeout(actionTimerRef.current)
      actionTimerRef.current = null
    }
  }, [])

  // 낙하 타이머 시작
  const startDropTimer = useCallback(() => {
    if (dropTimerRef.current) {
      clearInterval(dropTimerRef.current)
    }

    const interval = getDropInterval(levelRef.current, settings)
    
    dropTimerRef.current = setInterval(() => {
      // ref를 사용하여 항상 최신 상태 참조
      if (engineRef.current && gameStatusRef.current === 'playing') {
        const moved = engineRef.current.moveDown()
        
        if (!moved && engineRef.current.isOnGround()) {
          // Lock Delay 시작
          startLockTimer()
        }
        
        syncState()
      }
    }, interval)
  }, [settings, syncState])

  // Lock 타이머 시작
  const startLockTimer = useCallback(() => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current)
    }

    if (!settings.lockDelay.enabled) {
      // Lock Delay 비활성화 시 즉시 고정
      handleLock()
      return
    }

    lockTimerRef.current = setTimeout(() => {
      if (engineRef.current && engineRef.current.isOnGround()) {
        handleLock()
      }
    }, settings.lockDelay.duration)
  }, [settings.lockDelay])

  // 블록 고정 처리
  const handleLock = useCallback(() => {
    if (!engineRef.current) return

    const result = engineRef.current.lockPiece()
    
    if (result) {
      // 액션 이름 표시
      if (result.actionName) {
        setGameState(prev => ({ ...prev, actionName: result.actionName }))
        
        // 3초 후 액션 이름 제거
        if (actionTimerRef.current) {
          clearTimeout(actionTimerRef.current)
        }
        actionTimerRef.current = setTimeout(() => {
          setGameState(prev => ({ ...prev, actionName: null }))
        }, 2000)
      }

      // 통계 업데이트
      setGameState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          piecesPlaced: prev.stats.piecesPlaced + 1,
          singles: prev.stats.singles + (result.linesCleared === 1 && !result.tSpinResult.isTSpin ? 1 : 0),
          doubles: prev.stats.doubles + (result.linesCleared === 2 && !result.tSpinResult.isTSpin ? 1 : 0),
          triples: prev.stats.triples + (result.linesCleared === 3 && !result.tSpinResult.isTSpin ? 1 : 0),
          tetrises: prev.stats.tetrises + (result.linesCleared === 4 ? 1 : 0),
          tSpins: prev.stats.tSpins + (result.tSpinResult.isTSpin && !result.tSpinResult.isMini ? 1 : 0),
          tSpinMinis: prev.stats.tSpinMinis + (result.tSpinResult.isMini ? 1 : 0),
          perfectClears: prev.stats.perfectClears + (result.isPerfectClear ? 1 : 0),
          maxCombo: Math.max(prev.stats.maxCombo, result.combo),
        },
      }))
    }

    // 다음 블록 스폰
    if (!engineRef.current.spawnPiece()) {
      // 게임 오버
      handleGameOver()
      return
    }

    syncState()
    
    // 낙하 타이머 재시작 (레벨 변경 반영)
    startDropTimer()
  }, [syncState, startDropTimer])

  // 게임 오버 처리
  const handleGameOver = useCallback(() => {
    clearTimers()
    gameStatusRef.current = 'gameover'
    
    const finalScore = engineRef.current?.score || 0
    const isNewHighScore = finalScore > highScoreRef.current
    
    if (isNewHighScore) {
      saveHighScore(finalScore)
      highScoreRef.current = finalScore
    }

    setGameState(prev => ({
      ...prev,
      status: 'gameover',
    }))
  }, [clearTimers])

  // 게임 시작
  const startGame = useCallback(() => {
    clearTimers()
    initEngine()
    
    if (engineRef.current) {
      engineRef.current.spawnPiece()
      
      // ref를 먼저 업데이트 (setInterval에서 즉시 참조 가능하도록)
      gameStatusRef.current = 'playing'
      levelRef.current = settings.speed.startLevel
      
      setGameState(prev => ({
        ...prev,
        status: 'playing',
        actionName: null,
        stats: {
          piecesPlaced: 0,
          singles: 0,
          doubles: 0,
          triples: 0,
          tetrises: 0,
          tSpins: 0,
          tSpinMinis: 0,
          perfectClears: 0,
          maxCombo: 0,
        },
      }))
      
      syncState()
      startTimeRef.current = Date.now()
      startDropTimer()
    }
  }, [clearTimers, initEngine, syncState, startDropTimer, settings.speed.startLevel])

  // 일시정지
  const pauseGame = useCallback(() => {
    if (gameState.status === 'playing') {
      clearTimers()
      gameStatusRef.current = 'paused'
      setGameState(prev => ({ ...prev, status: 'paused' }))
    }
  }, [gameState.status, clearTimers])

  // 재개
  const resumeGame = useCallback(() => {
    if (gameState.status === 'paused') {
      gameStatusRef.current = 'playing'
      setGameState(prev => ({ ...prev, status: 'playing' }))
      startDropTimer()
    }
  }, [gameState.status, startDropTimer])

  // 리셋
  const resetGame = useCallback(() => {
    clearTimers()
    gameStatusRef.current = 'idle'
    levelRef.current = 1
    setGameState({
      status: 'idle',
      board: null,
      currentPiece: null,
      currentPosition: { x: 0, y: 0 },
      currentRotation: 0,
      holdPiece: null,
      canHold: true,
      nextPieces: [],
      score: 0,
      level: 1,
      lines: 0,
      combo: -1,
      ghostPosition: null,
      actionName: null,
      stats: {
        piecesPlaced: 0,
        singles: 0,
        doubles: 0,
        triples: 0,
        tetrises: 0,
        tSpins: 0,
        tSpinMinis: 0,
        perfectClears: 0,
        maxCombo: 0,
      },
    })
  }, [clearTimers])

  // 이동
  const moveLeft = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      engineRef.current.moveLeft()
      syncState()
    }
  }, [gameState.status, syncState])

  const moveRight = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      engineRef.current.moveRight()
      syncState()
    }
  }, [gameState.status, syncState])

  // 회전
  const rotateRight = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      engineRef.current.rotateRight()
      syncState()
    }
  }, [gameState.status, syncState])

  const rotateLeft = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      engineRef.current.rotateLeft()
      syncState()
    }
  }, [gameState.status, syncState])

  const rotate180 = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      engineRef.current.rotate180()
      syncState()
    }
  }, [gameState.status, syncState])

  // Soft Drop
  const softDrop = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      engineRef.current.softDrop()
      syncState()
    }
  }, [gameState.status, syncState])

  // Hard Drop
  const hardDrop = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      // Lock 타이머 취소
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current)
        lockTimerRef.current = null
      }

      const result = engineRef.current.hardDrop()
      
      if (result) {
        // 액션 이름 표시
        if (result.actionName) {
          setGameState(prev => ({ ...prev, actionName: result.actionName }))
          
          if (actionTimerRef.current) {
            clearTimeout(actionTimerRef.current)
          }
          actionTimerRef.current = setTimeout(() => {
            setGameState(prev => ({ ...prev, actionName: null }))
          }, 2000)
        }

        // 통계 업데이트
        setGameState(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            piecesPlaced: prev.stats.piecesPlaced + 1,
            singles: prev.stats.singles + (result.linesCleared === 1 && !result.tSpinResult.isTSpin ? 1 : 0),
            doubles: prev.stats.doubles + (result.linesCleared === 2 && !result.tSpinResult.isTSpin ? 1 : 0),
            triples: prev.stats.triples + (result.linesCleared === 3 && !result.tSpinResult.isTSpin ? 1 : 0),
            tetrises: prev.stats.tetrises + (result.linesCleared === 4 ? 1 : 0),
            tSpins: prev.stats.tSpins + (result.tSpinResult.isTSpin && !result.tSpinResult.isMini ? 1 : 0),
            tSpinMinis: prev.stats.tSpinMinis + (result.tSpinResult.isMini ? 1 : 0),
            perfectClears: prev.stats.perfectClears + (result.isPerfectClear ? 1 : 0),
            maxCombo: Math.max(prev.stats.maxCombo, result.combo),
          },
        }))
      }

      // 다음 블록 스폰
      if (!engineRef.current.spawnPiece()) {
        handleGameOver()
        return
      }

      syncState()
      startDropTimer()
    }
  }, [gameState.status, syncState, startDropTimer, handleGameOver])

  // Hold
  const hold = useCallback(() => {
    if (engineRef.current && gameState.status === 'playing') {
      engineRef.current.hold()
      syncState()
    }
  }, [gameState.status, syncState])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  // 레벨 변경 시 낙하 속도 업데이트
  useEffect(() => {
    if (gameState.status === 'playing') {
      startDropTimer()
    }
  }, [gameState.level])

  return {
    gameState,
    highScore: highScoreRef.current,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    moveLeft,
    moveRight,
    rotateRight,
    rotateLeft,
    rotate180,
    softDrop,
    hardDrop,
    hold,
  }
}

export default useGame

