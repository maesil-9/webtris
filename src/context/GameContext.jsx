import { createContext, useContext, useReducer, useCallback } from 'react'

const GameContext = createContext(null)

const initialState = {
  // 게임 상태
  status: 'idle', // 'idle' | 'playing' | 'paused' | 'gameover'
  
  // 게임 보드 (null로 초기화, 게임 시작 시 설정)
  board: null,
  
  // 현재 블록
  currentPiece: null,
  currentPosition: { x: 0, y: 0 },
  currentRotation: 0,
  
  // Hold 블록
  holdPiece: null,
  canHold: true,
  
  // 다음 블록들
  nextPieces: [],
  
  // 점수 및 통계
  score: 0,
  level: 1,
  lines: 0,
  combo: -1,
  
  // 특수 상태
  lastAction: null, // 마지막 액션 (T-Spin 감지용)
  lastClearWasTetrisOrTSpin: false, // Back-to-Back 판정용
  
  // Lock Delay
  lockDelayActive: false,
  lockDelayResets: 0,
  
  // 통계
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
    totalTime: 0,
  },
}

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        status: 'playing',
        board: action.payload.board,
        currentPiece: action.payload.currentPiece,
        currentPosition: action.payload.currentPosition,
        nextPieces: action.payload.nextPieces,
        level: action.payload.startLevel || 1,
      }
    
    case 'SET_CURRENT_PIECE':
      return {
        ...state,
        currentPiece: action.payload.piece,
        currentPosition: action.payload.position,
        currentRotation: 0,
        lastAction: null,
      }
    
    case 'MOVE_PIECE':
      return {
        ...state,
        currentPosition: action.payload.position,
        lockDelayResets: state.lockDelayActive 
          ? Math.min(state.lockDelayResets + 1, 15) 
          : state.lockDelayResets,
      }
    
    case 'ROTATE_PIECE':
      return {
        ...state,
        currentPosition: action.payload.position,
        currentRotation: action.payload.rotation,
        lastAction: action.payload.wasKick ? 'kick' : 'rotate',
        lockDelayResets: state.lockDelayActive 
          ? Math.min(state.lockDelayResets + 1, 15) 
          : state.lockDelayResets,
      }
    
    case 'LOCK_PIECE':
      return {
        ...state,
        board: action.payload.board,
        canHold: true,
        lockDelayActive: false,
        lockDelayResets: 0,
        stats: {
          ...state.stats,
          piecesPlaced: state.stats.piecesPlaced + 1,
        },
      }
    
    case 'CLEAR_LINES':
      return {
        ...state,
        board: action.payload.board,
        score: state.score + action.payload.scoreGained,
        lines: state.lines + action.payload.linesCleared,
        level: action.payload.newLevel || state.level,
        combo: action.payload.linesCleared > 0 ? state.combo + 1 : -1,
        lastClearWasTetrisOrTSpin: action.payload.isTetrisOrTSpin,
        stats: {
          ...state.stats,
          singles: state.stats.singles + (action.payload.linesCleared === 1 && !action.payload.isTSpin ? 1 : 0),
          doubles: state.stats.doubles + (action.payload.linesCleared === 2 && !action.payload.isTSpin ? 1 : 0),
          triples: state.stats.triples + (action.payload.linesCleared === 3 && !action.payload.isTSpin ? 1 : 0),
          tetrises: state.stats.tetrises + (action.payload.linesCleared === 4 ? 1 : 0),
          tSpins: state.stats.tSpins + (action.payload.isTSpin && !action.payload.isMini ? 1 : 0),
          tSpinMinis: state.stats.tSpinMinis + (action.payload.isMini ? 1 : 0),
          perfectClears: state.stats.perfectClears + (action.payload.isPerfectClear ? 1 : 0),
          maxCombo: Math.max(state.stats.maxCombo, state.combo + 1),
        },
      }
    
    case 'HOLD_PIECE':
      return {
        ...state,
        holdPiece: action.payload.holdPiece,
        currentPiece: action.payload.currentPiece,
        currentPosition: action.payload.currentPosition,
        currentRotation: 0,
        canHold: false,
        lastAction: null,
      }
    
    case 'UPDATE_NEXT_PIECES':
      return {
        ...state,
        nextPieces: action.payload.nextPieces,
      }
    
    case 'SET_LOCK_DELAY':
      return {
        ...state,
        lockDelayActive: action.payload.active,
      }
    
    case 'ADD_SCORE':
      return {
        ...state,
        score: state.score + action.payload.score,
      }
    
    case 'PAUSE':
      return {
        ...state,
        status: 'paused',
      }
    
    case 'RESUME':
      return {
        ...state,
        status: 'playing',
      }
    
    case 'GAME_OVER':
      return {
        ...state,
        status: 'gameover',
        stats: {
          ...state.stats,
          totalTime: action.payload?.totalTime || state.stats.totalTime,
        },
      }
    
    case 'RESET':
      return initialState
    
    default:
      return state
  }
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  
  const startGame = useCallback((payload) => {
    dispatch({ type: 'START_GAME', payload })
  }, [])
  
  const setCurrentPiece = useCallback((piece, position) => {
    dispatch({ type: 'SET_CURRENT_PIECE', payload: { piece, position } })
  }, [])
  
  const movePiece = useCallback((position) => {
    dispatch({ type: 'MOVE_PIECE', payload: { position } })
  }, [])
  
  const rotatePiece = useCallback((position, rotation, wasKick = false) => {
    dispatch({ type: 'ROTATE_PIECE', payload: { position, rotation, wasKick } })
  }, [])
  
  const lockPiece = useCallback((board) => {
    dispatch({ type: 'LOCK_PIECE', payload: { board } })
  }, [])
  
  const clearLines = useCallback((payload) => {
    dispatch({ type: 'CLEAR_LINES', payload })
  }, [])
  
  const holdPiece = useCallback((holdPiece, currentPiece, currentPosition) => {
    dispatch({ type: 'HOLD_PIECE', payload: { holdPiece, currentPiece, currentPosition } })
  }, [])
  
  const updateNextPieces = useCallback((nextPieces) => {
    dispatch({ type: 'UPDATE_NEXT_PIECES', payload: { nextPieces } })
  }, [])
  
  const setLockDelay = useCallback((active) => {
    dispatch({ type: 'SET_LOCK_DELAY', payload: { active } })
  }, [])
  
  const addScore = useCallback((score) => {
    dispatch({ type: 'ADD_SCORE', payload: { score } })
  }, [])
  
  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' })
  }, [])
  
  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' })
  }, [])
  
  const gameOver = useCallback((totalTime) => {
    dispatch({ type: 'GAME_OVER', payload: { totalTime } })
  }, [])
  
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])
  
  const value = {
    ...state,
    startGame,
    setCurrentPiece,
    movePiece,
    rotatePiece,
    lockPiece,
    clearLines,
    holdPiece,
    updateNextPieces,
    setLockDelay,
    addScore,
    pause,
    resume,
    gameOver,
    reset,
  }
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export default GameContext

