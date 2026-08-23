"use client";

import { useState } from "react";
import type { AgeGroup, Gender, PlayerInfo } from "@/lib/types";

const AGE_GROUPS: AgeGroup[] = ["10대", "20대", "30대", "40대", "50대 이상"];
const JOBS = ["학생", "사회초년생", "직장인", "신혼부부", "자영업자", "프리랜서"];
const GENDERS: Gender[] = ["남성", "여성", "선택 안 함"];

interface ChoiceGroupProps<T extends string> {
  label: string;
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
}

function ChoiceGroup<T extends string>({ label, options, value, onChange }: ChoiceGroupProps<T>) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-neutral-700)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div className="choice-grid">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`choice-btn${value === opt ? " is-selected" : ""}`}
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SetupScreen({ onComplete }: { onComplete: (info: PlayerInfo) => void }) {
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [job, setJob] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);

  const ready = ageGroup !== null && job !== null && gender !== null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-neutral-700)",
            marginBottom: 6,
          }}
        >
          JEONSE RISK FIELD TEST
        </div>
        <h1 style={{ fontSize: 32, marginBottom: 8, letterSpacing: "-0.02em" }}>
          점검을 나서기 전에
        </h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>
          당신은 어떤 사람인가요? 골목을 돌며 매물을 점검하기 전에 간단히 알려주세요.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ChoiceGroup label="나이대" options={AGE_GROUPS} value={ageGroup} onChange={setAgeGroup} />
          <ChoiceGroup label="직업" options={JOBS} value={job} onChange={setJob} />
          <ChoiceGroup label="성별" options={GENDERS} value={gender} onChange={setGender} />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block"
          style={{ marginTop: 32, height: 48, fontSize: 15 }}
          disabled={!ready}
          onClick={() => {
            if (ageGroup && job && gender) {
              onComplete({ ageGroup, job, gender });
            }
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
