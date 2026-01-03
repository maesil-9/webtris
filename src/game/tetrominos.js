// 7종 테트로미노 정의
// 각 블록의 모양과 회전 상태 (SRS 표준)

export const TETROMINO_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']

// 테트로미노 색상
export const TETROMINO_COLORS = {
  I: '#00f0f0', // Cyan
  O: '#f0f000', // Yellow
  T: '#a000f0', // Purple
  S: '#00f000', // Green
  Z: '#f00000', // Red
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
}

// 각 테트로미노의 4가지 회전 상태 (0, 90, 180, 270도)
// 좌표는 왼쪽 상단이 (0,0)
export const TETROMINOS = {
  I: {
    shapes: [
      // 0도 (스폰 상태)
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      // 90도 (시계방향)
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
      // 180도
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
      ],
      // 270도 (반시계방향)
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
    color: TETROMINO_COLORS.I,
  },
  
  O: {
    shapes: [
      // O 블록은 회전해도 모양이 같음
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
      [
        [1, 1],
        [1, 1],
      ],
    ],
    color: TETROMINO_COLORS.O,
  },
  
  T: {
    shapes: [
      // 0도
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      // 90도
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
      // 180도
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      // 270도
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: TETROMINO_COLORS.T,
  },
  
  S: {
    shapes: [
      // 0도
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      // 90도
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
      // 180도
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      // 270도
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: TETROMINO_COLORS.S,
  },
  
  Z: {
    shapes: [
      // 0도
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      // 90도
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
      // 180도
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      // 270도
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
    ],
    color: TETROMINO_COLORS.Z,
  },
  
  J: {
    shapes: [
      // 0도
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      // 90도
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      // 180도
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      // 270도
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
    color: TETROMINO_COLORS.J,
  },
  
  L: {
    shapes: [
      // 0도
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      // 90도
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      // 180도
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      // 270도
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
    color: TETROMINO_COLORS.L,
  },
}

// 테트로미노 객체 생성
export const createPiece = (type) => {
  if (!TETROMINOS[type]) {
    throw new Error(`Invalid tetromino type: ${type}`)
  }
  
  return {
    type,
    shapes: TETROMINOS[type].shapes,
    color: TETROMINOS[type].color,
  }
}

// 현재 회전 상태의 모양 가져오기
export const getShape = (piece, rotation = 0) => {
  const normalizedRotation = ((rotation % 4) + 4) % 4
  return piece.shapes[normalizedRotation]
}

// 블록의 실제 셀 위치 계산
export const getCells = (piece, rotation, position) => {
  const shape = getShape(piece, rotation)
  const cells = []
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        cells.push({
          x: position.x + x,
          y: position.y + y,
        })
      }
    }
  }
  
  return cells
}

// 블록의 시작 위치 계산
export const getSpawnPosition = (piece, boardWidth, bufferHeight = 20) => {
  const shape = getShape(piece, 0)
  const pieceWidth = shape[0].length
  
  // 블록이 보이는 영역 상단에서 시작하도록 설정
  // bufferHeight 바로 아래에 스폰하여 즉시 보이게 함
  return {
    x: Math.floor((boardWidth - pieceWidth) / 2),
    y: bufferHeight, // 보이는 영역의 첫 번째 줄에서 시작
  }
}

export default {
  TETROMINO_TYPES,
  TETROMINO_COLORS,
  TETROMINOS,
  createPiece,
  getShape,
  getCells,
  getSpawnPosition,
}

