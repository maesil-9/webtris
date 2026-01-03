import { Box, Text, VStack, HStack, Divider } from '@chakra-ui/react'
import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MotionBox = motion.create(Box)
const MotionText = motion.create(Text)

const StatItem = memo(({ label, value, color = 'white' }) => (
  <VStack spacing={0} align="center">
    <Text
      fontFamily="heading"
      fontSize="xs"
      color="whiteAlpha.600"
      textTransform="uppercase"
      letterSpacing="0.1em"
    >
      {label}
    </Text>
    <Text
      fontFamily="mono"
      fontSize="xl"
      fontWeight="bold"
      color={color}
      textShadow={`0 0 10px ${color === 'white' ? 'rgba(255,255,255,0.5)' : color}`}
    >
      {typeof value === 'number' ? value.toLocaleString() : value}
    </Text>
  </VStack>
))

StatItem.displayName = 'StatItem'

const ScorePanel = memo(({ score, level, lines, combo, actionName, highScore }) => {
  return (
    <Box
      border="2px solid"
      borderColor="neon.yellow"
      bg="rgba(0, 0, 0, 0.6)"
      p={4}
      borderRadius="md"
      boxShadow="0 0 10px rgba(255, 255, 0, 0.2)"
      minW="150px"
    >
      <VStack spacing={4} align="stretch">
        {/* 점수 */}
        <VStack spacing={1}>
          <Text
            fontFamily="heading"
            fontSize="xs"
            color="neon.yellow"
            textTransform="uppercase"
            letterSpacing="0.1em"
          >
            Score
          </Text>
          <Text
            fontFamily="mono"
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            textShadow="0 0 10px rgba(255, 255, 0, 0.5)"
          >
            {score.toLocaleString()}
          </Text>
          {highScore > 0 && (
            <Text
              fontFamily="mono"
              fontSize="xs"
              color="whiteAlpha.500"
            >
              Best: {highScore.toLocaleString()}
            </Text>
          )}
        </VStack>

        <Divider borderColor="whiteAlpha.200" />

        {/* 레벨, 라인 */}
        <HStack justify="space-around">
          <StatItem label="Level" value={level} color="#00ffff" />
          <StatItem label="Lines" value={lines} color="#ff00ff" />
        </HStack>

        {/* 콤보 */}
        <AnimatePresence>
          {combo > 0 && (
            <MotionBox
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <VStack spacing={0}>
                <Text
                  fontFamily="heading"
                  fontSize="xs"
                  color="neon.orange"
                  textTransform="uppercase"
                >
                  Combo
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="xl"
                  fontWeight="bold"
                  color="neon.orange"
                  textShadow="0 0 15px rgba(255, 136, 0, 0.8)"
                >
                  {combo}x
                </Text>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* 액션 이름 */}
        <AnimatePresence>
          {actionName && (
            <MotionText
              key={actionName + Date.now()}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300 }}
              fontFamily="heading"
              fontSize="sm"
              color="neon.green"
              textAlign="center"
              textShadow="0 0 15px rgba(0, 255, 0, 0.8)"
              textTransform="uppercase"
            >
              {actionName}
            </MotionText>
          )}
        </AnimatePresence>
      </VStack>
    </Box>
  )
})

ScorePanel.displayName = 'ScorePanel'

export default ScorePanel

