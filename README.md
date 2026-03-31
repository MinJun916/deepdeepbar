# DeepDeepBar QR Menu

혼술바/칵테일바를 위한 모바일 우선 QR 메뉴판 프로젝트입니다.  
고객용 메뉴판(`/`)과 운영용 어드민(`/admin/*`)을 분리해, Supabase 기반으로 메뉴/레시피를 관리합니다.

## 주요 기능

- 모바일 우선 UI (태블릿/PC 대응)
- 카테고리 탭 + 시그니처 우선 정렬
- 메뉴 가격 옵션(`menu_prices`) 표시
  - 예: 기본/샷/보틀 가격
- 어드민 메뉴 관리
  - 메뉴 추가, 검색, 정렬, 수정, 삭제
  - `is_display` 토글로 메뉴판 노출 제어
- 어드민 레시피 관리
  - 레시피 보기 페이지(`/admin/recipe`)
  - 레시피 CRUD 페이지(`/admin/recipe/manage`)
- 검색 즉시 반영(클라이언트 필터링) + Observer 기반 리스트 최적화
- 소개 오버레이 애니메이션, 스크롤 탑 버튼, 푸터(관리자 진입 링크)

## 기술 스택

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`)

## 실행 방법

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속.

## 환경변수

프로젝트 루트 `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SECRET_KEY=

# Admin login
ADMIN_LOGIN_USERNAME=
ADMIN_LOGIN_PASSWORD=

# Optional table names (기본값은 아래와 동일)
NEXT_PUBLIC_SUPABASE_MENUS_TABLE=menus
NEXT_PUBLIC_SUPABASE_MENU_PRICES_TABLE=menu_prices
NEXT_PUBLIC_SUPABASE_RECIPES_TABLE=recipes
NEXT_PUBLIC_SUPABASE_RECIPE_STEPS_TABLE=recipe_steps
NEXT_PUBLIC_SUPABASE_GLASS_TYPES_TABLE=glass_types
```

설명:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: 공개 키(고객 메뉴 조회용)
- `SUPABASE_SECRET_KEY`: 서버 전용 비밀 키(어드민 CRUD용)
- `ADMIN_LOGIN_USERNAME`, `ADMIN_LOGIN_PASSWORD`: 어드민 로그인 계정

## 라우트

- `/` : 고객 메뉴판
- `/admin/login` : 어드민 로그인
- `/admin` : 어드민 허브
- `/admin/menu` : 메뉴 관리 허브
- `/admin/menu/add` : 메뉴 추가
- `/admin/menu/manage` : 메뉴 검색/정렬/수정/삭제
- `/admin/recipe` : 레시피 조회
- `/admin/recipe/manage` : 레시피 검색/정렬/추가/수정/삭제

## 인증/보호 구조

- 어드민 로그인은 서버 액션에서 `ADMIN_LOGIN_*` 검증 후 쿠키 세션 발급
- `src/proxy.ts`에서 `/admin/*` 접근 보호 (`/admin/login` 제외)
- 링크 `prefetch={false}` 적용으로 의도치 않은 인증 요청 최소화

## Supabase 스키마 기준

### `menus`

- `id` (uuid)
- `category` (enum)
  - `cocktail`, `whisky`, `non-alcohol`, `highball`, `beer`, `side`
- `name`
- `name_en`
- `description`
- `abv` (nullable)
- `taste_note`
- `tags` (jsonb array)
- `is_signature` (bool)
- `is_display` (bool, 메뉴판 노출 여부)

### `menu_prices`

- `id` (uuid)
- `menu_id` (fk -> menus.id)
- `price_type` (enum: `default` | `shot` | `bottle`)
- `price` (int)
- `display_order` (int)
- `is_active` (bool)

### `recipes`

- `id` (uuid)
- `menu_id` (fk -> menus.id)
- `glass_type_id` (nullable fk)
- `mixing_method`
- `garnish` (nullable)
- `notes` (nullable)

### `recipe_steps`

- `id` (uuid)
- `recipe_id` (fk -> recipes.id)
- `step_order` (int)
- `instruction` (text)

### `glass_types`

- `id` (uuid)
- `name_ko`
- `is_active` (bool)

## 데이터 흐름

- 고객 메뉴판: `src/app/page.tsx`
  - `menus` + `menu_prices`를 별도 조회 후 `menu_id`로 매핑
  - `is_display = true` 메뉴만 노출
- 뷰 렌더링: `src/views/home/index.tsx` + `src/components/menu/menuCard/index.tsx`
- 어드민 서버 액션: `src/app/admin/actions.ts`
- Supabase 클라이언트:
  - `src/lib/supabase/server.ts` (읽기)
  - `src/lib/supabase/admin.ts` (관리)

## RLS 참고

고객 메뉴판에서 가격이 보이지 않거나 메뉴가 비어 보이면, 대부분 `menus`/`menu_prices`의 `SELECT` 정책 문제입니다.  
특히 publishable key 경로는 `anon` role에 대한 `SELECT` 정책이 필요합니다.

## 참고 파일

- 샘플 CSV: `cocktails_mock.csv`
- 기본 폰트: `public/fonts/PretendardVariable.woff2`
