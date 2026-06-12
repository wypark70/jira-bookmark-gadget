# Jira Bookmark Gadget

A React + TypeScript + Vite bookmark manager with multiple view modes, draggable reordering, search, and graph visualization.

## 기능

- 북마크 추가, 편집, 삭제
- 검색 기능을 통해 북마크 필터링
- 카드 뷰, 아이콘 뷰, 비주얼 타일 뷰, 타임라인 뷰, 그래프 뷰 지원
- 그래프 뷰에서 태그 기반 관계 시각화
- 드래그 앤 드롭으로 북마크 순서 변경
- 라이트/다크 테마 토글

## 스크린샷

![Bookmark Gadget Screenshot](./screenshot.png)

> `screenshot.png` 파일을 프로젝트 루트 또는 `public/` 폴더에 추가하면 이 이미지가 표시됩니다.

## 설치

```bash
npm install
```

## 개발 실행

```bash
npm run dev
```

이후 브라우저에서 `http://localhost:5173`을 열어 앱을 확인합니다.

## 빌드

```bash
npm run build
```

생성된 정적 파일은 `dist/`에 출력됩니다.

## 미리보기

```bash
npm run preview
```

## 주요 파일

- `src/App.tsx` — 앱 진입점
- `src/components/BookmarkManager.tsx` — 전체 북마크 관리 및 뷰 전환
- `src/components/BookmarkIcon.tsx` — 아이콘 뷰 카드
- `src/components/BookmarkCard.tsx` — 카드 뷰 항목
- `src/components/GraphView.tsx` — 그래프 시각화 뷰
- `src/components/TimelineView.tsx` — 타임라인 뷰
- `src/components/VisualTileView.tsx` — 비주얼 타일 뷰

## 요구 사항

- Node.js 18 이상 권장
- npm 또는 호환 가능한 패키지 매니저

## 기타

Tailwind CSS와 Vite를 기반으로 구성되어 있으며, 시각적 스타일과 상태 관리는 React 컴포넌트로 구성되어 있습니다.
