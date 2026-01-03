# WEBTRIS - 웹 테트리스

공식 테트리스 규칙(SRS, T-스핀 등)을 준수하는 웹 기반 테트리스 게임입니다.

![게임 화면](https://via.placeholder.com/600x400?text=Webtris+Game+Screen)

## 주요 기능

### 게임 기능
- **SRS (Super Rotation System)**: 공식 회전 시스템과 Wall Kick 지원
- **7-Bag Randomizer**: 공식 랜덤 시스템
- **T-Spin 감지**: T-Spin, T-Spin Mini, T-Spin Double/Triple 지원
- **Hold 기능**: 블록 보관 및 교체
- **Ghost Piece**: 착지 위치 미리보기
- **Next Queue**: 최대 6개 블록 미리보기
- **Lock Delay**: 설정 가능한 고정 지연 시간
- **DAS/ARR**: 키 반복 속도 설정

### 점수 시스템
- 라인 클리어 점수 (Single, Double, Triple, Tetris)
- T-Spin 보너스
- Back-to-Back 보너스
- 콤보 보너스
- Perfect Clear 보너스

### 관리자 설정 패널
모든 게임 파라미터를 조절할 수 있습니다:
- 점수 배율 및 개별 액션 점수
- 낙하 속도 및 레벨 곡선
- Lock Delay 시간 및 리셋 횟수
- DAS/ARR 설정
- 보드 크기
- 게임 기능 ON/OFF (Hold, Ghost, T-Spin 보너스 등)
- 사운드 볼륨

## 기술 스택

- **프레임워크**: React 18 + JavaScript
- **빌드 도구**: Vite
- **UI 라이브러리**: Chakra UI v2
- **사운드**: Web Audio API (Howler.js)
- **라우팅**: React Router v6
- **상태 관리**: React Context

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

## 조작법

| 키 | 동작 |
|----|------|
| ← / → | 좌우 이동 |
| ↑ / X | 시계방향 회전 |
| Z / Ctrl | 반시계방향 회전 |
| A | 180도 회전 |
| ↓ | Soft Drop |
| Space | Hard Drop |
| C / Shift | Hold |
| Esc / P | 일시정지 |

## 프로젝트 구조

```
src/
├── components/
│   ├── game/          # 게임 컴포넌트 (Board, Cell, Piece 등)
│   ├── ui/            # UI 컴포넌트 (StartScreen, GameScreen 등)
│   └── admin/         # 관리자 설정 패널
├── game/              # 게임 로직 (엔진, SRS, T-Spin, 점수 등)
├── context/           # React Context (게임 상태, 설정)
├── hooks/             # 커스텀 훅 (useGame, useKeyboard, useSound)
├── config/            # 기본 설정값
└── utils/             # 유틸리티 (로컬스토리지)
```

## 설정 항목

### 점수 설정
- 전체 점수 배율 (0.1x ~ 5x)
- 라인 클리어 기본 점수 (Single, Double, Triple, Tetris)
- T-Spin 점수 (Mini, Single, Double, Triple)
- 보너스 설정 (Back-to-Back, 콤보, Perfect Clear)

### 속도 설정
- 시작/최대 레벨
- 기본 낙하 간격
- 속도 배율
- 속도 곡선 (완만/표준/급격)
- Lock Delay 시간 및 리셋 횟수

### 조작 설정
- DAS (Delayed Auto Shift): 0~500ms
- ARR (Auto Repeat Rate): 0~200ms (0 = 즉시 끝까지)
- Soft Drop 속도

### 게임 설정
- 보드 크기 (가로: 6~20, 세로: 10~30)
- Hold 기능 ON/OFF
- Ghost Piece ON/OFF
- Next 미리보기 개수 (1~6)
- T-Spin 보너스 ON/OFF
- Back-to-Back 보너스 ON/OFF

## 라이선스

MIT License
