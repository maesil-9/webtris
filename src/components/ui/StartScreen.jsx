import { Box, VStack, Text, Button, HStack, Kbd, Container } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { loadHighScore } from '../../utils/storage'
import { useState, useEffect } from 'react'

const KeyHint = ({ keys, action }) => (
  <HStack justify="space-between" w="100%">
    <Text color="whiteAlpha.700" fontSize="sm">{action}</Text>
    <HStack spacing={1}>
      {keys.map((key, i) => (
        <Kbd key={i} bg="whiteAlpha.200" color="white" fontSize="xs">
          {key}
        </Kbd>
      ))}
    </HStack>
  </HStack>
)

const StartScreen = () => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    setHighScore(loadHighScore())
  }, [])

  const handleStart = () => {
    navigate('/game')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  const handleLeaderboard = () => {
    navigate('/leaderboard')
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* 배경 애니메이션 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 50% 50%, rgba(160, 0, 240, 0.1) 0%, transparent 50%)"
        pointerEvents="none"
      />
      
      {/* 그리드 패턴 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.05}
        backgroundImage={`
          linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
        `}
        backgroundSize="50px 50px"
        pointerEvents="none"
      />

      <Container maxW="500px" centerContent>
        <VStack spacing={8} textAlign="center">
          {/* 타이틀 */}
          <Box>
            <Text
              fontFamily="heading"
              fontSize={{ base: '5xl', md: '7xl' }}
              fontWeight="900"
              bgGradient="linear(to-r, neon.cyan, neon.magenta, neon.yellow)"
              bgClip="text"
              letterSpacing="0.1em"
            >
              WEBTRIS
            </Text>
            <Text
              fontFamily="body"
              fontSize="md"
              color="whiteAlpha.600"
              mt={2}
            >
              테트리스 웹 버전
            </Text>
          </Box>

          {/* 최고 점수 */}
          {highScore > 0 && (
            <VStack spacing={1}>
              <Text fontSize="sm" color="whiteAlpha.500">HIGH SCORE</Text>
              <Text
                fontFamily="mono"
                fontSize="2xl"
                color="neon.yellow"
                textShadow="0 0 20px rgba(255, 255, 0, 0.5)"
              >
                {highScore.toLocaleString()}
              </Text>
            </VStack>
          )}

          {/* 버튼들 */}
          <VStack spacing={4} w="250px">
            <Button
              variant="neon"
              size="lg"
              w="100%"
              onClick={handleStart}
              fontSize="lg"
            >
              게임 시작
            </Button>
            <Button
              variant="neonPink"
              size="md"
              w="100%"
              onClick={handleSettings}
            >
              설정
            </Button>
            <Button
              variant="ghost"
              size="md"
              w="100%"
              color="whiteAlpha.700"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              onClick={handleLeaderboard}
            >
              리더보드
            </Button>
          </VStack>

          {/* 조작 안내 */}
          <Box
            w="100%"
            maxW="300px"
          >
            <Box
              bg="whiteAlpha.100"
              borderRadius="md"
              p={4}
              border="1px solid"
              borderColor="whiteAlpha.200"
            >
              <Text
                fontFamily="heading"
                fontSize="sm"
                color="neon.cyan"
                mb={3}
                textAlign="center"
              >
                조작 방법
              </Text>
              <VStack spacing={2} align="stretch">
                <KeyHint keys={['←', '→']} action="이동" />
                <KeyHint keys={['↑', 'X']} action="회전 (시계)" />
                <KeyHint keys={['Z', 'Ctrl']} action="회전 (반시계)" />
                <KeyHint keys={['↓']} action="Soft Drop" />
                <KeyHint keys={['Space']} action="Hard Drop" />
                <KeyHint keys={['C', 'Shift']} action="Hold" />
                <KeyHint keys={['Esc', 'P']} action="일시정지" />
              </VStack>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default StartScreen
