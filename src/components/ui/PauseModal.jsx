import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const PauseModal = ({ isOpen, onResume, onRestart }) => {
  const navigate = useNavigate()

  const handleQuit = () => {
    navigate('/')
  }

  return (
    <Modal isOpen={isOpen} onClose={onResume} isCentered size="sm">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(5px)" />
      <ModalContent bg="rgba(15, 15, 26, 0.95)">
        <ModalHeader textAlign="center">
          <Text
            fontFamily="heading"
            fontSize="2xl"
            color="neon.cyan"
            textShadow="0 0 20px rgba(0, 255, 255, 0.5)"
          >
            일시정지
          </Text>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Button
              variant="neon"
              size="lg"
              w="100%"
              onClick={onResume}
            >
              계속하기
            </Button>
            <Button
              variant="neonPink"
              size="md"
              w="100%"
              onClick={onRestart}
            >
              다시 시작
            </Button>
            <Button
              variant="ghost"
              size="md"
              w="100%"
              color="whiteAlpha.700"
              _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              onClick={handleQuit}
            >
              메인 메뉴
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Text fontSize="sm" color="whiteAlpha.500">
            ESC 또는 P를 눌러 계속
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PauseModal

