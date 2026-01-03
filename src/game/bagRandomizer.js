// 7-Bag Randomizer
// 공식 테트리스 가이드라인 랜덤 시스템

import { TETROMINO_TYPES, createPiece } from './tetrominos'

/**
 * 7-Bag 시스템:
 * 7개의 테트로미노를 하나의 "가방"에 넣고 섞어서 순서대로 제공
 * 가방이 비면 새로운 가방 생성
 * 이 방식으로 같은 블록이 연속으로 많이 나오는 것을 방지
 */

// Fisher-Yates 셔플 알고리즘
const shuffle = (array) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 새 가방 생성
const createBag = () => {
  return shuffle([...TETROMINO_TYPES])
}

// BagRandomizer 클래스
export class BagRandomizer {
  constructor() {
    this.currentBag = []
    this.nextBag = []
    this.history = []
    
    // 초기 가방 2개 생성
    this.refillBags()
  }
  
  // 가방 리필
  refillBags() {
    if (this.currentBag.length === 0) {
      this.currentBag = this.nextBag.length > 0 ? this.nextBag : createBag()
      this.nextBag = createBag()
    }
  }
  
  // 다음 블록 타입 가져오기
  getNextType() {
    this.refillBags()
    
    const type = this.currentBag.shift()
    this.history.push(type)
    
    // 히스토리 최대 100개 유지
    if (this.history.length > 100) {
      this.history.shift()
    }
    
    this.refillBags()
    
    return type
  }
  
  // 다음 블록 피스 가져오기
  getNext() {
    const type = this.getNextType()
    return createPiece(type)
  }
  
  // 다음 N개 블록 미리보기 (가져오지 않음)
  peekNext(count) {
    this.refillBags()
    
    const preview = []
    const tempCurrentBag = [...this.currentBag]
    let tempNextBag = [...this.nextBag]
    
    for (let i = 0; i < count; i++) {
      if (tempCurrentBag.length === 0) {
        tempCurrentBag.push(...tempNextBag)
        tempNextBag = createBag()
      }
      
      const type = tempCurrentBag.shift()
      preview.push(createPiece(type))
    }
    
    return preview
  }
  
  // 리셋
  reset() {
    this.currentBag = []
    this.nextBag = []
    this.history = []
    this.refillBags()
  }
  
  // 상태 가져오기 (디버그용)
  getState() {
    return {
      currentBag: [...this.currentBag],
      nextBag: [...this.nextBag],
      history: [...this.history],
    }
  }
}

// 싱글톤 인스턴스 생성 함수
export const createBagRandomizer = () => {
  return new BagRandomizer()
}

export default {
  BagRandomizer,
  createBagRandomizer,
}

