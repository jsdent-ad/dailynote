# DailyNote TASKS.md

> Domain-Guarded 태스크 구조 v2.0
> 생성일: 2026-04-28
> ICV 커버리지: 100%

---

## Phase 0: 프로젝트 셋업

### P0-T0.1: Expo 프로젝트 초기화
- **설명**: `npx create-expo-app` 으로 Expo 프로젝트 생성 (TypeScript 템플릿)
- **산출물**: 프로젝트 루트에 Expo 프로젝트 구조
- **의존성**: 없음
- **TDD**: N/A (셋업)

### P0-T0.2: 핵심 의존성 설치
- **설명**: expo-router, zustand, expo-sqlite, expo-speech-recognition, react-native-chart-kit, react-native-gesture-handler 설치
- **산출물**: package.json에 의존성 추가
- **의존성**: P0-T0.1
- **TDD**: N/A (셋업)

### P0-T0.3: 디렉토리 구조 생성
- **설명**: app/, components/, services/, stores/, types/, constants/ 디렉토리 구조 생성
- **산출물**: 디렉토리 구조 + TypeScript 설정 (tsconfig.json path aliases)
- **의존성**: P0-T0.1
- **TDD**: N/A (셋업)

```
app/
├── (tabs)/
│   ├── _layout.tsx       # 탭 레이아웃
│   ├── index.tsx         # 데일리노트 (기본)
│   ├── stats.tsx         # 통계
│   └── settings.tsx      # 설정
├── _layout.tsx           # 루트 레이아웃
components/
├── daily/                # 데일리노트 컴포넌트
├── stats/                # 통계 컴포넌트
├── settings/             # 설정 컴포넌트
└── shared/               # 공통 컴포넌트
services/
├── database.ts           # SQLite 초기화/마이그레이션
├── dailyNotes.ts         # daily_notes CRUD
├── todos.ts              # todos CRUD
├── stats.ts              # 통계 쿼리
└── backup.ts             # 백업/복원
stores/
├── useDailyStore.ts      # 데일리노트 상태
├── useStatsStore.ts      # 통계 상태
└── useThemeStore.ts      # 테마 상태
types/
└── index.ts              # DailyNote, Todo, CompletionStat 등
constants/
└── theme.ts              # 색상, 타이포그래피, 간격
```

---

## Phase 1: 공통 인프라

### P1-R1: Database 서비스
- **설명**: SQLite 초기화 + 테이블 생성 + 마이그레이션 시스템
- **산출물**: `services/database.ts`
- **의존성**: P0-T0.2
- **TDD**: RED → GREEN → REFACTOR
- **테스트**: DB 초기화 성공, 테이블 존재 확인, 마이그레이션 버전 체크
- **리소스 참조**: `resources.yaml` → daily_notes, todos 테이블 DDL

### P1-S0-T1: 공통 레이아웃 (BottomTabBar)
- **설명**: expo-router 탭 네비게이션 구조 + BottomTabBar 컴포넌트
- **산출물**: `app/(tabs)/_layout.tsx`, `components/shared/BottomTabBar.tsx`
- **의존성**: P0-T0.3
- **TDD**: RED → GREEN → REFACTOR
- **테스트**: 3개 탭 렌더링, 탭 전환 동작
- **컴포넌트 참조**: `shared/components.yaml` → BottomTabBar

### P1-S0-T2: 테마 시스템
- **설명**: light/dark 테마 + Zustand store + AsyncStorage 영속화
- **산출물**: `stores/useThemeStore.ts`, `constants/theme.ts`
- **의존성**: P0-T0.2
- **TDD**: RED → GREEN → REFACTOR
- **테스트**: 기본 테마 light, 토글 동작, 재시작 시 유지

---

## Phase 2: 핵심 기능 — 데일리노트

### P2-R1: daily_notes Resource
- **설명**: daily_notes 테이블 CRUD 서비스 (get_by_date, upsert_by_date, get_range, get_streak, export_all)
- **산출물**: `services/dailyNotes.ts`, `types/index.ts` (DailyNote 타입)
- **의존성**: P1-R1
- **TDD**: RED → GREEN → REFACTOR
- **테스트**:
  - get_by_date: 존재하는 날짜 → 데이터 반환, 없는 날짜 → null
  - upsert_by_date: 새 날짜 → INSERT, 기존 날짜 → UPDATE
  - get_range: 7일/30일 범위 데이터 반환
  - get_streak: 연속 기록일 정확한 계산
- **리소스 참조**: `resources.yaml` → daily_notes

### P2-R2: todos Resource
- **설명**: todos 테이블 CRUD 서비스 (list_by_date, create, toggle_complete, delete, reorder, carry_over, get_completion_stats, export_all)
- **산출물**: `services/todos.ts`, `types/index.ts` (Todo 타입)
- **의존성**: P1-R1
- **TDD**: RED → GREEN → REFACTOR
- **테스트**:
  - list_by_date: display_order 정렬 확인
  - create: 새 할일 추가 + 자동 order
  - toggle_complete: 0↔1 토글
  - delete: 삭제 후 목록에서 제거
  - carry_over: 어제 미완료 → 오늘 이월 (중복 방지)
  - get_completion_stats: 날짜별 완료율 정확한 계산
- **리소스 참조**: `resources.yaml` → todos
- **병렬 가능**: P2-R1과 병렬 실행 가능

### P2-S1-T1: 데일리노트 화면 UI
- **설명**: DateHeader + EmotionScore + TodoList + TodoItem + TodoAdd + DiaryEditor 컴포넌트
- **산출물**: `components/daily/` 하위 컴포넌트들, `app/(tabs)/index.tsx`
- **의존성**: P2-R1, P2-R2, P1-S0-T1
- **TDD**: RED → GREEN → REFACTOR
- **테스트**: 각 컴포넌트 렌더링, 데이터 표시, 레이아웃 스크롤
- **화면 참조**: `specs/screens/daily-note.yaml`

### P2-S1-T2: 데일리노트 인터랙션
- **설명**: 좌우 스와이프 날짜 이동 + 자동 저장(1초 디바운스) + 할일 CRUD + 감정 즉시 저장
- **산출물**: `stores/useDailyStore.ts`, 컴포넌트 인터랙션 로직
- **의존성**: P2-S1-T1
- **TDD**: RED → GREEN → REFACTOR
- **테스트**:
  - 스와이프 → 날짜 변경 + 데이터 재로드
  - 일기 타이핑 → 1초 후 자동 저장
  - 할일 추가/체크/삭제 → DB 반영
  - 감정 선택 → 즉시 upsert
  - 미완료 자동 이월 → 앱 실행 시 트리거

### P2-S1-T3: STT 음성 입력
- **설명**: MicButton 컴포넌트 + expo-speech-recognition 연동
- **산출물**: `components/daily/MicButton.tsx`, STT 서비스 로직
- **의존성**: P2-S1-T1
- **TDD**: RED → GREEN → REFACTOR
- **테스트**:
  - 버튼 탭 → 녹음 시작 상태
  - 인식 결과 → diary_text에 append
  - 권한 미허용 → 권한 요청 다이얼로그
- **병렬 가능**: P2-S1-T2와 병렬 실행 가능

### P2-S1-V: 데일리노트 연결점 검증
- **설명**: Resource(daily_notes, todos) ↔ Screen(데일리노트) 연결 E2E 검증
- **산출물**: 검증 체크리스트 통과
- **의존성**: P2-S1-T2, P2-S1-T3
- **검증 항목**:
  - [ ] 감정 스코어 선택 → DB 저장 → 화면 반영
  - [ ] 할일 추가 → DB 저장 → 목록 표시
  - [ ] 할일 체크 → DB 업데이트 → 시각 피드백
  - [ ] 일기 작성 → 자동 저장 → 재접속 시 유지
  - [ ] 음성 입력 → 텍스트 변환 → 일기에 추가
  - [ ] 날짜 스와이프 → 해당 날짜 데이터 로드
  - [ ] 미완료 이월 → 어제 미완료가 오늘에 표시

---

## Phase 3: 통계/인사이트

### P3-R1: 통계 서비스
- **설명**: 감정 흐름, 완료율, Streak 쿼리를 통합한 통계 서비스
- **산출물**: `services/stats.ts`
- **의존성**: P2-R1, P2-R2
- **TDD**: RED → GREEN → REFACTOR
- **테스트**:
  - 주간 감정 흐름: 7일 데이터 반환, 빈 날짜 처리
  - 주간 완료율: 날짜별 완료/전체 비율
  - 월간 전환: 30일 데이터
  - Streak: 연속 0일, 1일, 7일 시나리오
- **리소스 참조**: `resources.yaml` → daily_notes.get_range, daily_notes.get_streak, todos.get_completion_stats

### P3-S1-T1: 통계 화면 UI
- **설명**: PeriodToggle + EmotionChart (라인) + CompletionChart (바) + StreakCounter
- **산출물**: `components/stats/` 하위 컴포넌트들, `app/(tabs)/stats.tsx`
- **의존성**: P3-R1, P1-S0-T1
- **TDD**: RED → GREEN → REFACTOR
- **테스트**:
  - 주간 기본 표시: 라인+바 차트 렌더링
  - 월간 전환: 차트 데이터 교체
  - 데이터 없음: EmptyState 표시
  - Streak 카운터: 숫자 + 아이콘
- **화면 참조**: `specs/screens/stats.yaml`
- **Zustand store**: `stores/useStatsStore.ts`

### P3-S1-V: 통계 연결점 검증
- **설명**: Resource(daily_notes, todos) ↔ Screen(통계) 연결 E2E 검증
- **산출물**: 검증 체크리스트 통과
- **의존성**: P3-S1-T1
- **검증 항목**:
  - [ ] 감정 기록 후 통계 탭 → 차트에 반영
  - [ ] 할일 완료 후 통계 탭 → 완료율 반영
  - [ ] 주간↔월간 토글 → 차트 데이터 변경
  - [ ] 신규 사용자 → '기록을 시작해보세요' 메시지

---

## Phase 4: 설정

### P4-S1-T1: 설정 화면 UI
- **설명**: 테마 토글 + 백업/복원 버튼 + 앱 정보 (그룹 리스트 레이아웃)
- **산출물**: `components/settings/` 하위 컴포넌트들, `app/(tabs)/settings.tsx`
- **의존성**: P1-S0-T1, P1-S0-T2
- **TDD**: RED → GREEN → REFACTOR
- **테스트**: 그룹 리스트 렌더링, 테마 토글 동작, 버전 표시
- **화면 참조**: `specs/screens/settings.yaml`

### P4-S1-T2: 백업/복원 기능
- **설명**: JSON 데이터 내보내기 (공유 시트) + 가져오기 (파일 선택 + 확인 다이얼로그)
- **산출물**: `services/backup.ts`, 복원 확인 다이얼로그
- **의존성**: P4-S1-T1, P2-R1, P2-R2
- **TDD**: RED → GREEN → REFACTOR
- **테스트**:
  - 백업: 전체 데이터 JSON 생성 + 공유 시트 오픈
  - 복원: 올바른 JSON → 데이터 교체 + 성공 알림
  - 복원 실패: 잘못된 파일 → 에러 알림, 기존 데이터 유지
- **컴포넌트 참조**: `shared/components.yaml` → ConfirmDialog

### P4-S1-V: 설정 연결점 검증
- **설명**: 설정 화면 전체 E2E 검증
- **산출물**: 검증 체크리스트 통과
- **의존성**: P4-S1-T2
- **검증 항목**:
  - [ ] 테마 토글 → 전체 앱 테마 변경
  - [ ] 앱 재시작 → 선택된 테마 유지
  - [ ] 백업 → JSON 파일 공유 → 복원 → 데이터 일치
  - [ ] 잘못된 파일 복원 → 에러 + 데이터 무결성

---

## 의존성 그래프

```
P0-T0.1 ─┬─ P0-T0.2 ──── P1-R1 ─┬─ P2-R1 ─┐
          │                       │          │
          └─ P0-T0.3 ─── P1-S0-T1│   P2-R2 ─┼─ P2-S1-T1 ─┬─ P2-S1-T2 ─┐
                                  │          │              │              │
                          P1-S0-T2│          │              └─ P2-S1-T3 ─┤
                                  │          │                             │
                                  │          │              P2-S1-V ◄─────┘
                                  │          │
                                  └──────────┼─ P3-R1 ─── P3-S1-T1 ─── P3-S1-V
                                             │
                                             └─ P4-S1-T1 ─ P4-S1-T2 ─── P4-S1-V
```

## 병렬 실행 가능 그룹

| 그룹 | 태스크 | 조건 |
|------|--------|------|
| Setup | P0-T0.2, P0-T0.3 | P0-T0.1 완료 후 |
| 인프라 | P1-R1, P1-S0-T1, P1-S0-T2 | 각각 독립 |
| Resource | P2-R1, P2-R2 | P1-R1 완료 후 병렬 |
| STT | P2-S1-T3 | P2-S1-T2와 병렬 가능 |
