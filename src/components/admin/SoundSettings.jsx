import {
  VStack,
  HStack,
  Text,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Button,
} from '@chakra-ui/react'
import { useSettings } from '../../context/SettingsContext'

const VolumeSlider = ({ label, value, onChange, color, disabled }) => (
  <VStack align="stretch" opacity={disabled ? 0.5 : 1}>
    <HStack justify="space-between">
      <Text color="whiteAlpha.800" fontSize="sm">{label}</Text>
      <Text fontFamily="mono" color={color}>
        {Math.round(value * 100)}%
      </Text>
    </HStack>
    <Slider
      value={value}
      onChange={onChange}
      min={0}
      max={1}
      step={0.05}
      isDisabled={disabled}
    >
      <SliderTrack bg="whiteAlpha.200">
        <SliderFilledTrack bg={color} />
      </SliderTrack>
      <SliderThumb boxSize={4} />
    </Slider>
  </VStack>
)

const SoundSettings = () => {
  const { settings, updateSetting, resetCategory } = useSettings()
  const { sound } = settings

  return (
    <VStack spacing={6} align="stretch">
      {/* 사운드 활성화 */}
      <HStack justify="space-between">
        <VStack align="start" spacing={0}>
          <Text color="whiteAlpha.800" fontSize="md" fontWeight="bold">
            사운드 활성화
          </Text>
          <Text fontSize="xs" color="whiteAlpha.500">
            모든 사운드를 켜거나 끕니다
          </Text>
        </VStack>
        <Switch
          isChecked={sound.enabled}
          onChange={(e) => updateSetting('sound', 'enabled', e.target.checked)}
          colorScheme="cyan"
          size="lg"
        />
      </HStack>

      <Box
        bg="whiteAlpha.50"
        borderRadius="md"
        p={4}
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <VStack spacing={6} align="stretch">
          {/* 마스터 볼륨 */}
          <VolumeSlider
            label="마스터 볼륨"
            value={sound.masterVolume}
            onChange={(val) => updateSetting('sound', 'masterVolume', val)}
            color="neon.cyan"
            disabled={!sound.enabled}
          />

          {/* 효과음 볼륨 */}
          <VolumeSlider
            label="효과음 볼륨"
            value={sound.sfxVolume}
            onChange={(val) => updateSetting('sound', 'sfxVolume', val)}
            color="neon.magenta"
            disabled={!sound.enabled}
          />

          {/* 배경음악 볼륨 */}
          <VolumeSlider
            label="배경음악 볼륨"
            value={sound.bgmVolume}
            onChange={(val) => updateSetting('sound', 'bgmVolume', val)}
            color="neon.yellow"
            disabled={!sound.enabled}
          />
        </VStack>
      </Box>

      {/* 안내 */}
      <Box
        bg="whiteAlpha.50"
        borderRadius="md"
        p={3}
        border="1px dashed"
        borderColor="whiteAlpha.200"
      >
        <Text fontSize="sm" color="whiteAlpha.600">
          💡 사운드는 Web Audio API를 사용한 합성음입니다. 
          브라우저에서 사운드가 차단된 경우 화면을 클릭하면 활성화됩니다.
        </Text>
      </Box>

      {/* 초기화 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        color="red.400"
        alignSelf="flex-end"
        onClick={() => resetCategory('sound')}
        _hover={{ bg: 'whiteAlpha.100' }}
      >
        사운드 설정 초기화
      </Button>
    </VStack>
  )
}

export default SoundSettings

