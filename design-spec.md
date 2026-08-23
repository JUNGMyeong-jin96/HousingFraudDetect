# 건물 타입별 픽셀아트 렌더링 — Design Spec

## 배경
`TODO.md`의 두 항목("wasm 사용 허용" / "아파트·오피스텔·단독주택 등 건물별 모습 구현 가능?")을 grill-me로 검토한 결과.

## 결정 사항

### 1. 렌더링 기술: Canvas 2D, WASM 미사용
- 이 게임은 정적 픽셀아트 스프라이트 5~수십 개를 그리는 수준이라 WASM이 이득을 주는 연산(물리/대량 데이터 처리)이 없음.
- MVP든 본선이든 동일 결론. WASM은 "실제 등기부등본 이미지 OCR/파싱" 같은 무거운 클라이언트 연산이 생길 때만 부분 도입 검토.

### 2. 에셋 확보 방식: 코드 정의 픽셀 그리드 + Canvas nearest-neighbor 확대
- 외부 이미지 파일 없이, 건물 타입별로 저해상도 픽셀 그리드(색상 인덱스 2차원 배열)를 TS 코드에 정의.
- `imageSmoothingEnabled = false`로 확대 렌더링해 `sample/image.png`와 같은 도트 그래픽 느낌 재현.
- `lib/sprites.ts`에 타입별 그리드 + 팔레트 정의, `components/HouseSprite.tsx`가 canvas에 그림.

### 3. 데이터 모델
- `House`에 `buildingType: "다가구주택" | "아파트" | "오피스텔" | "빌라" | "단독주택"` 필드 추가.
- 기존 5개 매물은 이름/주소 텍스트로 이미 타입이 명시돼 있어 그대로 매핑:
  1. 성산동 → 다가구주택
  2. 망원동 → 아파트
  3. 신길동 → 오피스텔
  4. 화곡동 → 빌라
  5. 상도동 → 단독주택

### 4. 적용 범위
- `MapScreen`의 지도 위 매물 아이콘만 교체 (현재: 삼각지붕 div + 텍스트 박스 → 픽셀아트 캔버스 + 하단 정보 바).
- `HouseDialog`(서류 확인 화면)는 텍스트 중심 문서라 범위 밖 — 변경 없음.
- 플레이어 캐릭터 스프라이트는 TODO 범위 밖(집 모습만 요청됨) — 이번엔 미적용, 필요 시 후속 작업.

### 5. 스포일러 방지 원칙
- 스프라이트 외형은 오직 `buildingType`에 의해서만 결정되고, `risky`(정답) 값과는 절대 무관하게 렌더링. 위험 매물이라고 건물이 낡아 보이거나 하는 식의 시각적 힌트를 주지 않음(게임 판정 로직 유출 방지).

## 구현 파일
- `lib/types.ts`: `BuildingType`, `House.buildingType` 추가
- `lib/houses.ts`: 각 house에 `buildingType` 지정
- `lib/sprites.ts`: 타입별 픽셀 그리드 + 팔레트 + 드로잉 함수
- `components/HouseSprite.tsx`: canvas 렌더링 컴포넌트
- `components/MapScreen.tsx`: 기존 박스 비주얼을 `HouseSprite`로 교체
