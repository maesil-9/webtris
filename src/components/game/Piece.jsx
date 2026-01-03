import { Box, Grid } from '@chakra-ui/react'
import { memo, useMemo } from 'react'
import Cell from './Cell'
import { getShape } from '../../game/tetrominos'

const Piece = memo(({ piece, rotation = 0, cellSize = 20, showEmpty = false }) => {
  if (!piece) {
    if (showEmpty) {
      return (
        <Box
          w={`${cellSize * 4}px`}
          h={`${cellSize * 4}px`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          opacity={0.3}
        >
          <Box
            w={`${cellSize * 2}px`}
            h={`${cellSize * 2}px`}
            border="1px dashed"
            borderColor="whiteAlpha.300"
          />
        </Box>
      )
    }
    return null
  }

  const shape = useMemo(() => getShape(piece, rotation), [piece, rotation])

  // I와 O 블록은 4x4, 나머지는 3x3
  const gridSize = piece.type === 'I' || piece.type === 'O' ? 4 : 3
  
  // 모양을 그리드 크기에 맞게 조정
  const adjustedShape = useMemo(() => {
    if (shape.length === gridSize) return shape
    
    // 패딩 추가
    const padded = []
    for (let y = 0; y < gridSize; y++) {
      padded[y] = []
      for (let x = 0; x < gridSize; x++) {
        if (y < shape.length && x < shape[y].length) {
          padded[y][x] = shape[y][x]
        } else {
          padded[y][x] = 0
        }
      }
    }
    return padded
  }, [shape, gridSize])

  return (
    <Grid
      templateColumns={`repeat(${gridSize}, ${cellSize}px)`}
      templateRows={`repeat(${gridSize}, ${cellSize}px)`}
      gap="0"
    >
      {adjustedShape.map((row, y) =>
        row.map((cell, x) => (
          <Box key={`${x}-${y}`} w={`${cellSize}px`} h={`${cellSize}px`}>
            {cell ? (
              <Cell color={piece.color} size={cellSize} />
            ) : (
              <Box w="100%" h="100%" />
            )}
          </Box>
        ))
      )}
    </Grid>
  )
})

Piece.displayName = 'Piece'

export default Piece

