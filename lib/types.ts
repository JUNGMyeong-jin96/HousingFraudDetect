export type AgeGroup = "10대" | "20대" | "30대" | "40대" | "50대 이상";
export type Gender = "남성" | "여성" | "선택 안 함";

export interface PlayerInfo {
  ageGroup: AgeGroup;
  job: string;
  gender: Gender;
}

export type FieldStatus = "정상" | "주의" | "위험";

/** [라벨, 값, 상태] */
export type HouseField = [label: string, value: string, status: FieldStatus];

export type BuildingType = "다가구주택" | "아파트" | "오피스텔" | "빌라" | "단독주택";

export interface House {
  num: string;
  short: string;
  name: string;
  addr: string;
  buildingType: BuildingType;
  deposit: string;
  market: string;
  ratio: string;
  ratioBad: boolean;
  /** true면 전세사기 위험이 있는 집(정답 O), false면 안전한 집(정답 X) */
  risky: boolean;
  fields: HouseField[];
  explain: string;
  lesson: string;
  reason: string;
}

export interface Layout {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export type GamePhase = "setup" | "map" | "result";

/** 집 인덱스 -> 플레이어가 고른 답(true=위험 있음/O, false=위험 없음/X) */
export type Answers = Record<number, boolean>;
