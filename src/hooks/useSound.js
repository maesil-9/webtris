import { useRef, useCallback, useEffect } from 'react'
import { Howl, Howler } from 'howler'

// 사운드 효과 정의 (실제 파일이 없으면 Web Audio로 대체 생성)
const createSoundEffects = () => {
  // Web Audio API를 사용해 간단한 효과음 생성
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  const createBeep = (frequency, duration, type = 'square') => {
    return () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }
  }

  const createNoise = (duration) => {
    return () => {
      const bufferSize = audioContext.sampleRate * duration
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const data = buffer.getChannelData(0)
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      
      const source = audioContext.createBufferSource()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()
      
      source.buffer = buffer
      filter.type = 'lowpass'
      filter.frequency.value = 1000
      
      source.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      source.start()
    }
  }

  return {
    move: createBeep(200, 0.05, 'square'),
    rotate: createBeep(400, 0.08, 'sine'),
    drop: createBeep(150, 0.1, 'triangle'),
    lock: createNoise(0.1),
    clear: createBeep(600, 0.15, 'sine'),
    tetris: createBeep(800, 0.3, 'sawtooth'),
    tSpin: createBeep(700, 0.25, 'square'),
    hold: createBeep(350, 0.08, 'sine'),
    levelUp: createBeep(1000, 0.4, 'sine'),
    gameOver: createBeep(100, 0.5, 'sawtooth'),
  }
}

export const useSound = (settings) => {
  const soundsRef = useRef(null)
  const enabledRef = useRef(settings.sound.enabled)

  // 사운드 초기화
  useEffect(() => {
    if (settings.sound.enabled && !soundsRef.current) {
      try {
        soundsRef.current = createSoundEffects()
      } catch (e) {
        console.warn('Sound initialization failed:', e)
      }
    }
    enabledRef.current = settings.sound.enabled
  }, [settings.sound.enabled])

  // 볼륨 설정
  useEffect(() => {
    Howler.volume(settings.sound.masterVolume * settings.sound.sfxVolume)
  }, [settings.sound.masterVolume, settings.sound.sfxVolume])

  // 효과음 재생
  const play = useCallback((soundName) => {
    if (!enabledRef.current || !soundsRef.current) return
    
    try {
      const sound = soundsRef.current[soundName]
      if (sound) {
        sound()
      }
    } catch (e) {
      // 사운드 재생 실패 무시
    }
  }, [])

  // 이동 효과음
  const playMove = useCallback(() => play('move'), [play])

  // 회전 효과음
  const playRotate = useCallback(() => play('rotate'), [play])

  // 드롭 효과음
  const playDrop = useCallback(() => play('drop'), [play])

  // 고정 효과음
  const playLock = useCallback(() => play('lock'), [play])

  // 라인 클리어 효과음
  const playClear = useCallback((lines, isTSpin) => {
    if (isTSpin) {
      play('tSpin')
    } else if (lines === 4) {
      play('tetris')
    } else if (lines > 0) {
      play('clear')
    }
  }, [play])

  // 홀드 효과음
  const playHold = useCallback(() => play('hold'), [play])

  // 레벨업 효과음
  const playLevelUp = useCallback(() => play('levelUp'), [play])

  // 게임오버 효과음
  const playGameOver = useCallback(() => play('gameOver'), [play])

  return {
    playMove,
    playRotate,
    playDrop,
    playLock,
    playClear,
    playHold,
    playLevelUp,
    playGameOver,
  }
}

export default useSound

