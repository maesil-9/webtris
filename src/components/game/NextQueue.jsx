import { Box, Text, VStack } from '@chakra-ui/react'
import { memo } from 'react'
import Piece from './Piece'

const NextQueue = memo(({ pieces, count = 5 }) => {
  const displayPieces = pieces.slice(0, count)

  return (
    <Box
      border="2px solid"
      borderColor="neon.magenta"
      bg="rgba(0, 0, 0, 0.6)"
      p={3}
      borderRadius="md"
      boxShadow="0 0 10px rgba(255, 0, 255, 0.2)"
    >
      <VStack spacing={2}>
        <Text
          fontFamily="heading"
          fontSize="sm"
          color="neon.magenta"
          textTransform="uppercase"
          letterSpacing="0.1em"
        >
          Next
        </Text>
        <VStack spacing={1}>
          {displayPieces.map((piece, index) => (
            <Box
              key={index}
              w="80px"
              h="60px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity={index === 0 ? 1 : 0.6 - index * 0.1}
              transform={index === 0 ? 'scale(1.1)' : 'scale(0.9)'}
              transition="all 0.2s"
            >
              <Piece 
                piece={piece} 
                cellSize={index === 0 ? 16 : 14} 
              />
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  )
})

NextQueue.displayName = 'NextQueue'

export default NextQueue

