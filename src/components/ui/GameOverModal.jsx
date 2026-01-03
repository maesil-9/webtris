import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Box,
  Divider,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { addToLeaderboard, saveHighScore } from '../../utils/storage'

const MotionBox = motion.create(Box)

const StatRow = ({ label, value, highlight }) => (
  <HStack justify="space-between" w="100%">
    <Text color="whiteAlpha.700">{label}</Text>
    <Text
      fontFamily="mono"
      fontWeight="bold"
      color={highlight ? 'neon.yellow' : 'white'}
      textShadow={highlight ? '0 0 10px rgba(255, 255, 0, 0.5)' : 'none'}
    >
      {typeof value === 'number' ? value.toLocaleString() : value}
    </Text>
  </HStack>
)

const GameOverModal = ({ isOpen, stats, onRestart, isNewHighScore }) => {
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSaveScore = () => {
    if (playerName.trim()) {
      addToLeaderboard({
        name: playerName.trim(),
        score: stats.score,
        level: stats.level,
        lines: stats.lines,
      })
      saveHighScore(stats.score)
      setSaved(true)
    }
  }

  const handleRestart = () => {
    setSaved(false)
    setPlayerName('')
    onRestart()
  }

  const handleQuit = () => {
    navigate('/')
  }

  const handleLeaderboard = () => {
    navigate('/leaderboard')
  }

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="md" closeOnOverlayClick={false}>
      <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(10px)" />
      <ModalContent bg="rgba(15, 15, 26, 0.98)">
        <ModalHeader textAlign="center" pb={2}>
          <MotionBox
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Text
              fontFamily="heading"
              fontSize="3xl"
              bgGradient="linear(to-r, red.400, orange.400)"
              bgClip="text"
            >
              GAME OVER
            </Text>
            {isNewHighScore && (
              <Text
                fontFamily="heading"
                fontSize="lg"
                color="neon.yellow"
                textShadow="0 0 20px rgba(255, 255, 0, 0.8)"
                mt={2}
              >
                🎉 NEW HIGH SCORE! 🎉
              </Text>
            )}
          </MotionBox>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4}>
            {/* 최종 점수 */}
            <Box
              w="100%"
              bg="whiteAlpha.50"
              borderRadius="md"
              p={4}
              border="1px solid"
              borderColor={isNewHighScore ? 'neon.yellow' : 'whiteAlpha.200'}
            >
              <VStack spacing={2}>
                <Text fontSize="sm" color="whiteAlpha.500">FINAL SCORE</Text>
                <Text
                  fontFamily="mono"
                  fontSize="4xl"
                  fontWeight="bold"
                  color="white"
                  textShadow="0 0 20px rgba(255, 255, 255, 0.3)"
                >
                  {stats.score.toLocaleString()}
                </Text>
              </VStack>
            </Box>

            {/* 통계 */}
            <Box w="100%" p={3}>
              <VStack spacing={2} align="stretch">
                <StatRow label="레벨" value={stats.level} />
                <StatRow label="클리어 라인" value={stats.lines} />
                <StatRow label="테트리스" value={stats.tetrises} highlight={stats.tetrises > 0} />
                <StatRow label="T-Spin" value={stats.tSpins} highlight={stats.tSpins > 0} />
                <StatRow label="최대 콤보" value={stats.maxCombo} highlight={stats.maxCombo > 5} />
              </VStack>
            </Box>

            <Divider borderColor="whiteAlpha.200" />

            {/* 이름 입력 */}
            {!saved ? (
              <VStack spacing={2} w="100%">
                <Text fontSize="sm" color="whiteAlpha.700">리더보드에 기록하기</Text>
                <HStack w="100%">
                  <Input
                    placeholder="이름 입력"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={20}
                    bg="whiteAlpha.100"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    _focus={{ borderColor: 'neon.cyan' }}
                  />
                  <Button
                    variant="neon"
                    onClick={handleSaveScore}
                    isDisabled={!playerName.trim()}
                  >
                    저장
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <Text color="neon.green" fontSize="sm">
                ✓ 기록이 저장되었습니다!
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack spacing={3} w="100%">
            <Button
              variant="neon"
              size="lg"
              w="100%"
              onClick={handleRestart}
            >
              다시 시작
            </Button>
            <HStack w="100%" spacing={3}>
              <Button
                variant="ghost"
                flex={1}
                color="whiteAlpha.700"
                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                onClick={handleLeaderboard}
              >
                리더보드
              </Button>
              <Button
                variant="ghost"
                flex={1}
                color="whiteAlpha.700"
                _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                onClick={handleQuit}
              >
                메인 메뉴
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default GameOverModal

