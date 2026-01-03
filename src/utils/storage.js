const STORAGE_KEYS = {
  SETTINGS: 'webtris_settings',
  LEADERBOARD: 'webtris_leaderboard',
  HIGH_SCORE: 'webtris_highscore',
}

// 설정 저장/불러오기
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    return true
  } catch (error) {
    console.error('Failed to save settings:', error)
    return false
  }
}

export const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Failed to load settings:', error)
    return null
  }
}

export const clearSettings = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    return true
  } catch (error) {
    console.error('Failed to clear settings:', error)
    return false
  }
}

// 리더보드 저장/불러오기
export const saveLeaderboard = (leaderboard) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard))
    return true
  } catch (error) {
    console.error('Failed to save leaderboard:', error)
    return false
  }
}

export const loadLeaderboard = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
    return []
  }
}

export const addToLeaderboard = (entry) => {
  const leaderboard = loadLeaderboard()
  
  const newEntry = {
    ...entry,
    id: Date.now(),
    date: new Date().toISOString(),
  }
  
  leaderboard.push(newEntry)
  
  // 점수 기준 내림차순 정렬하고 상위 100개만 유지
  leaderboard.sort((a, b) => b.score - a.score)
  const trimmed = leaderboard.slice(0, 100)
  
  saveLeaderboard(trimmed)
  return trimmed
}

export const clearLeaderboard = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD)
    return true
  } catch (error) {
    console.error('Failed to clear leaderboard:', error)
    return false
  }
}

// 최고 점수 저장/불러오기
export const saveHighScore = (score) => {
  try {
    const current = loadHighScore()
    if (score > current) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(score))
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to save high score:', error)
    return false
  }
}

export const loadHighScore = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE)
    return saved ? parseInt(saved, 10) : 0
  } catch (error) {
    console.error('Failed to load high score:', error)
    return 0
  }
}

export default {
  saveSettings,
  loadSettings,
  clearSettings,
  saveLeaderboard,
  loadLeaderboard,
  addToLeaderboard,
  clearLeaderboard,
  saveHighScore,
  loadHighScore,
}

