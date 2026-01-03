import { Box, Text, VStack } from '@chakra-ui/react'
import { memo } from 'react'
import Piece from './Piece'

const HoldBox = memo(({ piece, canHold }) => {
  return (
    <Box
      border="2px solid"
      borderColor={canHold ? 'neon.cyan' : 'red.500'}
      bg="rgba(0, 0, 0, 0.6)"
      p={3}
      borderRadius="md"
      boxShadow={canHold 
        ? '0 0 10px rgba(0, 255, 255, 0.2)' 
        : '0 0 10px rgba(255, 0, 0, 0.2)'
      }
      transition="all 0.2s"
    >
      <VStack spacing={2}>
        <Text
          fontFamily="heading"
          fontSize="sm"
          color={canHold ? 'neon.cyan' : 'red.400'}
          textTransform="uppercase"
          letterSpacing="0.1em"
        >
          Hold
        </Text>
        <Box
          w="80px"
          h="80px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          opacity={canHold ? 1 : 0.5}
        >
          <Piece piece={piece} cellSize={18} showEmpty />
        </Box>
      </VStack>
    </Box>
  )
})

HoldBox.displayName = 'HoldBox'

export default HoldBox

