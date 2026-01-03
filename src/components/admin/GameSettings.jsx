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
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useSettings } from '../../context/SettingsContext'

const GameSettings = () => {
  const { settings, updateSetting, resetCategory } = useSettings()
  const { board, features } = settings

  const isBoardNonStandard = board.width !== 10 || board.height !== 20

  return (
    <VStack spacing={6} align="stretch">
      {/* 보드 크기 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.cyan" mb={4}>
          보드 크기
        </Text>
        {isBoardNonStandard && (
          <Alert status="warning" mb={4} bg="whiteAlpha.100" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              표준 보드 크기(10x20)가 아닙니다. 일부 기술이 정상 작동하지 않을 수 있습니다.
            </Text>
          </Alert>
        )}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">가로 크기</Text>
              <NumberInput
                value={board.width}
                onChange={(_, val) => updateSetting('board', 'width', val)}
                min={6}
                max={20}
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
              표준: 10칸
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">세로 크기</Text>
              <NumberInput
                value={board.height}
                onChange={(_, val) => updateSetting('board', 'height', val)}
                min={10}
                max={30}
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
              표준: 20칸 (보이는 영역)
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">버퍼 영역</Text>
              <NumberInput
                value={board.bufferHeight}
                onChange={(_, val) => updateSetting('board', 'bufferHeight', val)}
                min={0}
                max={40}
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
              화면 위쪽 숨겨진 공간 (블록 스폰 영역)
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* 게임 기능 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.magenta" mb={4}>
          게임 기능
        </Text>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.800" fontSize="sm">Hold 기능</Text>
              <Text fontSize="xs" color="whiteAlpha.500">
                현재 블록을 보관하고 나중에 사용
              </Text>
            </VStack>
            <Switch
              isChecked={features.holdEnabled}
              onChange={(e) => updateSetting('features', 'holdEnabled', e.target.checked)}
              colorScheme="pink"
            />
          </HStack>

          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.800" fontSize="sm">Ghost Piece</Text>
              <Text fontSize="xs" color="whiteAlpha.500">
                블록이 떨어질 위치 미리보기
              </Text>
            </VStack>
            <Switch
              isChecked={features.ghostEnabled}
              onChange={(e) => updateSetting('features', 'ghostEnabled', e.target.checked)}
              colorScheme="cyan"
            />
          </HStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">Next 미리보기 개수</Text>
              <Text fontFamily="mono" color="neon.yellow">
                {features.nextCount}개
              </Text>
            </HStack>
            <Slider
              value={features.nextCount}
              onChange={(val) => updateSetting('features', 'nextCount', val)}
              min={1}
              max={6}
              step={1}
            >
              <SliderTrack bg="whiteAlpha.200">
                <SliderFilledTrack bg="neon.yellow" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
            <Text fontSize="xs" color="whiteAlpha.500">
              다음에 나올 블록을 몇 개까지 미리 볼 수 있는지
            </Text>
          </VStack>
        </VStack>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* 레벨 점수 배율 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.green" mb={4}>
          레벨 점수 배율
        </Text>
        <VStack align="stretch">
          <HStack justify="space-between">
            <Text color="whiteAlpha.800" fontSize="sm">레벨 배율 적용률</Text>
            <Text fontFamily="mono" color="neon.yellow">
              {settings.level.levelMultiplier.toFixed(1)}x
            </Text>
          </HStack>
          <Slider
            value={settings.level.levelMultiplier}
            onChange={(val) => updateSetting('level', 'levelMultiplier', val)}
            min={0}
            max={3}
            step={0.1}
          >
            <SliderTrack bg="whiteAlpha.200">
              <SliderFilledTrack bg="neon.green" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
          <Text fontSize="xs" color="whiteAlpha.500">
            점수에 레벨이 곱해지는 정도 (0 = 레벨 무시, 1 = 표준)
          </Text>
        </VStack>
      </Box>

      {/* 초기화 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        color="red.400"
        alignSelf="flex-end"
        onClick={() => {
          resetCategory('board')
          resetCategory('features')
        }}
        _hover={{ bg: 'whiteAlpha.100' }}
      >
        게임 설정 초기화
      </Button>
    </VStack>
  )
}

export default GameSettings

