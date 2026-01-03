import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { SettingsProvider } from './context/SettingsContext'
import { GameProvider } from './context/GameContext'
import StartScreen from './components/ui/StartScreen'
import GameScreen from './components/ui/GameScreen'
import AdminPanel from './components/admin/AdminPanel'
import Leaderboard from './components/ui/Leaderboard'

function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <Box 
          minH="100vh" 
          bg="tetris.background"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 0, 136, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(160, 0, 240, 0.03) 0%, transparent 70%)
            `,
            pointerEvents: 'none',
          }}
        >
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/settings" element={<AdminPanel />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </Box>
      </GameProvider>
    </SettingsProvider>
  )
}

export default App

