"use client";

import type { Answers, House, PlayerInfo } from "@/lib/types";
import { tagClassFor } from "@/lib/statusTag";

interface ResultScreenProps {
  playerInfo: PlayerInfo;
  houses: House[];
  answers: Answers;
  onRestart: () => void;
  onBackToMap: () => void;
}

export default function ResultScreen({ playerInfo, houses, answers, onRestart, onBackToMap }: ResultScreenProps) {
  const indices = houses.map((_, i) => i);
  const correctCount = indices.filter((i) => answers[i] === houses[i].risky).length;
  const wrongIdx = indices.filter((i) => answers[i] !== undefined && answers[i] !== houses[i].risky);

  const gradeTitle =
    correctCount === 5
      ? "전세 점검 합격"
      : correctCount >= 4
        ? "거의 다 왔습니다"
        : correctCount >= 2
          ? "다시 점검이 필요합니다"
          : "지금 계약하면 위험합니다";

  const gradeNote =
    correctCount === 5
      ? "여덟 개 서류를 교차 확인하는 습관이 잡혀 있습니다."
      : correctCount >= 4
        ? "한 채만 놓쳤습니다. 오답 노트를 확인하세요."
        : "숫자 하나가 아니라 서류 여덟 개를 함께 읽어야 합니다.";

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
        <span style={{ fontSize: 12.5, color: "var(--color-neutral-700)" }}>
          {playerInfo.ageGroup} · {playerInfo.job} · {playerInfo.gender}
        </span>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "26px 32px 0" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-700)", marginBottom: 8 }}>
          최종 결과
        </div>
        <h1 style={{ fontSize: 46, margin: "0 0 8px", letterSpacing: "-0.03em" }}>{gradeTitle}</h1>
        <p style={{ maxWidth: "54ch", margin: "0 0 4px", fontSize: 16 }}>
          5채 중 <strong>{correctCount}채</strong>를 정확히 판정했습니다. {gradeNote}
        </p>
        <hr className="hr" />

        <table className="table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>매물</th>
              <th style={{ textAlign: "left" }}>실제</th>
              <th style={{ textAlign: "left" }}>내 판정</th>
              <th style={{ textAlign: "left" }}>결정적 근거</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house, i) => {
              const m = answers[i];
              const ok = m === house.risky;
              const markText = m === undefined ? "미점검" : ok ? (m ? "위험 ✓" : "안전 ✓") : m ? "위험 ✗" : "안전 ✗";
              return (
                <tr key={house.num}>
                  <td style={{ whiteSpace: "nowrap", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13 }}>
                    {house.short}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <span className={house.risky ? "tag tag-accent" : "tag tag-outline"}>{house.risky ? "위험" : "안전"}</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <span className={m === undefined ? "tag tag-neutral" : ok ? "tag tag-outline" : "tag tag-accent"}>{markText}</span>
                  </td>
                  <td style={{ fontSize: 13 }}>{house.reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {wrongIdx.length > 0 && (
          <div style={{ marginTop: 34 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, borderTop: "2px solid var(--color-divider)", paddingTop: 16, marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 22 }}>오답 노트</h3>
              <span className="text-muted" style={{ fontSize: 12 }}>
                틀린 {wrongIdx.length}채, 다시 읽어보세요
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {wrongIdx.map((i) => {
                const house = houses[i];
                return (
                  <div key={house.num} className="card" style={{ borderLeft: "4px solid var(--color-accent)" }}>
                    <div className="card-kicker">{house.risky ? "위험한 집을 안전하다고 판정" : "안전한 집을 위험하다고 판정"}</div>
                    <div className="card-title">{house.name}</div>
                    <div className="card-body">{house.explain}</div>
                    <div className="card-meta">{house.lesson}</div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 14,
                        paddingTop: 12,
                        borderTop: "1px solid var(--color-divider)",
                      }}
                    >
                      {house.fields.map(([label, , status]) => (
                        <span
                          key={label}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}
                        >
                          <span className="text-muted">{label}</span>
                          <span className={tagClassFor(status)}>{status}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            처음부터 다시
          </button>
          <button type="button" className="btn btn-secondary" onClick={onBackToMap}>
            지도로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
