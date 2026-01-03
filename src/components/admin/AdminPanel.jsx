import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext'
import ScoreSettings from './ScoreSettings'
import SpeedSettings from './SpeedSettings'
import GameSettings from './GameSettings'
import ControlSettings from './ControlSettings'
import SoundSettings from './SoundSettings'

const MotionBox = motion.create(Box)

const AdminPanel = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { settings, resetAll } = useSettings()

  const handleBack = () => {
    navigate('/')
  }

  const handleReset = () => {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      resetAll()
      toast({
        title: '설정 초기화 완료',
        description: '모든 설정이 기본값으로 돌아갔습니다.',
        status: 'success',
        duration: 3000,
      })
    }
  }

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="900px">
        <VStack spacing={6} align="stretch">
          {/* 헤더 */}
          <HStack justify="space-between" align="center">
            <Button
              variant="ghost"
              color="whiteAlpha.700"
              _hover={{ color: 'white' }}
              onClick={handleBack}
            >
              ← 뒤로
            </Button>
            <Text
              fontFamily="heading"
              fontSize="3xl"
              bgGradient="linear(to-r, neon.cyan, neon.magenta)"
              bgClip="text"
            >
              설정
            </Text>
            <Button
              variant="ghost"
              color="red.400"
              size="sm"
              onClick={handleReset}
              _hover={{ color: 'red.300', bg: 'whiteAlpha.100' }}
            >
              초기화
            </Button>
          </HStack>

          {/* 설정 탭 */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              bg="whiteAlpha.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="whiteAlpha.100"
              overflow="hidden"
            >
              <Tabs variant="soft-rounded" colorScheme="cyan" p={4}>
                <TabList
                  flexWrap="wrap"
                  gap={2}
                  justifyContent="center"
                  mb={4}
                >
                  <Tab
                    _selected={{ bg: 'neon.cyan', color: 'black' }}
                    color="whiteAlpha.700"
                    fontSize="sm"
                  >
                    점수
                  </Tab>
                  <Tab
                    _selected={{ bg: 'neon.cyan', color: 'black' }}
                    color="whiteAlpha.700"
                    fontSize="sm"
                  >
                    속도
                  </Tab>
                  <Tab
                    _selected={{ bg: 'neon.cyan', color: 'black' }}
                    color="whiteAlpha.700"
                    fontSize="sm"
                  >
                    게임
                  </Tab>
                  <Tab
                    _selected={{ bg: 'neon.cyan', color: 'black' }}
                    color="whiteAlpha.700"
                    fontSize="sm"
                  >
                    조작
                  </Tab>
                  <Tab
                    _selected={{ bg: 'neon.cyan', color: 'black' }}
                    color="whiteAlpha.700"
                    fontSize="sm"
                  >
                    사운드
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <ScoreSettings />
                  </TabPanel>
                  <TabPanel>
                    <SpeedSettings />
                  </TabPanel>
                  <TabPanel>
                    <GameSettings />
                  </TabPanel>
                  <TabPanel>
                    <ControlSettings />
                  </TabPanel>
                  <TabPanel>
                    <SoundSettings />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </MotionBox>

          {/* 설명 */}
          <Box
            bg="whiteAlpha.50"
            borderRadius="md"
            p={4}
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <Text fontSize="sm" color="whiteAlpha.600">
              💡 설정 변경사항은 자동으로 저장됩니다. 다음 게임부터 적용됩니다.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default AdminPanel

