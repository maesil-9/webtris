import { Box, Grid } from '@chakra-ui/react'
import { memo, useMemo } from 'react'
import Cell from './Cell'
import { getCells } from '../../game/tetrominos'

const Board = memo(({ 
  board, 
  currentPiece, 
  currentPosition, 
  currentRotation, 
  ghostPosition,
  cellSize = 28,
  bufferHeight = 20,
}) => {
  // 보이는 영역만 추출 (버퍼 제외)
  const visibleBoard = useMemo(() => {
    return board.slice(bufferHeight)
  }, [board, bufferHeight])

  // 현재 블록의 셀 위치 계산 (보이는 영역 기준)
  const currentCells = useMemo(() => {
    if (!currentPiece) return []
    const cells = getCells(currentPiece, currentRotation, currentPosition)
    return cells
      .map(cell => ({ 
        x: cell.x, 
        y: cell.y - bufferHeight,
        color: currentPiece.color 
      }))
      .filter(cell => cell.y >= 0 && cell.y < (board.length - bufferHeight))
  }, [currentPiece, currentRotation, currentPosition, bufferHeight, board.length])

  // 고스트 블록의 셀 위치 계산
  const ghostCells = useMemo(() => {
    if (!currentPiece || !ghostPosition) return []
    const cells = getCells(currentPiece, currentRotation, ghostPosition)
    return cells
      .map(cell => ({ 
        x: cell.x, 
        y: cell.y - bufferHeight,
        color: currentPiece.color 
      }))
      .filter(cell => cell.y >= 0 && cell.y < (board.length - bufferHeight))
  }, [currentPiece, currentRotation, ghostPosition, bufferHeight, board.length])

  // 셀이 현재 블록에 속하는지 확인
  const isCurrentCell = (x, y) => {
    return currentCells.some(cell => cell.x === x && cell.y === y)
  }

  // 셀이 고스트에 속하는지 확인
  const isGhostCell = (x, y) => {
    return ghostCells.some(cell => cell.x === x && cell.y === y) && !isCurrentCell(x, y)
  }

  const boardWidth = visibleBoard[0]?.length || 10
  const boardHeight = visibleBoard.length || 20

  return (
    <Box
      position="relative"
      border="3px solid"
      borderColor="neon.cyan"
      boxShadow="0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)"
      bg="rgba(0, 0, 0, 0.8)"
      p="2px"
    >
      <Grid
        templateColumns={`repeat(${boardWidth}, ${cellSize}px)`}
        templateRows={`repeat(${boardHeight}, ${cellSize}px)`}
        gap="0"
      >
        {visibleBoard.map((row, y) =>
          row.map((cell, x) => {
            // 현재 블록 셀
            if (isCurrentCell(x, y)) {
              return (
                <Cell 
                  key={`${x}-${y}`} 
                  color={currentPiece.color} 
                  size={cellSize}
                />
              )
            }
            
            // 고스트 셀
            if (isGhostCell(x, y)) {
              return (
                <Cell 
                  key={`${x}-${y}`} 
                  color={currentPiece.color}
                  isGhost 
                  size={cellSize}
                />
              )
            }
            
            // 일반 셀 또는 고정된 블록
            return (
              <Cell 
                key={`${x}-${y}`} 
                color={cell} 
                size={cellSize}
              />
            )
          })
        )}
      </Grid>
    </Box>
  )
})

Board.displayName = 'Board'

export default Board

