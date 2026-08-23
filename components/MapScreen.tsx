"use client";

import { useEffect, useRef, useState } from "react";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  HOUSE_HEIGHT,
  HOUSE_WIDTH,
  LAYOUT,
  PLAYER_SIZE,
  PLAYER_SPEED,
  START_POS,
} from "@/lib/houses";
import type { Facing } from "@/lib/sprites";
import type { Answers, House, PlayerInfo } from "@/lib/types";
import HouseDialog from "./HouseDialog";
import HouseSprite from "./HouseSprite";
import PlayerSprite from "./PlayerSprite";

const PLAYER_SPRITE_WIDTH = 26;
const PLAYER_SPRITE_HEIGHT = 32;

function blocked(x: number, y: number): boolean {
  return LAYOUT.some(
    (l) => x + PLAYER_SIZE > l.x && x < l.x + HOUSE_WIDTH && y + PLAYER_SIZE > l.y && y < l.y + HOUSE_HEIGHT
  );
}

interface MapScreenProps {
  playerInfo: PlayerInfo;
  houses: House[];
  answers: Answers;
  onAnswer: (index: number, risky: boolean) => void;
  onShowResult: () => void;
}

export default function MapScreen({ playerInfo, houses, answers, onAnswer, onShowResult }: MapScreenProps) {
  const posRef = useRef({ ...START_POS });
  const [renderPos, setRenderPos] = useState(START_POS);
  const facingRef = useRef<Facing>("down");
  const [facing, setFacing] = useState<Facing>("down");
  const keysRef = useRef<Record<string, boolean>>({});
  const activeIndexRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndexState] = useState<number | null>(null);

  function setActive(i: number | null) {
    activeIndexRef.current = i;
    setActiveIndexState(i);
  }

  function enter(i: number) {
    if (activeIndexRef.current !== null) return;
    keysRef.current = {};
    setActive(i);
  }

  function closeDialog() {
    const i = activeIndexRef.current;
    if (i === null) return;
    const l = LAYOUT[i];
    const doorAboveHouse = l.dy < l.y;
    const y = doorAboveHouse ? l.dy - 40 : l.dy + 40;
    const nextPos = {
      x: l.dx - PLAYER_SIZE / 2,
      y: Math.max(2, Math.min(BOARD_HEIGHT - PLAYER_SIZE - 2, y)),
    };
    posRef.current = nextPos;
    setRenderPos(nextPos);
    setActive(null);
  }

  useEffect(() => {
    function checkDoor() {
      const cx = posRef.current.x + PLAYER_SIZE / 2;
      const cy = posRef.current.y + PLAYER_SIZE / 2;
      LAYOUT.forEach((l, i) => {
        if (Math.abs(cx - l.dx) < 30 && Math.abs(cy - l.dy) < 30) enter(i);
      });
    }

    function step() {
      if (activeIndexRef.current !== null) return;
      const k = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (k.arrowleft || k.a) dx -= PLAYER_SPEED;
      if (k.arrowright || k.d) dx += PLAYER_SPEED;
      if (k.arrowup || k.w) dy -= PLAYER_SPEED;
      if (k.arrowdown || k.s) dy += PLAYER_SPEED;
      if (!dx && !dy) return;
      const nextFacing: Facing = dy !== 0 ? (dy > 0 ? "down" : "up") : dx > 0 ? "right" : "left";
      if (nextFacing !== facingRef.current) {
        facingRef.current = nextFacing;
        setFacing(nextFacing);
      }
      const { x, y } = posRef.current;
      const nx = Math.max(2, Math.min(BOARD_WIDTH - PLAYER_SIZE - 2, x + dx));
      const ny = Math.max(2, Math.min(BOARD_HEIGHT - PLAYER_SIZE - 2, y + dy));
      const next = { x, y };
      if (!blocked(nx, y)) next.x = nx;
      if (!blocked(next.x, ny)) next.y = ny;
      posRef.current = next;
      setRenderPos(next);
      checkDoor();
    }

    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)) {
        keysRef.current[k] = true;
        if (k.startsWith("arrow")) e.preventDefault();
      }
      if (k === "escape") closeDialog();
    }

    function onKeyUp(e: KeyboardEvent) {
      keysRef.current[e.key.toLowerCase()] = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let raf = requestAnimationFrame(function loop() {
      step();
      raf = requestAnimationFrame(loop);
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.keys(answers).filter((i) => answers[Number(i)] === houses[Number(i)].risky).length;
  const allDone = answeredCount === houses.length;
  const progressPct = (answeredCount / houses.length) * 100;
  const activeHouse = activeIndex === null ? null : houses[activeIndex];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 56 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 24,
          padding: "14px 32px",
          borderBottom: "2px solid var(--color-divider)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>
            전세사기 위험 점검 훈련
          </span>
          <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
            JEONSE RISK FIELD TEST
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, fontSize: 12.5, color: "var(--color-neutral-700)" }}>
          <span>
            {playerInfo.ageGroup} · {playerInfo.job} · {playerInfo.gender}
          </span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, letterSpacing: "0.04em", color: "var(--color-text)" }}>
            점검 {answeredCount} / 5 · 정답 <span style={{ color: "var(--color-accent-700)" }}>{correctCount}</span>
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "26px 32px 0", display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 34, alignItems: "start" }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 33, margin: "0 0 6px", letterSpacing: "-0.02em" }}>골목을 돌며 5채를 점검하세요</h1>
          <p className="text-muted" style={{ maxWidth: "58ch", margin: "0 0 18px" }}>
            방향키로 이동해 집 앞 붉은 문에 서면 매물 서류가 열립니다. 등기부·대장·시세·명의를 읽고{" "}
            <strong style={{ color: "var(--color-accent-700)" }}>전세사기 위험이 있는 집인지</strong> O · X로 판정하세요.
          </p>

          <div
            style={{
              position: "relative",
              width: BOARD_WIDTH,
              height: BOARD_HEIGHT,
              maxWidth: "100%",
              border: "2px solid var(--color-divider)",
              background: "var(--color-surface)",
              overflow: "hidden",
              userSelect: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(to right, color-mix(in srgb, var(--color-text) 7%, transparent) 0 1px, transparent 1px 40px), repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-text) 7%, transparent) 0 1px, transparent 1px 40px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 196,
                height: 78,
                background: "color-mix(in srgb, var(--color-text) 6%, transparent)",
                borderTop: "1px solid var(--color-divider)",
                borderBottom: "1px solid var(--color-divider)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 222,
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--color-neutral-600)",
                pointerEvents: "none",
              }}
            >
              중앙 골목
            </div>

            {houses.map((house, i) => {
              const l = LAYOUT[i];
              const done = answers[i] !== undefined;
              const right = done && answers[i] === house.risky;
              const stamp = done ? (right ? "정답" : "오답") : "미점검";
              return (
                <div key={house.num} style={{ position: "absolute", left: l.x, top: l.y, width: HOUSE_WIDTH }}>
                  <button
                    type="button"
                    onClick={() => enter(i)}
                    style={{
                      display: "block",
                      width: HOUSE_WIDTH,
                      height: HOUSE_HEIGHT,
                      padding: 0,
                      border: "2px solid var(--color-text)",
                      background: done ? "var(--color-neutral-200)" : "var(--color-bg)",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      color: "var(--color-text)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div style={{ height: HOUSE_HEIGHT - 34, position: "relative" }}>
                      <HouseSprite type={house.buildingType} width={HOUSE_WIDTH} height={HOUSE_HEIGHT - 34} />
                      {done && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "color-mix(in srgb, var(--color-bg) 38%, transparent)",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 6,
                        padding: "0 8px",
                        borderTop: "2px solid var(--color-text)",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 12, letterSpacing: "0.04em" }}>
                          {house.num}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            lineHeight: 1.2,
                            color: "var(--color-neutral-700)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {house.short}
                        </span>
                      </span>
                      <span
                        style={{
                          flex: "none",
                          fontFamily: "var(--font-heading)",
                          fontWeight: 800,
                          fontSize: 9.5,
                          letterSpacing: "0.1em",
                          padding: "2px 6px",
                          border: `1px solid ${done ? (right ? "var(--color-text)" : "var(--color-accent)") : "var(--color-neutral-400)"}`,
                          color: done && !right ? "var(--color-accent-700)" : done ? "var(--color-text)" : "var(--color-neutral-600)",
                        }}
                      >
                        {stamp}
                      </span>
                    </div>
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      left: l.dx - l.x - 13,
                      top: l.dy - l.y - 4,
                      width: 26,
                      height: 8,
                      background: "var(--color-accent)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              );
            })}

            <div
              style={{
                position: "absolute",
                left: renderPos.x + PLAYER_SIZE / 2 - PLAYER_SPRITE_WIDTH / 2,
                top: renderPos.y + PLAYER_SIZE - PLAYER_SPRITE_HEIGHT,
                width: PLAYER_SPRITE_WIDTH,
                height: PLAYER_SPRITE_HEIGHT,
                filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.35))",
                zIndex: 5,
              }}
            >
              <PlayerSprite facing={facing} width={PLAYER_SPRITE_WIDTH} height={PLAYER_SPRITE_HEIGHT} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 22, marginTop: 12, fontSize: 12, color: "var(--color-neutral-700)", flexWrap: "wrap" }}>
            <span>↑ ↓ ← → / WASD — 이동</span>
            <span>붉은 문에 서면 자동 입장</span>
            <span>집을 클릭해도 입장</span>
          </div>
        </div>

        <div style={{ borderLeft: "2px solid var(--color-divider)", paddingLeft: 22 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginBottom: 10 }}>
            진행률
          </div>
          <div style={{ height: 10, background: "var(--color-neutral-300)", marginBottom: 6 }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--color-accent)", transition: "width .25s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--color-neutral-700)", marginBottom: 22 }}>
            <span>{answeredCount}채 점검 완료</span>
            <span>남은 집 {houses.length - answeredCount}</span>
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginBottom: 8 }}>
            점검 기록
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--color-divider)" }}>
            {houses.map((house, i) => {
              const done = answers[i] !== undefined;
              const ok = done && answers[i] === house.risky;
              return (
                <div
                  key={house.num}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "9px 0",
                    borderBottom: "1px solid var(--color-divider)",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 11, color: "var(--color-neutral-600)", width: 13 }}>
                      {house.num}
                    </span>
                    <span style={{ fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{house.short}</span>
                  </span>
                  <span className={done ? (ok ? "tag tag-outline" : "tag tag-accent") : "tag tag-neutral"} style={{ flex: "none" }}>
                    {done ? (ok ? "정답" : "오답") : "미점검"}
                  </span>
                </div>
              );
            })}
          </div>

          {allDone && (
            <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 18 }} onClick={onShowResult}>
              결과 리포트 보기
            </button>
          )}

          <div style={{ marginTop: 26, borderTop: "2px solid var(--color-divider)", paddingTop: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginBottom: 8 }}>
              위험 신호 체크리스트
            </div>
            <ul style={{ margin: 0, paddingLeft: 17, fontSize: 12, lineHeight: 1.75, color: "var(--color-neutral-800)" }}>
              <li>전세가율 80% 초과</li>
              <li>선순위 채권+보증금 &gt; 시세 80%</li>
              <li>계약자 ≠ 등기부 소유자</li>
              <li>위반건축물 등재 (보증 불가)</li>
              <li>다가구 선순위 보증금 총액 미공개</li>
              <li>압류·가압류·미납국세</li>
              <li>중개사 등록번호 불일치</li>
            </ul>
          </div>
        </div>
      </div>

      {activeIndex !== null && activeHouse && (
        <HouseDialog
          key={activeIndex}
          house={activeHouse}
          answer={answers[activeIndex]}
          allDone={allDone}
          onAnswer={(risky) => onAnswer(activeIndex, risky)}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
