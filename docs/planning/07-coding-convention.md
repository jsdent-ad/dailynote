# Coding Convention

## 1. 프로젝트 파일 구조

```
dailynote/
├── app/                          # expo-router 라우팅 (화면 진입점)
│   ├── _layout.tsx               # 루트 레이아웃
│   ├── (tabs)/                   # 탭 그룹
│   │   ├── _layout.tsx           # 탭 레이아웃
│   │   ├── index.tsx             # 메인 화면
│   │   ├── stats.tsx             # 통계 화면
│   │   └── settings.tsx          # 설정 화면
│   └── +not-found.tsx
├── components/                   # UI 컴포넌트
│   ├── common/                   # 공통 (Button, Input, Card 등)
│   └── [feature]/                # 기능별 (daily/, stats/)
├── stores/                       # Zustand 스토어
├── services/                     # 비즈니스 로직 (DB, STT, 백업)
├── hooks/                        # 커스텀 훅
├── utils/                        # 유틸리티 함수
├── types/                        # TypeScript 타입 정의
├── constants/                    # 상수 (색상, 간격, 설정값)
└── assets/                       # 정적 리소스
```

### 파일 배치 규칙

- `app/` 디렉토리에는 라우팅 관련 파일만 배치 (비즈니스 로직 금지)
- 화면 컴포넌트는 `app/`에서 가져와 조합만 수행
- 재사용 가능한 컴포넌트는 `components/`에 배치
- 한 파일에 하나의 컴포넌트/스토어/서비스만 정의

## 2. 네이밍 규칙

### 2.1 파일명

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase.tsx | `TodoItem.tsx`, `EmotionScore.tsx` |
| 스토어 | use + PascalCase + Store.ts | `useTodoStore.ts` |
| 서비스 | camelCase.ts | `database.ts`, `backup.ts` |
| 훅 | use + PascalCase.ts | `useSwipeNavigation.ts` |
| 유틸 | camelCase.ts | `date.ts`, `format.ts` |
| 타입 | camelCase.ts 또는 index.ts | `types/index.ts` |
| 상수 | camelCase.ts | `colors.ts`, `spacing.ts` |

### 2.2 변수/함수명

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수 | camelCase | `todoList`, `emotionScore` |
| 함수 | camelCase (동사로 시작) | `addTodo()`, `updateScore()` |
| 컴포넌트 | PascalCase | `TodoItem`, `DateHeader` |
| 상수 | UPPER_SNAKE_CASE | `MAX_EMOTION_SCORE`, `DB_VERSION` |
| 타입/인터페이스 | PascalCase | `Todo`, `DailyNote`, `EmotionScore` |
| 열거형 | PascalCase (멤버도) | `Theme.Light`, `Theme.Dark` |
| 불리언 | is/has/should 접두사 | `isCompleted`, `hasData` |
| 이벤트 핸들러 | handle + 동사 | `handlePress`, `handleSubmit` |
| 콜백 Props | on + 동사 | `onPress`, `onChangeText` |

### 2.3 디렉토리명

- 소문자 + 하이픈 (kebab-case): `common/`, `daily/`, `stats/`
- expo-router 그룹: 괄호 사용 `(tabs)/`

## 3. React Native 컴포넌트 패턴

### 3.1 함수형 컴포넌트 (기본)

```typescript
import { StyleSheet, View, Text } from 'react-native';

interface TodoItemProps {
  content: string;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ content, isCompleted, onToggle, onDelete }: TodoItemProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, isCompleted && styles.completed]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    color: '#2D3436',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#B2BEC3',
  },
});
```

### 3.2 규칙

- `export default` 사용하지 않음 (named export만)
- Props 인터페이스는 컴포넌트 바로 위에 정의
- StyleSheet는 컴포넌트 파일 하단에 정의
- 인라인 스타일 최소화 (조건부 스타일은 배열 방식 사용)
- 컴포넌트 내부에 비즈니스 로직 최소화 (스토어/서비스로 분리)

### 3.3 커스텀 훅 패턴

```typescript
import { useState, useCallback } from 'react';

export function useSwipeNavigation(onSwipeLeft: () => void, onSwipeRight: () => void) {
  // 훅 로직
  return {
    gestureHandler,
    currentDate,
  };
}
```

## 4. Zustand 스토어 패턴

### 4.1 기본 스토어 구조

```typescript
import { create } from 'zustand';
import { Todo } from '@/types';
import * as db from '@/services/database';

interface TodoState {
  // 상태
  todos: Todo[];
  isLoading: boolean;

  // 액션
  loadTodos: (date: string) => Promise<void>;
  addTodo: (date: string, content: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,

  loadTodos: async (date) => {
    set({ isLoading: true });
    const todos = await db.getTodosByDate(date);
    set({ todos, isLoading: false });
  },

  addTodo: async (date, content) => {
    const newTodo = await db.insertTodo(date, content);
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },

  toggleTodo: async (id) => {
    await db.toggleTodo(id);
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    }));
  },

  deleteTodo: async (id) => {
    await db.deleteTodo(id);
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    }));
  },
}));
```

### 4.2 스토어 규칙

- 스토어명은 `use` + `PascalCase` + `Store`
- 상태와 액션을 인터페이스로 명시적 타입 정의
- 비동기 액션은 `async/await` 사용
- DB 호출은 서비스 레이어를 통해 수행
- 상태 업데이트는 `set()` 내에서 이뮤터블하게 처리
- 셀렉터로 필요한 상태만 구독 (리렌더링 최적화)

```typescript
// 올바른 사용: 셀렉터로 필요한 것만 구독
const todos = useTodoStore((state) => state.todos);
const addTodo = useTodoStore((state) => state.addTodo);

// 피해야 할 사용: 전체 스토어 구독
const store = useTodoStore(); // 모든 상태 변경에 리렌더링
```

## 5. TypeScript 규칙

### 5.1 타입 정의

```typescript
// types/index.ts

export interface DailyNote {
  id: number;
  date: string;              // YYYY-MM-DD
  emotionScore: number | null; // 1~5
  diaryText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: number;
  date: string;              // YYYY-MM-DD
  content: string;
  isCompleted: boolean;
  displayOrder: number;
  carriedOver: boolean;
  createdAt: string;
}
```

### 5.2 규칙

- `any` 사용 금지 (불가피한 경우 `unknown` 사용 후 타입 가드)
- `interface` 우선 사용 (union/intersection이 필요한 경우 `type`)
- 옵셔널 프로퍼티(`?`) 대신 명시적 `null` 유니온 권장
- 제네릭 타입 파라미터는 의미 있는 이름 사용 (`T` 허용, 복잡한 경우 `TItem` 등)

## 6. 임포트 순서

```typescript
// 1. React / React Native
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. 외부 라이브러리
import { useRouter } from 'expo-router';

// 3. 내부 모듈 (절대 경로)
import { useTodoStore } from '@/stores/useTodoStore';
import { TodoItem } from '@/components/daily/TodoItem';
import { formatDate } from '@/utils/date';
import { COLORS } from '@/constants/colors';

// 4. 타입 (type-only import)
import type { Todo } from '@/types';
```

## 7. ESLint / Prettier 설정

### 7.1 ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/jsx-no-bind': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
};
```

### 7.2 Prettier

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "arrowParens": "always"
}
```

## 8. Git 커밋 컨벤션

### 8.1 커밋 메시지 형식

```
<type>(<scope>): <subject>

<body>
```

### 8.2 Type

| Type | 설명 |
|------|------|
| feat | 새로운 기능 |
| fix | 버그 수정 |
| refactor | 리팩토링 (기능 변경 없음) |
| style | 코드 스타일 변경 (포매팅 등) |
| docs | 문서 변경 |
| test | 테스트 추가/수정 |
| chore | 빌드, 설정, 패키지 등 |

### 8.3 Scope

| Scope | 설명 |
|-------|------|
| daily | 데일리노트 메인 화면 |
| stats | 통계 화면 |
| settings | 설정 화면 |
| todo | 할일 기능 |
| diary | 일기 기능 |
| emotion | 감정 스코어 기능 |
| stt | 음성인식 기능 |
| db | 데이터베이스 |
| ui | 공통 UI 컴포넌트 |

### 8.4 예시

```
feat(todo): 할일 추가 기능 구현
fix(db): 날짜 변경 시 데이터 로드 오류 수정
refactor(daily): 메인 화면 컴포넌트 분리
style(ui): Button 컴포넌트 스타일 통일
chore: ESLint 설정 추가
```

## 9. 기타 규칙

### 9.1 에러 처리

```typescript
// try-catch로 감싸고 사용자에게 피드백
try {
  await db.insertTodo(date, content);
} catch (error) {
  console.error('할일 추가 실패:', error);
  // 토스트 또는 알림으로 사용자에게 안내
}
```

### 9.2 주석

- 코드로 설명 가능한 경우 주석 불필요
- 복잡한 비즈니스 로직에만 WHY 주석 작성
- TODO 주석은 이슈 번호와 함께 작성: `// TODO: #123 자동 이월 로직 개선`
- JSDoc은 서비스 레이어 공개 함수에만 작성

### 9.3 매직 넘버 금지

```typescript
// 나쁜 예
if (score > 5) { ... }

// 좋은 예
const MAX_EMOTION_SCORE = 5;
if (score > MAX_EMOTION_SCORE) { ... }
```
