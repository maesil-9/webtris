import { Box, HStack, VStack, Text, Button, Container } from '@chakra-ui/react'
import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext'
import { useGame } from '../../hooks/useGame'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useSound } from '../../hooks/useSound'
import Board from '../game/Board'
import HoldBox from '../game/HoldBox'
import NextQueue from '../game/NextQueue'
import ScorePanel from '../game/ScorePanel'
import PauseModal from './PauseModal'
import GameOverModal from './GameOverModal'
import { loadHighScore } from '../../utils/storage'

const MotionBox = motion.create(Box)

const GameScreen = () => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const {
    gameState,
    highScore,
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
  } = useGame(settings)

  const sound = useSound(settings)

  // 키보드 입력 설정
  useKeyboard({
    settings,
    gameStatus: gameState.status,
    onMoveLeft: useCallback(() => {
      moveLeft()
      sound.playMove()
    }, [moveLeft, sound]),
    onMoveRight: useCallback(() => {
      moveRight()
      sound.playMove()
    }, [moveRight, sound]),
    onRotateRight: useCallback(() => {
      rotateRight()
      sound.playRotate()
    }, [rotateRight, sound]),
    onRotateLeft: useCallback(() => {
      rotateLeft()
      sound.playRotate()
    }, [rotateLeft, sound]),
    onRotate180: useCallback(() => {
      rotate180()
      sound.playRotate()
    }, [rotate180, sound]),
    onSoftDrop: useCallback(() => {
      softDrop()
    }, [softDrop]),
    onHardDrop: useCallback(() => {
      hardDrop()
      sound.playDrop()
    }, [hardDrop, sound]),
    onHold: useCallback(() => {
      hold()
      sound.playHold()
    }, [hold, sound]),
    onPause: pauseGame,
    onResume: resumeGame,
  })

  // 게임 시작
  useEffect(() => {
    startGame()
    return () => {
      resetGame()
    }
  }, [])

  // 게임 오버 시 효과음
  useEffect(() => {
    if (gameState.status === 'gameover') {
      sound.playGameOver()
    }
  }, [gameState.status, sound])

  // 재시작 핸들러
  const handleRestart = useCallback(() => {
    resetGame()
    setTimeout(() => {
      startGame()
    }, 100)
  }, [resetGame, startGame])

  // 보드가 없으면 로딩 표시
  if (!gameState.board) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontFamily="heading" fontSize="xl" color="neon.cyan">
          Loading...
        </Text>
      </Box>
    )
  }

  return (
    <Box minH="100vh" py={4} position="relative">
      {/* 배경 그리드 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.03}
        backgroundImage={`
          linear-gradient(rgba(0, 255, 255, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)
        `}
        backgroundSize="30px 30px"
        pointerEvents="none"
      />

      <Container maxW="1200px" centerContent>
        <VStack spacing={4}>
          {/* 상단 정보 */}
          <HStack w="100%" justify="space-between" px={4}>
            <Button
              variant="ghost"
              size="sm"
              color="whiteAlpha.600"
              _hover={{ color: 'white' }}
              onClick={() => navigate('/')}
            >
              ← 메뉴
            </Button>
            <Text
              fontFamily="heading"
              fontSize="2xl"
              bgGradient="linear(to-r, neon.cyan, neon.magenta)"
              bgClip="text"
            >
              WEBTRIS
            </Text>
            <Button
              variant="ghost"
              size="sm"
              color="whiteAlpha.600"
              _hover={{ color: 'white' }}
              onClick={pauseGame}
            >
              일시정지
            </Button>
          </HStack>

          {/* 게임 영역 */}
          <HStack spacing={6} align="flex-start">
            {/* 왼쪽 패널 - Hold */}
            <VStack spacing={4}>
              <HoldBox 
                piece={gameState.holdPiece} 
                canHold={gameState.canHold} 
              />
            </VStack>

            {/* 중앙 - 보드 */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Board
                board={gameState.board}
                currentPiece={gameState.currentPiece}
                currentPosition={gameState.currentPosition}
                currentRotation={gameState.currentRotation}
                ghostPosition={gameState.ghostPosition}
                cellSize={28}
                bufferHeight={settings.board.bufferHeight}
              />
            </MotionBox>

            {/* 오른쪽 패널 - Next, Score */}
            <VStack spacing={4}>
              <NextQueue 
                pieces={gameState.nextPieces} 
                count={settings.features.nextCount} 
              />
              <ScorePanel
                score={gameState.score}
                level={gameState.level}
                lines={gameState.lines}
                combo={gameState.combo}
                actionName={gameState.actionName}
                highScore={loadHighScore()}
              />
            </VStack>
          </HStack>

          {/* 조작 안내 (모바일용) */}
          <Box display={{ base: 'block', md: 'none' }} mt={4}>
            <Text fontSize="xs" color="whiteAlpha.500" textAlign="center">
              PC에서 키보드로 조작하세요
            </Text>
          </Box>
        </VStack>
      </Container>

      {/* 일시정지 모달 */}
      <PauseModal
        isOpen={gameState.status === 'paused'}
        onResume={resumeGame}
        onRestart={handleRestart}
      />

      {/* 게임오버 모달 */}
      <GameOverModal
        isOpen={gameState.status === 'gameover'}
        stats={{
          score: gameState.score,
          level: gameState.level,
          lines: gameState.lines,
          ...gameState.stats,
        }}
        onRestart={handleRestart}
        isNewHighScore={gameState.score > highScore}
      />
    </Box>
  )
}

export default GameScreen

