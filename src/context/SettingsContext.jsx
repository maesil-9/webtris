import { createContext, useContext, useReducer, useEffect } from 'react'
import { defaultSettings } from '../config/defaultSettings'
import { saveSettings, loadSettings } from '../utils/storage'

const SettingsContext = createContext(null)

// 깊은 병합 함수
const deepMerge = (target, source) => {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SETTING': {
      const { category, key, value } = action.payload
      return {
        ...state,
        [category]: {
          ...state[category],
          [key]: value,
        },
      }
    }
    
    case 'UPDATE_CATEGORY': {
      const { category, values } = action.payload
      return {
        ...state,
        [category]: {
          ...state[category],
          ...values,
        },
      }
    }
    
    case 'RESET_CATEGORY': {
      const { category } = action.payload
      return {
        ...state,
        [category]: { ...defaultSettings[category] },
      }
    }
    
    case 'RESET_ALL':
      return { ...defaultSettings }
    
    case 'LOAD_SETTINGS':
      return deepMerge(defaultSettings, action.payload)
    
    default:
      return state
  }
}

export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings)
  
  // 초기 로드
  useEffect(() => {
    const saved = loadSettings()
    if (saved) {
      dispatch({ type: 'LOAD_SETTINGS', payload: saved })
    }
  }, [])
  
  // 설정 변경 시 저장
  useEffect(() => {
    saveSettings(settings)
  }, [settings])
  
  const updateSetting = (category, key, value) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { category, key, value } })
  }
  
  const updateCategory = (category, values) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: { category, values } })
  }
  
  const resetCategory = (category) => {
    dispatch({ type: 'RESET_CATEGORY', payload: { category } })
  }
  
  const resetAll = () => {
    dispatch({ type: 'RESET_ALL' })
  }
  
  const value = {
    settings,
    updateSetting,
    updateCategory,
    resetCategory,
    resetAll,
  }
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export default SettingsContext

