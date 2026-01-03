import { useEffect, useRef, useCallback } from 'react'

export const useKeyboard = ({
  settings,
  gameStatus,
  onMoveLeft,
  onMoveRight,
  onRotateRight,
  onRotateLeft,
  onRotate180,
  onSoftDrop,
  onHardDrop,
  onHold,
  onPause,
  onResume,
}) => {
  const keysPressed = useRef(new Set())
  const dasTimers = useRef({})
  const arrIntervals = useRef({})
  const softDropInterval = useRef(null)
  
  // 콜백 ref로 저장 (클로저 문제 해결)
  const callbacksRef = useRef({
    onMoveLeft,
    onMoveRight,
    onSoftDrop,
  })
  
  // 콜백 업데이트
  useEffect(() => {
    callbacksRef.current = {
      onMoveLeft,
      onMoveRight,
      onSoftDrop,
    }
  }, [onMoveLeft, onMoveRight, onSoftDrop])

  const { keyBindings, controls } = settings

  // 키가 특정 액션에 매핑되어 있는지 확인
  const isKeyFor = useCallback((key, action) => {
    const bindings = keyBindings[action]
    return bindings && bindings.includes(key)
  }, [keyBindings])

  // DAS/ARR 정리
  const clearDasArr = useCallback((direction) => {
    if (dasTimers.current[direction]) {
      clearTimeout(dasTimers.current[direction])
      delete dasTimers.current[direction]
    }
    if (arrIntervals.current[direction]) {
      clearInterval(arrIntervals.current[direction])
      delete arrIntervals.current[direction]
    }
  }, [])

  // Soft Drop 정리
  const clearSoftDrop = useCallback(() => {
    if (softDropInterval.current) {
      clearInterval(softDropInterval.current)
      softDropInterval.current = null
    }
  }, [])

  // 모든 타이머 정리
  const clearAllTimers = useCallback(() => {
    clearDasArr('left')
    clearDasArr('right')
    clearSoftDrop()
    Object.keys(dasTimers.current).forEach(key => {
      clearTimeout(dasTimers.current[key])
    })
    Object.keys(arrIntervals.current).forEach(key => {
      clearInterval(arrIntervals.current[key])
    })
    dasTimers.current = {}
    arrIntervals.current = {}
  }, [clearDasArr, clearSoftDrop])

  // DAS 시작 (좌우 이동용)
  const startDas = useCallback((direction) => {
    const getMoveFunc = () => direction === 'left' 
      ? callbacksRef.current.onMoveLeft 
      : callbacksRef.current.onMoveRight
    
    // 즉시 한 번 이동
    getMoveFunc()()

    // DAS 타이머 시작
    dasTimers.current[direction] = setTimeout(() => {
      // ARR 시작 (반복 이동, ref 사용으로 항상 최신 콜백 참조)
      arrIntervals.current[direction] = setInterval(() => {
        getMoveFunc()()
      }, controls.arr)
    }, controls.das)
  }, [controls.das, controls.arr])

  // 키 다운 핸들러
  const handleKeyDown = useCallback((e) => {
    // event.code 사용 - 한/영 상관없이 물리적 키 위치 기반
    const code = e.code

    // 이미 눌린 키는 무시 (키 반복 방지)
    if (keysPressed.current.has(code)) {
      return
    }
    keysPressed.current.add(code)

    // 일시정지/재개 토글
    if (isKeyFor(code, 'pause')) {
      e.preventDefault()
      if (gameStatus === 'playing') {
        onPause()
      } else if (gameStatus === 'paused') {
        onResume()
      }
      return
    }

    // 게임 중일 때만 조작
    if (gameStatus !== 'playing') {
      return
    }

    e.preventDefault()

    // 이동 (DAS/ARR 적용)
    if (isKeyFor(code, 'moveLeft')) {
      clearDasArr('right') // 반대 방향 취소
      startDas('left')
      return
    }

    if (isKeyFor(code, 'moveRight')) {
      clearDasArr('left') // 반대 방향 취소
      startDas('right')
      return
    }

    // 회전
    if (isKeyFor(code, 'rotateClockwise')) {
      onRotateRight()
      return
    }

    if (isKeyFor(code, 'rotateCounterClockwise')) {
      onRotateLeft()
      return
    }

    if (isKeyFor(code, 'rotate180')) {
      onRotate180()
      return
    }

    // Soft Drop
    if (isKeyFor(code, 'softDrop')) {
      callbacksRef.current.onSoftDrop()
      // 반복 Soft Drop (ref 사용으로 항상 최신 콜백 참조)
      softDropInterval.current = setInterval(() => {
        callbacksRef.current.onSoftDrop()
      }, controls.softDropSpeed)
      return
    }

    // Hard Drop
    if (isKeyFor(code, 'hardDrop')) {
      onHardDrop()
      return
    }

    // Hold
    if (isKeyFor(code, 'hold')) {
      onHold()
      return
    }
  }, [
    gameStatus,
    isKeyFor,
    onPause,
    onResume,
    onRotateRight,
    onRotateLeft,
    onRotate180,
    onHardDrop,
    onHold,
    startDas,
    clearDasArr,
    controls.softDropSpeed,
  ])

  // 키 업 핸들러
  const handleKeyUp = useCallback((e) => {
    const code = e.code
    keysPressed.current.delete(code)

    // 이동 키 해제
    if (isKeyFor(code, 'moveLeft')) {
      clearDasArr('left')
      return
    }

    if (isKeyFor(code, 'moveRight')) {
      clearDasArr('right')
      return
    }

    // Soft Drop 해제
    if (isKeyFor(code, 'softDrop')) {
      clearSoftDrop()
      return
    }
  }, [isKeyFor, clearDasArr, clearSoftDrop])

  // 포커스 잃을 때 모든 키 해제
  const handleBlur = useCallback(() => {
    keysPressed.current.clear()
    clearAllTimers()
  }, [clearAllTimers])

  // 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
      clearAllTimers()
    }
  }, [handleKeyDown, handleKeyUp, handleBlur, clearAllTimers])

  // 게임 상태 변경 시 타이머 정리
  useEffect(() => {
    if (gameStatus !== 'playing') {
      clearAllTimers()
      keysPressed.current.clear()
    }
  }, [gameStatus, clearAllTimers])

  return null
}

export default useKeyboard

