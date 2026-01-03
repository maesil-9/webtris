// 기본 게임 설정값
export const defaultSettings = {
  // 점수 설정
  score: {
    globalMultiplier: 1.0,      // 전체 점수 배율
    single: 100,                // Single 기본 점수
    double: 300,                // Double 기본 점수
    triple: 500,                // Triple 기본 점수
    tetris: 800,                // Tetris 기본 점수
    tSpinMini: 200,             // T-Spin Mini
    tSpinSingle: 800,           // T-Spin Single
    tSpinDouble: 1200,          // T-Spin Double
    tSpinTriple: 1600,          // T-Spin Triple
    perfectClear: 3000,         // Perfect Clear 보너스
    softDropPerCell: 0,         // Soft Drop 셀당 점수 (0 = 비활성화)
    hardDropPerCell: 2,         // Hard Drop 셀당 점수
  },
  
  // 보너스 설정
  bonus: {
    backToBackEnabled: true,    // Back-to-Back 활성화
    backToBackMultiplier: 1.5,  // Back-to-Back 배율
    tSpinEnabled: true,         // T-Spin 보너스 활성화
    comboEnabled: true,         // 콤보 보너스 활성화
    comboMultiplier: 50,        // 콤보당 추가 점수
  },
  
  // 속도 설정
  speed: {
    startLevel: 1,              // 시작 레벨
    maxLevel: 15,               // 최대 레벨
    baseDropInterval: 1000,     // 레벨1 낙하 간격 (ms)
    speedMultiplier: 1.0,       // 전체 속도 배율
    levelSpeedCurve: 'standard' // 속도 곡선 (standard/gentle/aggressive)
  },
  
  // Lock Delay 설정
  lockDelay: {
    duration: 500,              // Lock Delay 시간 (ms)
    maxResets: 15,              // 최대 리셋 횟수
    enabled: true               // Lock Delay 활성화
  },
  
  // 조작 설정
  controls: {
    das: 170,                   // Delayed Auto Shift (ms)
    arr: 50,                    // Auto Repeat Rate (ms)
    softDropSpeed: 50,          // Soft Drop 속도 (ms)
  },
  
  // 레벨 설정
  level: {
    linesPerLevel: 10,          // 레벨업 필요 라인 수
    levelMultiplier: 1.0,       // 레벨 점수 배율 적용
  },
  
  // 보드 설정
  board: {
    width: 10,                  // 보드 가로 크기
    height: 20,                 // 보드 세로 크기 (보이는 부분)
    bufferHeight: 20,           // 버퍼 영역 (위쪽 숨김)
  },
  
  // 게임 기능 설정
  features: {
    holdEnabled: true,          // Hold 기능 활성화
    ghostEnabled: true,         // Ghost Piece 활성화
    nextCount: 5,               // Next 미리보기 개수 (1-6)
  },
  
  // 사운드 설정
  sound: {
    masterVolume: 0.7,          // 마스터 볼륨
    sfxVolume: 1.0,             // 효과음 볼륨
    bgmVolume: 0.5,             // 배경음악 볼륨
    enabled: true               // 사운드 활성화
  },

  // 키 매핑 설정
  keyBindings: {
    moveLeft: ['ArrowLeft'],
    moveRight: ['ArrowRight'],
    softDrop: ['ArrowDown'],
    hardDrop: ['Space', ' '],
    rotateClockwise: ['ArrowUp', 'x', 'X'],
    rotateCounterClockwise: ['z', 'Z', 'Control'],
    rotate180: ['a', 'A'],
    hold: ['c', 'C'],
    pause: ['Escape', 'p', 'P'],
  }
}

// 속도 곡선 계산 함수
export const getDropInterval = (level, settings) => {
  const { baseDropInterval, speedMultiplier, levelSpeedCurve } = settings.speed
  
  let multiplier
  switch (levelSpeedCurve) {
    case 'gentle':
      multiplier = Math.pow(0.9, level - 1)
      break
    case 'aggressive':
      multiplier = Math.pow(0.75, level - 1)
      break
    case 'standard':
    default:
      // 공식 테트리스 가이드라인에 가까운 속도 곡선
      multiplier = Math.pow(0.8 - ((level - 1) * 0.007), level - 1)
      break
  }
  
  const interval = baseDropInterval * multiplier / speedMultiplier
  return Math.max(interval, 16) // 최소 16ms (약 60fps)
}

export default defaultSettings

