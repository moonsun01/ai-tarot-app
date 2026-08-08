# DC&M AI 타로점

**2026-2 동아리박람회 AI 타로 체험 웹서비스**

컴퓨터공학부 학술 정동아리 DC&M이 제작한 AI 타로 운세 서비스입니다.  
Google Gemini AI가 Major Arcana 22장을 바탕으로 연애/학업/대인관계/총운을 해석해 드립니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API (`@google/genai`)
- **PWA**: Web App Manifest

## 로컬 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 Gemini API 키를 입력합니다.

```bash
cp .env.example .env.local
```

`.env.local`:

```
GEMINI_API_KEY=여기에_Gemini_API_키_입력
```

> API 키 발급: [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```
app/
  page.tsx                # 메인 화면
  layout.tsx              # 공통 레이아웃 및 웹/앱 기본 설정
  globals.css             # 전체 디자인 스타일 및 애니메이션
  api/tarot/route.ts      # Gemini AI 타로 해석 서버 연동
components/
  StarField.tsx           # 배경 별자리 효과
  GrimoireCard.tsx        # 타로 카드 디자인 (마법서 스타일)
  TarotDeck.tsx           # 카드 덱 (펼쳐진 카드 선택 화면)
  ResultModal.tsx         # AI 타로 결과 창
data/
  topics.ts               # 운세 주제 목록 (연애, 학업 등)
  arcana.ts               # 메이저 아르카나 22장 카드 정보
public/
  manifest.json           # 모바일 앱 스타일(PWA) 설정
```
