# TRD (Technical Requirements Document)

## 1. 기술 스택

| 영역 | 기술 | 버전/비고 |
|------|------|-----------|
| 프레임워크 | React Native (Expo) | Expo SDK 52+ |
| 라우팅 | expo-router | 파일 기반 라우팅 |
| 상태 관리 | Zustand | 경량 상태 관리 |
| 데이터베이스 | SQLite (expo-sqlite) | 로컬 영구 저장 |
| 음성인식 | expo-speech-recognition 또는 @react-native-voice/voice | 온디바이스 STT |
| 차트 | react-native-chart-kit 또는 victory-native | 감정 흐름/완료율 시각화 |
| 언어 | TypeScript | 타입 안전성 확보 |
| 스타일링 | StyleSheet (React Native 기본) | NativeWind 선택적 도입 가능 |

## 2. 아키텍처

### 2.1 전체 아키텍처

```
┌─────────────────────────────────────────────┐
│                  UI Layer                    │
│  (React Native Components + expo-router)    │
├─────────────────────────────────────────────┤
│               State Layer                   │
│           (Zustand Stores)                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │dailyNote │ │  todo    │ │  settings   │ │
│  │  Store   │ │  Store   │ │   Store     │ │
│  └──────────┘ └──────────┘ └─────────────┘ │
├─────────────────────────────────────────────┤
│             Service Layer                   │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │ Database │ │   STT    │ │  Backup     │ │
│  │ Service  │ │ Service  │ │  Service    │ │
│  └──────────┘ └──────────┘ └─────────────┘ │
├─────────────────────────────────────────────┤
│            Storage Layer                    │
│         (SQLite - expo-sqlite)              │
│         (AsyncStorage - 설정)               │
└─────────────────────────────────────────────┘
```

### 2.2 데이터 흐름

```
사용자 입력 → Component → Zustand Action → DB Service → SQLite
                ↑                                          │
                └──────── Zustand State ← DB Query ────────┘
```

- 모든 데이터는 로컬 SQLite에 저장
- Zustand는 현재 화면에 필요한 데이터만 메모리에 보유
- 날짜 변경 시 해당 날짜 데이터를 DB에서 로드

## 3. 파일 구조

```
dailynote/
├── app/                          # expo-router 파일 기반 라우팅
│   ├── _layout.tsx               # 루트 레이아웃 (탭 네비게이션)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # 탭 레이아웃
│   │   ├── index.tsx             # 메인: 오늘의 데일리노트 (/daily)
│   │   ├── stats.tsx             # 통계/인사이트 (/stats)
│   │   └── settings.tsx          # 설정 (/settings)
│   └── +not-found.tsx            # 404 처리
├── components/                   # 재사용 가능한 컴포넌트
│   ├── common/                   # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── CheckBox.tsx
│   ├── daily/                    # 데일리노트 화면 컴포넌트
│   │   ├── DateHeader.tsx
│   │   ├── EmotionScore.tsx
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── DiaryEditor.tsx
│   │   └── MicButton.tsx
│   └── stats/                    # 통계 화면 컴포넌트
│       ├── EmotionChart.tsx
│       ├── CompletionChart.tsx
│       └── StreakCounter.tsx
├── stores/                       # Zustand 스토어
│   ├── useDailyNoteStore.ts
│   ├── useTodoStore.ts
│   └── useSettingsStore.ts
├── services/                     # 비즈니스 로직 및 외부 서비스
│   ├── database.ts               # SQLite 초기화 및 쿼리
│   ├── stt.ts                    # 음성인식 서비스
│   └── backup.ts                 # 데이터 백업/복원
├── hooks/                        # 커스텀 훅
│   ├── useDatabase.ts
│   ├── useSpeechRecognition.ts
│   └── useSwipeNavigation.ts
├── utils/                        # 유틸리티 함수
│   ├── date.ts                   # 날짜 관련 유틸
│   └── constants.ts              # 상수 정의
├── types/                        # TypeScript 타입 정의
│   └── index.ts
├── assets/                       # 정적 리소스
│   ├── fonts/
│   └── images/
├── app.json                      # Expo 설정
├── tsconfig.json
├── package.json
└── .eslintrc.js
```

## 4. 성능 요구사항

| 항목 | 목표 |
|------|------|
| 앱 초기 로딩 | 2초 이내 |
| 화면 전환 | 300ms 이내 |
| 할일 추가/체크 반응 | 100ms 이내 (즉각 반응) |
| 일기 자동 저장 | 입력 중지 후 1초 디바운스 |
| STT 응답 | 실시간 (온디바이스) |
| 날짜 스와이프 전환 | 200ms 이내 |
| SQLite 쿼리 | 50ms 이내 |
| 메모리 사용량 | 100MB 이하 |

## 5. 개발 환경

### 5.1 필수 도구

| 도구 | 용도 |
|------|------|
| Node.js | v18+ |
| npm/yarn | 패키지 관리 |
| Expo CLI | 프로젝트 빌드/실행 |
| Expo Go | 개발 중 실기기 테스트 |
| VS Code | 코드 에디터 |
| Android Studio / Xcode | 에뮬레이터 (선택) |

### 5.2 주요 의존성

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-sqlite": "~15.0.0",
    "expo-speech-recognition": "~0.5.0",
    "react-native-chart-kit": "^6.12.0",
    "zustand": "^5.0.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "@expo/vector-icons": "^14.0.0"
  },
  "devDependencies": {
    "typescript": "~5.6.0",
    "eslint": "^9.0.0",
    "prettier": "^3.4.0",
    "@types/react": "~18.3.0"
  }
}
```

### 5.3 환경 설정

- TypeScript strict 모드 활성화
- ESLint + Prettier 자동 포매팅
- 절대 경로 임포트 (`@/components`, `@/stores` 등)
- Expo EAS Build를 통한 빌드 (추후)

## 6. 보안 및 데이터

- 모든 데이터는 디바이스 로컬에만 저장 (서버 전송 없음)
- 백업/복원은 JSON 파일 내보내기/가져오기 방식
- 민감 데이터 암호화는 MVP 이후 고려
- 앱 삭제 시 모든 데이터 삭제됨 (사용자에게 안내 필요)
