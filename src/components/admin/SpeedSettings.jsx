import {
  VStack,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Divider,
  SimpleGrid,
  Select,
  Button,
} from '@chakra-ui/react'
import { useSettings } from '../../context/SettingsContext'

const SpeedSettings = () => {
  const { settings, updateSetting, resetCategory } = useSettings()
  const { speed, lockDelay, level } = settings

  return (
    <VStack spacing={6} align="stretch">
      {/* 레벨 설정 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.cyan" mb={4}>
          레벨 설정
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">시작 레벨</Text>
              <NumberInput
                value={speed.startLevel}
                onChange={(_, val) => updateSetting('speed', 'startLevel', val)}
                min={1}
                max={speed.maxLevel}
                size="sm"
                maxW="100px"
              >
                <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                <NumberInputStepper>
                  <NumberIncrementStepper borderColor="whiteAlpha.300" />
                  <NumberDecrementStepper borderColor="whiteAlpha.300" />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              게임 시작 시 레벨
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">최대 레벨</Text>
              <NumberInput
                value={speed.maxLevel}
                onChange={(_, val) => updateSetting('speed', 'maxLevel', val)}
                min={speed.startLevel}
                max={99}
                size="sm"
                maxW="100px"
              >
                <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                <NumberInputStepper>
                  <NumberIncrementStepper borderColor="whiteAlpha.300" />
                  <NumberDecrementStepper borderColor="whiteAlpha.300" />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              도달 가능한 최대 레벨
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">레벨업 라인 수</Text>
              <NumberInput
                value={level.linesPerLevel}
                onChange={(_, val) => updateSetting('level', 'linesPerLevel', val)}
                min={1}
                max={50}
                size="sm"
                maxW="100px"
              >
                <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                <NumberInputStepper>
                  <NumberIncrementStepper borderColor="whiteAlpha.300" />
                  <NumberDecrementStepper borderColor="whiteAlpha.300" />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              다음 레벨까지 필요한 라인 수
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* 속도 설정 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.magenta" mb={4}>
          낙하 속도
        </Text>
        <VStack spacing={4} align="stretch">
          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">기본 낙하 간격 (레벨 1)</Text>
              <HStack>
                <NumberInput
                  value={speed.baseDropInterval}
                  onChange={(_, val) => updateSetting('speed', 'baseDropInterval', val)}
                  min={100}
                  max={3000}
                  step={50}
                  size="sm"
                  maxW="100px"
                >
                  <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                </NumberInput>
                <Text color="whiteAlpha.600" fontSize="sm">ms</Text>
              </HStack>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              레벨 1에서 블록이 한 칸 떨어지는 시간 (1000ms = 1초)
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">전체 속도 배율</Text>
              <Text fontFamily="mono" color="neon.yellow">
                {speed.speedMultiplier.toFixed(1)}x
              </Text>
            </HStack>
            <Slider
              value={speed.speedMultiplier}
              onChange={(val) => updateSetting('speed', 'speedMultiplier', val)}
              min={0.5}
              max={3}
              step={0.1}
            >
              <SliderTrack bg="whiteAlpha.200">
                <SliderFilledTrack bg="neon.magenta" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
            <Text fontSize="xs" color="whiteAlpha.500">
              높을수록 더 빠르게 떨어집니다
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">속도 곡선</Text>
              <Select
                value={speed.levelSpeedCurve}
                onChange={(e) => updateSetting('speed', 'levelSpeedCurve', e.target.value)}
                size="sm"
                maxW="150px"
                bg="whiteAlpha.100"
                borderColor="whiteAlpha.300"
              >
                <option value="gentle" style={{ background: '#1a1a2e' }}>완만</option>
                <option value="standard" style={{ background: '#1a1a2e' }}>표준 (공식)</option>
                <option value="aggressive" style={{ background: '#1a1a2e' }}>급격</option>
              </Select>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              레벨에 따른 속도 증가 패턴
            </Text>
          </VStack>
        </VStack>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* Lock Delay */}
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontFamily="heading" fontSize="md" color="neon.yellow">
            Lock Delay (고정 지연)
          </Text>
          <Switch
            isChecked={lockDelay.enabled}
            onChange={(e) => updateSetting('lockDelay', 'enabled', e.target.checked)}
            colorScheme="yellow"
          />
        </HStack>
        <VStack spacing={4} align="stretch" opacity={lockDelay.enabled ? 1 : 0.5}>
          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">지연 시간</Text>
              <HStack>
                <NumberInput
                  value={lockDelay.duration}
                  onChange={(_, val) => updateSetting('lockDelay', 'duration', val)}
                  min={0}
                  max={2000}
                  step={50}
                  size="sm"
                  maxW="100px"
                  isDisabled={!lockDelay.enabled}
                >
                  <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                </NumberInput>
                <Text color="whiteAlpha.600" fontSize="sm">ms</Text>
              </HStack>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              블록이 바닥에 닿은 후 고정까지 대기 시간
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">최대 리셋 횟수</Text>
              <NumberInput
                value={lockDelay.maxResets}
                onChange={(_, val) => updateSetting('lockDelay', 'maxResets', val)}
                min={0}
                max={30}
                size="sm"
                maxW="100px"
                isDisabled={!lockDelay.enabled}
              >
                <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                <NumberInputStepper>
                  <NumberIncrementStepper borderColor="whiteAlpha.300" />
                  <NumberDecrementStepper borderColor="whiteAlpha.300" />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Text fontSize="xs" color="whiteAlpha.500">
              이동/회전으로 Lock Delay를 리셋할 수 있는 최대 횟수
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* 초기화 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        color="red.400"
        alignSelf="flex-end"
        onClick={() => {
          resetCategory('speed')
          resetCategory('lockDelay')
          resetCategory('level')
        }}
        _hover={{ bg: 'whiteAlpha.100' }}
      >
        속도 설정 초기화
      </Button>
    </VStack>
  )
}

export default SpeedSettings

