# Design System

## 1. 디자인 원칙

- **미니멀**: 불필요한 장식 없이 콘텐츠에 집중
- **감성적**: 따뜻하고 부드러운 색상으로 기록하는 즐거움 제공
- **일관성**: 모든 화면에서 동일한 컴포넌트와 스타일 사용
- **접근성**: 충분한 명도 대비, 터치 영역 확보

## 2. 색상 팔레트

### 2.1 라이트 테마

| 역할 | 이름 | HEX | 용도 |
|------|------|-----|------|
| Primary | Warm Coral | `#FF6B6B` | 주요 액션, 강조 |
| Primary Light | Soft Coral | `#FFE0E0` | 배경 강조, 선택 상태 |
| Secondary | Calm Blue | `#4ECDC4` | 보조 액션, 완료 상태 |
| Background | Warm White | `#FAFAF8` | 앱 배경 |
| Surface | Pure White | `#FFFFFF` | 카드, 입력 영역 배경 |
| Text Primary | Dark Charcoal | `#2D3436` | 본문 텍스트 |
| Text Secondary | Warm Gray | `#636E72` | 보조 텍스트, 플레이스홀더 |
| Text Tertiary | Light Gray | `#B2BEC3` | 비활성 텍스트 |
| Border | Soft Border | `#E8E8E4` | 구분선, 테두리 |
| Success | Soft Green | `#00B894` | 완료, 성공 |
| Warning | Warm Yellow | `#FDCB6E` | 경고 |
| Error | Soft Red | `#E17055` | 에러, 삭제 |

### 2.2 다크 테마

| 역할 | 이름 | HEX | 용도 |
|------|------|-----|------|
| Primary | Warm Coral | `#FF6B6B` | 주요 액션 (동일) |
| Primary Light | Deep Coral | `#3D2020` | 배경 강조 |
| Secondary | Calm Blue | `#4ECDC4` | 보조 액션 (동일) |
| Background | Deep Dark | `#1A1A2E` | 앱 배경 |
| Surface | Dark Surface | `#252540` | 카드 배경 |
| Text Primary | Off White | `#EAEAEA` | 본문 텍스트 |
| Text Secondary | Muted Gray | `#9E9E9E` | 보조 텍스트 |
| Text Tertiary | Dark Gray | `#666666` | 비활성 텍스트 |
| Border | Dark Border | `#3A3A5C` | 구분선 |

### 2.3 감정 스코어 색상

| 점수 | 색상 | HEX | 의미 |
|------|------|-----|------|
| 1점 | Storm Blue | `#74B9FF` | 우울/힘듦 |
| 2점 | Cloudy Lavender | `#A29BFE` | 불안/걱정 |
| 3점 | Neutral Mint | `#81ECEC` | 보통 |
| 4점 | Sunny Yellow | `#FFEAA7` | 좋음 |
| 5점 | Radiant Coral | `#FF6B6B` | 최고 |

## 3. 타이포그래피

### 3.1 폰트 패밀리

- **기본 폰트**: System Default (iOS: SF Pro, Android: Roboto)
- **한국어 최적화**: 시스템 기본 한글 폰트 사용
- 커스텀 폰트 도입 시: Pretendard 또는 Noto Sans KR 고려

### 3.2 타입 스케일

| 이름 | 크기 | 굵기 | 행간 | 용도 |
|------|------|------|------|------|
| heading1 | 28px | Bold (700) | 36px | 화면 타이틀 |
| heading2 | 22px | SemiBold (600) | 30px | 섹션 타이틀 |
| heading3 | 18px | SemiBold (600) | 26px | 카드 타이틀 |
| body1 | 16px | Regular (400) | 24px | 본문, 할일 텍스트 |
| body2 | 14px | Regular (400) | 20px | 보조 텍스트 |
| caption | 12px | Regular (400) | 16px | 날짜, 메타 정보 |
| button | 16px | SemiBold (600) | 20px | 버튼 텍스트 |

## 4. 간격 시스템 (Spacing)

4의 배수 기반 간격 시스템을 사용한다.

| 토큰 | 값 | 용도 |
|------|-----|------|
| xs | 4px | 아이콘-텍스트 간격, 미세 간격 |
| sm | 8px | 관련 요소 간 간격 |
| md | 12px | 컴포넌트 내부 패딩 |
| base | 16px | 기본 간격, 화면 좌우 패딩 |
| lg | 20px | 섹션 간 간격 |
| xl | 24px | 큰 섹션 간 간격 |
| 2xl | 32px | 주요 영역 간 간격 |
| 3xl | 48px | 화면 상하 여백 |

### 화면 패딩

- 좌우 패딩: 16px (base)
- 상단 Safe Area 포함
- 하단 탭 바 높이: 60px + Safe Area

## 5. 컴포넌트

### 5.1 Button

```
[Button]
├── variant: primary | secondary | ghost | danger
├── size: sm (32px) | md (44px) | lg (52px)
├── state: default | pressed | disabled
├── 모서리: 12px border-radius
└── 최소 터치 영역: 44x44px
```

| Variant | 배경색 | 텍스트색 | 테두리 |
|---------|--------|----------|--------|
| primary | #FF6B6B | #FFFFFF | 없음 |
| secondary | transparent | #FF6B6B | 1px #FF6B6B |
| ghost | transparent | #636E72 | 없음 |
| danger | #E17055 | #FFFFFF | 없음 |

### 5.2 Input (텍스트 입력)

```
[Input]
├── 높이: 44px (단일 라인) / auto (멀티라인)
├── 배경: Surface (#FFFFFF)
├── 테두리: 1px #E8E8E4
├── 모서리: 10px
├── 패딩: 12px 16px
├── 포커스 시: 테두리 #FF6B6B
└── 플레이스홀더: Text Tertiary (#B2BEC3)
```

### 5.3 CheckBox (할일 체크박스)

```
[CheckBox]
├── 크기: 24x24px
├── 미완료: 빈 원형, 테두리 #B2BEC3
├── 완료: 채워진 원형, 배경 #4ECDC4, 체크마크 #FFFFFF
├── 완료 시 텍스트: 취소선 + Text Tertiary 색상
└── 터치 영역: 44x44px
```

### 5.4 Card

```
[Card]
├── 배경: Surface (#FFFFFF)
├── 모서리: 16px
├── 그림자: 0 2px 8px rgba(0,0,0,0.06)
├── 패딩: 16px
└── 카드 간 간격: 12px
```

### 5.5 EmotionScore (감정 스코어)

```
[EmotionScore]
├── 레이아웃: 가로 5개 원형 버튼
├── 각 원형 크기: 40x40px
├── 간격: 12px
├── 미선택: 테두리만, 숫자 표시
├── 선택: 해당 점수 색상으로 채워짐
├── 선택 시 애니메이션: scale 1.0 → 1.2 → 1.0
└── 하단 레이블: "힘듦" ... "최고"
```

### 5.6 MicButton (마이크 버튼)

```
[MicButton]
├── 크기: 48x48px (원형)
├── 기본 상태: 배경 #FF6B6B, 마이크 아이콘 #FFFFFF
├── 녹음 중: 배경 #E17055, 펄스 애니메이션 (바깥 원 확대/축소)
├── 녹음 중 표시: 외곽에 파동 효과
├── 위치: 일기 입력 영역 우측 하단
└── 비활성: 배경 #B2BEC3
```

### 5.7 DateHeader (날짜 헤더)

```
[DateHeader]
├── 레이아웃: 좌측 화살표 | 날짜 텍스트 | 우측 화살표
├── 날짜 형식: "4월 28일 월요일"
├── 오늘: "오늘" 뱃지 표시
├── 좌우 화살표: 날짜 이동 (스와이프 대안)
└── 높이: 48px
```

### 5.8 StreakCounter (연속 기록)

```
[StreakCounter]
├── 아이콘: 불꽃 이모지 또는 아이콘
├── 숫자: heading2 크기, Primary 색상
├── 레이블: "일 연속 기록"
└── 0일: 비활성 상태 표시
```

## 6. 모바일 최적화

### 6.1 터치 영역

- 모든 인터랙티브 요소: 최소 44x44px 터치 영역
- 버튼 간 최소 간격: 8px
- 스와이프 제스처: 수평 30px 이상 이동 시 활성화

### 6.2 키보드 대응

- 일기 작성 시 키보드에 의해 입력 영역 가려지지 않도록 `KeyboardAvoidingView` 적용
- 키보드 위에 마이크 버튼 고정 표시
- 키보드 외부 탭 시 키보드 닫기

### 6.3 Safe Area

- 상단 노치/다이내믹 아일랜드 대응
- 하단 홈 인디케이터 영역 확보
- `SafeAreaView` 또는 `useSafeAreaInsets` 사용

### 6.4 애니메이션

| 요소 | 애니메이션 | 시간 |
|------|-----------|------|
| 화면 전환 | 슬라이드 좌/우 | 250ms |
| 할일 체크 | 체크마크 스케일 인 | 200ms |
| 할일 삭제 | 슬라이드 아웃 + 높이 축소 | 300ms |
| 감정 선택 | 스케일 바운스 | 200ms |
| 마이크 녹음 | 펄스 반복 | 1000ms (반복) |
| 카드 등장 | 페이드 인 + 위로 슬라이드 | 300ms |

### 6.5 접근성

- 모든 아이콘에 `accessibilityLabel` 제공
- 충분한 색상 대비 (WCAG AA 기준)
- 화면 리더 지원 (`accessible`, `accessibilityRole` 설정)
- 텍스트 크기 조절 대응 (`allowFontScaling`)
