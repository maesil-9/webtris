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
  FormControl,
  FormLabel,
  Button,
} from '@chakra-ui/react'
import { useSettings } from '../../context/SettingsContext'

const SettingItem = ({ label, children, description }) => (
  <FormControl>
    <HStack justify="space-between" align="center" mb={1}>
      <FormLabel mb={0} color="whiteAlpha.800" fontSize="sm">
        {label}
      </FormLabel>
      {children}
    </HStack>
    {description && (
      <Text fontSize="xs" color="whiteAlpha.500" mt={1}>
        {description}
      </Text>
    )}
  </FormControl>
)

const NumberSetting = ({ label, value, onChange, min, max, step = 1, description }) => (
  <SettingItem label={label} description={description}>
    <NumberInput
      value={value}
      onChange={(_, val) => onChange(val)}
      min={min}
      max={max}
      step={step}
      size="sm"
      maxW="120px"
    >
      <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
      <NumberInputStepper>
        <NumberIncrementStepper borderColor="whiteAlpha.300" />
        <NumberDecrementStepper borderColor="whiteAlpha.300" />
      </NumberInputStepper>
    </NumberInput>
  </SettingItem>
)

const ScoreSettings = () => {
  const { settings, updateSetting, resetCategory } = useSettings()
  const { score, bonus } = settings

  return (
    <VStack spacing={6} align="stretch">
      {/* 전체 배율 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.cyan" mb={4}>
          전체 점수 배율
        </Text>
        <VStack spacing={4} align="stretch">
          <HStack>
            <Slider
              value={score.globalMultiplier}
              onChange={(val) => updateSetting('score', 'globalMultiplier', val)}
              min={0.1}
              max={5}
              step={0.1}
              flex={1}
            >
              <SliderTrack bg="whiteAlpha.200">
                <SliderFilledTrack bg="neon.cyan" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
            <Text fontFamily="mono" color="neon.yellow" minW="60px" textAlign="right">
              {score.globalMultiplier.toFixed(1)}x
            </Text>
          </HStack>
          <Text fontSize="xs" color="whiteAlpha.500">
            모든 점수에 이 배율이 적용됩니다.
          </Text>
        </VStack>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* 라인 클리어 점수 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.cyan" mb={4}>
          라인 클리어 기본 점수
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <NumberSetting
            label="Single (1줄)"
            value={score.single}
            onChange={(val) => updateSetting('score', 'single', val)}
            min={0}
            max={9999}
          />
          <NumberSetting
            label="Double (2줄)"
            value={score.double}
            onChange={(val) => updateSetting('score', 'double', val)}
            min={0}
            max={9999}
          />
          <NumberSetting
            label="Triple (3줄)"
            value={score.triple}
            onChange={(val) => updateSetting('score', 'triple', val)}
            min={0}
            max={9999}
          />
          <NumberSetting
            label="Tetris (4줄)"
            value={score.tetris}
            onChange={(val) => updateSetting('score', 'tetris', val)}
            min={0}
            max={9999}
          />
        </SimpleGrid>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* T-Spin 점수 */}
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontFamily="heading" fontSize="md" color="neon.magenta">
            T-Spin 점수
          </Text>
          <HStack>
            <Text fontSize="sm" color="whiteAlpha.600">활성화</Text>
            <Switch
              isChecked={bonus.tSpinEnabled}
              onChange={(e) => updateSetting('bonus', 'tSpinEnabled', e.target.checked)}
              colorScheme="pink"
            />
          </HStack>
        </HStack>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} opacity={bonus.tSpinEnabled ? 1 : 0.5}>
          <NumberSetting
            label="T-Spin Mini"
            value={score.tSpinMini}
            onChange={(val) => updateSetting('score', 'tSpinMini', val)}
            min={0}
            max={9999}
          />
          <NumberSetting
            label="T-Spin Single"
            value={score.tSpinSingle}
            onChange={(val) => updateSetting('score', 'tSpinSingle', val)}
            min={0}
            max={9999}
          />
          <NumberSetting
            label="T-Spin Double"
            value={score.tSpinDouble}
            onChange={(val) => updateSetting('score', 'tSpinDouble', val)}
            min={0}
            max={9999}
          />
          <NumberSetting
            label="T-Spin Triple"
            value={score.tSpinTriple}
            onChange={(val) => updateSetting('score', 'tSpinTriple', val)}
            min={0}
            max={9999}
          />
        </SimpleGrid>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* 보너스 설정 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.yellow" mb={4}>
          보너스 설정
        </Text>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.800" fontSize="sm">Back-to-Back 보너스</Text>
              <Text fontSize="xs" color="whiteAlpha.500">
                연속 테트리스/T-Spin 시 추가 배율
              </Text>
            </VStack>
            <HStack>
              <NumberInput
                value={bonus.backToBackMultiplier}
                onChange={(_, val) => updateSetting('bonus', 'backToBackMultiplier', val)}
                min={1}
                max={5}
                step={0.1}
                size="sm"
                maxW="80px"
                isDisabled={!bonus.backToBackEnabled}
              >
                <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
              </NumberInput>
              <Text color="whiteAlpha.600">x</Text>
              <Switch
                isChecked={bonus.backToBackEnabled}
                onChange={(e) => updateSetting('bonus', 'backToBackEnabled', e.target.checked)}
                colorScheme="yellow"
              />
            </HStack>
          </HStack>

          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.800" fontSize="sm">콤보 보너스</Text>
              <Text fontSize="xs" color="whiteAlpha.500">
                연속 클리어 시 추가 점수
              </Text>
            </VStack>
            <HStack>
              <NumberInput
                value={bonus.comboMultiplier}
                onChange={(_, val) => updateSetting('bonus', 'comboMultiplier', val)}
                min={0}
                max={500}
                size="sm"
                maxW="80px"
                isDisabled={!bonus.comboEnabled}
              >
                <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" />
              </NumberInput>
              <Text color="whiteAlpha.600">pts</Text>
              <Switch
                isChecked={bonus.comboEnabled}
                onChange={(e) => updateSetting('bonus', 'comboEnabled', e.target.checked)}
                colorScheme="orange"
              />
            </HStack>
          </HStack>
        </VStack>
      </Box>

      <Divider borderColor="whiteAlpha.200" />

      {/* 기타 점수 */}
      <Box>
        <Text fontFamily="heading" fontSize="md" color="neon.green" mb={4}>
          기타 점수
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <NumberSetting
            label="Perfect Clear"
            value={score.perfectClear}
            onChange={(val) => updateSetting('score', 'perfectClear', val)}
            min={0}
            max={99999}
            description="보드를 완전히 비울 때"
          />
          <NumberSetting
            label="Soft Drop (셀당)"
            value={score.softDropPerCell}
            onChange={(val) => updateSetting('score', 'softDropPerCell', val)}
            min={0}
            max={10}
          />
          <NumberSetting
            label="Hard Drop (셀당)"
            value={score.hardDropPerCell}
            onChange={(val) => updateSetting('score', 'hardDropPerCell', val)}
            min={0}
            max={10}
          />
        </SimpleGrid>
      </Box>

      {/* 초기화 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        color="red.400"
        alignSelf="flex-end"
        onClick={() => resetCategory('score')}
        _hover={{ bg: 'whiteAlpha.100' }}
      >
        점수 설정 초기화
      </Button>
    </VStack>
  )
}

export default ScoreSettings

