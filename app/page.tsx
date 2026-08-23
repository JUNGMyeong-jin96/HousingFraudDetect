"use client";

import { useState } from "react";
import SetupScreen from "@/components/SetupScreen";
import MapScreen from "@/components/MapScreen";
import ResultScreen from "@/components/ResultScreen";
import type { Answers, GamePhase, PlayerInfo } from "@/lib/types";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  function handleSetupComplete(info: PlayerInfo) {
    setPlayerInfo(info);
    setPhase("map");
  }

  function handleAnswer(index: number, risky: boolean) {
    setAnswers((prev) => ({ ...prev, [index]: risky }));
  }

  function handleRestart() {
    setAnswers({});
    setPhase("map");
  }

  if (phase === "setup" || !playerInfo) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (phase === "result") {
    return (
      <ResultScreen
        playerInfo={playerInfo}
        answers={answers}
        onRestart={handleRestart}
        onBackToMap={() => setPhase("map")}
      />
    );
  }

  return (
    <MapScreen
      playerInfo={playerInfo}
      answers={answers}
      onAnswer={handleAnswer}
      onShowResult={() => setPhase("result")}
    />
  );
}
