import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { loadLeaderboard, clearLeaderboard } from '../../utils/storage'

const MotionBox = motion.create(Box)

const Leaderboard = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    setLeaderboard(loadLeaderboard())
  }, [])

  const handleBack = () => {
    navigate('/')
  }

  const handleClear = () => {
    if (confirm('정말로 모든 기록을 삭제하시겠습니까?')) {
      clearLeaderboard()
      setLeaderboard([])
      toast({
        title: '기록 삭제 완료',
        status: 'success',
        duration: 2000,
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const getRankColor = (rank) => {
    if (rank === 1) return 'yellow.400'
    if (rank === 2) return 'gray.300'
    if (rank === 3) return 'orange.400'
    return 'whiteAlpha.700'
  }

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}`
  }

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="800px">
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
              LEADERBOARD
            </Text>
            <Button
              variant="ghost"
              color="red.400"
              size="sm"
              onClick={handleClear}
              isDisabled={leaderboard.length === 0}
              _hover={{ color: 'red.300', bg: 'whiteAlpha.100' }}
            >
              초기화
            </Button>
          </HStack>

          {/* 리더보드 테이블 */}
          {leaderboard.length > 0 ? (
            <Box
              bg="whiteAlpha.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="whiteAlpha.100"
              overflow="hidden"
            >
              <TableContainer>
                <Table variant="simple" size="md">
                  <Thead bg="whiteAlpha.100">
                    <Tr>
                      <Th color="whiteAlpha.700" textAlign="center" w="60px">순위</Th>
                      <Th color="whiteAlpha.700">이름</Th>
                      <Th color="whiteAlpha.700" isNumeric>점수</Th>
                      <Th color="whiteAlpha.700" isNumeric>레벨</Th>
                      <Th color="whiteAlpha.700" isNumeric>라인</Th>
                      <Th color="whiteAlpha.700" textAlign="center">날짜</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {leaderboard.slice(0, 50).map((entry, index) => (
                      <Tr
                        key={entry.id}
                        _hover={{ bg: 'whiteAlpha.50' }}
                        transition="background 0.2s"
                      >
                        <Td textAlign="center">
                          <Text
                            fontFamily="mono"
                            fontWeight="bold"
                            color={getRankColor(index + 1)}
                            fontSize={index < 3 ? 'lg' : 'md'}
                          >
                            {getRankEmoji(index + 1)}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            color={index < 3 ? 'white' : 'whiteAlpha.800'}
                            fontWeight={index < 3 ? 'bold' : 'normal'}
                          >
                            {entry.name}
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Text
                            fontFamily="mono"
                            color={index === 0 ? 'neon.yellow' : 'white'}
                            fontWeight="bold"
                            textShadow={index === 0 ? '0 0 10px rgba(255, 255, 0, 0.5)' : 'none'}
                          >
                            {entry.score.toLocaleString()}
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Text fontFamily="mono" color="neon.cyan">
                            {entry.level}
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Text fontFamily="mono" color="neon.magenta">
                            {entry.lines}
                          </Text>
                        </Td>
                        <Td textAlign="center">
                          <Text fontSize="sm" color="whiteAlpha.500">
                            {formatDate(entry.date)}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box
              textAlign="center"
              py={16}
              bg="whiteAlpha.100"
              borderRadius="lg"
              border="1px dashed"
              borderColor="whiteAlpha.300"
            >
              <Text color="whiteAlpha.700" fontSize="lg" mb={4}>
                아직 기록이 없습니다
              </Text>
              <Button variant="neon" onClick={() => navigate('/game')}>
                게임 시작하기
              </Button>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default Leaderboard

