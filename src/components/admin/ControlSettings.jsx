import {
  VStack,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Divider,
  SimpleGrid,
  Button,
  Kbd,
} from '@chakra-ui/react'
import { useSettings } from '../../context/SettingsContext'

const KeyDisplay = ({ label, keys }) => (
  <HStack justify="space-between">
    <Text color="whiteAlpha.800" fontSize="sm">{label}</Text>
    <HStack spacing={1}>
      {keys.map((key, i) => (
        <Kbd key={i} bg="whiteAlpha.200" color="white" fontSize="xs">
          {key === ' ' ? 'Space' : key}
        </Kbd>
      ))}
    </HStack>
  </HStack>
)

const ControlSettings = () => {
  const { settings, updateSetting, resetCategory } = useSettings()
  const { controls, keyBindings } = settings

  return (
    <VStack spacing={6} align="stretch">
      {/* DAS/ARR 설정 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.cyan" mb={4}>
          DAS / ARR 설정
        </Text>
        <VStack spacing={4} align="stretch">
          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">DAS (Delayed Auto Shift)</Text>
              <HStack>
                <NumberInput
                  value={controls.das}
                  onChange={(_, val) => updateSetting('controls', 'das', val)}
                  min={0}
                  max={500}
                  step={10}
                  size="sm"
                  maxW="100px"
                >
                  <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                </NumberInput>
                <Text color="whiteAlpha.600" fontSize="sm">ms</Text>
              </HStack>
            </HStack>
            <Slider
              value={controls.das}
              onChange={(val) => updateSetting('controls', 'das', val)}
              min={0}
              max={500}
              step={10}
            >
              <SliderTrack bg="whiteAlpha.200">
                <SliderFilledTrack bg="neon.cyan" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
            <Text fontSize="xs" color="whiteAlpha.500">
              키를 누르고 있을 때 자동 반복이 시작되기까지의 지연 시간
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">ARR (Auto Repeat Rate)</Text>
              <HStack>
                <NumberInput
                  value={controls.arr}
                  onChange={(_, val) => updateSetting('controls', 'arr', val)}
                  min={0}
                  max={200}
                  step={5}
                  size="sm"
                  maxW="100px"
                >
                  <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                </NumberInput>
                <Text color="whiteAlpha.600" fontSize="sm">ms</Text>
              </HStack>
            </HStack>
            <Slider
              value={controls.arr}
              onChange={(val) => updateSetting('controls', 'arr', val)}
              min={0}
              max={200}
              step={5}
            >
              <SliderTrack bg="whiteAlpha.200">
                <SliderFilledTrack bg="neon.magenta" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
            <Text fontSize="xs" color="whiteAlpha.500">
              자동 반복 시 이동 간격 (0 = 즉시 끝까지 이동)
            </Text>
          </VStack>

          <VStack align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.800" fontSize="sm">Soft Drop 속도</Text>
              <HStack>
                <NumberInput
                  value={controls.softDropSpeed}
                  onChange={(_, val) => updateSetting('controls', 'softDropSpeed', val)}
                  min={10}
                  max={200}
                  step={10}
                  size="sm"
                  maxW="100px"
                >
                  <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
                </NumberInput>
                <Text color="whiteAlpha.600" fontSize="sm">ms</Text>
              </HStack>
            </HStack>
            <Slider
              value={controls.softDropSpeed}
              onChange={(val) => updateSetting('controls', 'softDropSpeed', val)}
              min={10}
              max={200}
              step={10}
            >
              <SliderTrack bg="whiteAlpha.200">
                <SliderFilledTrack bg="neon.yellow" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
            <Text fontSize="xs" color="whiteAlpha.500">
              아래 키를 누르고 있을 때 블록이 내려가는 속도
            </Text>
          </VStack>
        </VStack>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* 키 매핑 (표시만) */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.yellow" mb={4}>
          키 매핑
        </Text>
        <Box
          bg="whiteAlpha.50"
          borderRadius="md"
          p={4}
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            <KeyDisplay label="왼쪽 이동" keys={keyBindings.moveLeft} />
            <KeyDisplay label="오른쪽 이동" keys={keyBindings.moveRight} />
            <KeyDisplay label="시계방향 회전" keys={keyBindings.rotateClockwise} />
            <KeyDisplay label="반시계방향 회전" keys={keyBindings.rotateCounterClockwise} />
            <KeyDisplay label="180도 회전" keys={keyBindings.rotate180} />
            <KeyDisplay label="Soft Drop" keys={keyBindings.softDrop} />
            <KeyDisplay label="Hard Drop" keys={keyBindings.hardDrop} />
            <KeyDisplay label="Hold" keys={keyBindings.hold} />
            <KeyDisplay label="일시정지" keys={keyBindings.pause} />
          </SimpleGrid>
        </Box>
        <Text fontSize="xs" color="whiteAlpha.500" mt={2}>
          * 키 매핑 커스터마이징은 향후 업데이트 예정
        </Text>
      </Box>

      {/* 프리셋 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.green" mb={4}>
          프리셋
        </Text>
        <HStack spacing={3} flexWrap="wrap">
          <Button
            size="sm"
            variant="outline"
            borderColor="whiteAlpha.300"
            color="whiteAlpha.700"
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
            onClick={() => {
              updateSetting('controls', 'das', 170)
              updateSetting('controls', 'arr', 50)
            }}
          >
            기본값
          </Button>
          <Button
            size="sm"
            variant="outline"
            borderColor="neon.cyan"
            color="neon.cyan"
            _hover={{ bg: 'rgba(0, 255, 255, 0.1)' }}
            onClick={() => {
              updateSetting('controls', 'das', 133)
              updateSetting('controls', 'arr', 10)
            }}
          >
            프로 (빠름)
          </Button>
          <Button
            size="sm"
            variant="outline"
            borderColor="neon.magenta"
            color="neon.magenta"
            _hover={{ bg: 'rgba(255, 0, 255, 0.1)' }}
            onClick={() => {
              updateSetting('controls', 'das', 100)
              updateSetting('controls', 'arr', 0)
            }}
          >
            초고속 (ARR 0)
          </Button>
        </HStack>
      </Box>

      {/* 초기화 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        color="red.400"
        alignSelf="flex-end"
        onClick={() => resetCategory('controls')}
        _hover={{ bg: 'whiteAlpha.100' }}
      >
        조작 설정 초기화
      </Button>
    </VStack>
  )
}

export default ControlSettings

