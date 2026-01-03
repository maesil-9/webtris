import { Box } from '@chakra-ui/react'
import { memo } from 'react'

const Cell = memo(({ color, isGhost, size = 28 }) => {
  // 빈 셀
  if (!color && !isGhost) {
    return (
      <Box
        w={`${size}px`}
        h={`${size}px`}
        bg="#1a1a2e"
        border="1px solid"
        borderColor="#16213e"
        boxSizing="border-box"
      />
    )
  }

  // 고스트 피스
  if (isGhost) {
    return (
      <Box
        w={`${size}px`}
        h={`${size}px`}
        bg="transparent"
        border="2px dashed"
        borderColor={color || 'rgba(255, 255, 255, 0.4)'}
        boxSizing="border-box"
        opacity={0.5}
      />
    )
  }

  // 채워진 셀 (색상이 있는 블록)
  const safeColor = color || '#ffffff'
  
  return (
    <Box
      w={`${size}px`}
      h={`${size}px`}
      bg={safeColor}
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.3)"
      boxSizing="border-box"
      position="relative"
      style={{
        boxShadow: `inset 3px 3px 6px rgba(255,255,255,0.4), inset -3px -3px 6px rgba(0,0,0,0.4), 0 0 12px ${safeColor}`,
      }}
    >
      {/* 하이라이트 효과 */}
      <Box
        position="absolute"
        top="2px"
        left="2px"
        w="40%"
        h="40%"
        bg="rgba(255, 255, 255, 0.5)"
        borderRadius="2px"
      />
    </Box>
  )
})

Cell.displayName = 'Cell'

export default Cell

