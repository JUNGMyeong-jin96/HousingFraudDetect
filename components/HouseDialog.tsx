"use client";

import { useState } from "react";
import type { House } from "@/lib/types";
import { tagClassFor } from "@/lib/statusTag";

interface HouseDialogProps {
  house: House;
  answer: boolean | undefined;
  allDone: boolean;
  onAnswer: (risky: boolean) => void;
  onClose: () => void;
}

export default function HouseDialog({ house, answer, allDone, onAnswer, onClose }: HouseDialogProps) {
  const revealed = answer !== undefined;
  const right = revealed && answer === house.risky;
  const [confirmed, setConfirmed] = useState(revealed);

  if (!confirmed) {
    return (
      <div className="dialog-backdrop">
        <div className="dialog" style={{ padding: "28px 24px" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-neutral-700)",
              marginBottom: 8,
            }}
          >
            매물 {house.num} · {house.addr}
          </div>
          <h2 style={{ margin: "0 0 12px", fontSize: 24, letterSpacing: "-0.02em" }}>{house.name}</h2>
          <p style={{ margin: "0 0 22px", fontSize: 15 }}>계약 조건을 보려면 확인을 눌러주세요.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="btn btn-primary" onClick={() => setConfirmed(true)}>
              확인
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              나중에
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dialog-backdrop">
      <div className="dialog" style={{ padding: 0, display: "block" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 20,
            padding: "20px 24px",
            borderBottom: "2px solid var(--color-divider)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-neutral-700)",
                marginBottom: 4,
              }}
            >
              매물 {house.num} · {house.addr}
            </div>
            <h2 style={{ margin: 0, fontSize: 27, letterSpacing: "-0.02em" }}>{house.name}</h2>
          </div>
          <button type="button" className="btn btn-ghost" style={{ flex: "none" }} onClick={onClose}>
            닫기
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: house.monthlyRent ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr",
            borderBottom: "2px solid var(--color-divider)",
          }}
        >
          <div style={{ padding: "14px 24px", borderRight: "1px solid var(--color-divider)" }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
              보증금
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 21 }}>{house.deposit}</div>
          </div>
          {house.monthlyRent && (
            <div style={{ padding: "14px 24px", borderRight: "1px solid var(--color-divider)" }}>
              <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
                월세
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 21 }}>{house.monthlyRent}</div>
            </div>
          )}
          <div style={{ padding: "14px 24px", borderRight: "1px solid var(--color-divider)" }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
              시세
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 21 }}>{house.market}</div>
          </div>
          <div style={{ padding: "14px 24px" }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-neutral-700)" }}>
              전세가율
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: 21,
                color: revealed && house.ratioBad ? "var(--color-accent-700)" : "var(--color-text)",
              }}
            >
              {house.ratio}
            </div>
          </div>
        </div>

        <div style={{ padding: "0 24px" }}>
          {house.fields.map(([label, value, status]) => (
            <div key={label} className="field-row">
              <div
                className="field-row-label"
                style={{
                  fontSize: 11.5,
                  letterSpacing: "0.02em",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  color: "var(--color-neutral-800)",
                }}
              >
                {label}
              </div>
              <div className="field-row-value" style={{ fontSize: 13.5, textWrap: "pretty" }}>
                {value}
              </div>
              <div className="field-row-status" style={{ textAlign: "right" }}>
                {revealed && <span className={tagClassFor(status)}>{status}</span>}
              </div>
            </div>
          ))}
        </div>

        {!revealed && (
          <div style={{ padding: "22px 24px 26px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 19, marginBottom: 4 }}>
              이 집, 전세사기 위험이 있습니까?
            </div>
            <p className="text-muted" style={{ fontSize: 12.5, margin: "0 0 16px" }}>
              O — 위험 있음 (계약 보류) · X — 위험 없음 (계약 가능)
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ minWidth: 180 }}
                onClick={() => onAnswer(true)}
              >
                O — 위험 있음
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ minWidth: 180 }}
                onClick={() => onAnswer(false)}
              >
                X — 위험 없음
              </button>
            </div>
          </div>
        )}

        {revealed && (
          <div
            style={{
              padding: "22px 24px 26px",
              borderTop: "2px solid var(--color-text)",
              background: right ? "var(--color-neutral-200)" : "var(--color-accent-100)",
              color: right ? "var(--color-text)" : "var(--color-accent-900)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 30, letterSpacing: "-0.02em" }}>
                {right ? "정답입니다" : "오답입니다"}
              </span>
              <span style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75 }}>
                정답 — {house.risky ? "O — 위험 있음" : "X — 위험 없음"}
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 14.5, lineHeight: 1.65, textWrap: "pretty", maxWidth: "66ch" }}>
              {house.explain}
            </p>
            <div style={{ borderTop: "1px solid currentColor", opacity: 0.35, marginBottom: 12 }} />
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, opacity: 0.8 }}>
              기억할 것
            </div>
            <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.6, textWrap: "pretty", maxWidth: "66ch" }}>
              {house.lesson}
            </p>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {allDone ? "점검 완료 — 지도로" : "다음 집으로"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
