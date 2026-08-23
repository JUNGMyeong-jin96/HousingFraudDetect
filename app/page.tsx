"use client";

import { useState } from "react";
import SetupScreen from "@/components/SetupScreen";
import MapScreen from "@/components/MapScreen";
import ResultScreen from "@/components/ResultScreen";
import { pickRandomHouses } from "@/lib/houses";
import type { Answers, GamePhase, House, PlayerInfo } from "@/lib/types";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [houses, setHouses] = useState<House[]>([]);

  function handleSetupComplete(info: PlayerInfo) {
    setPlayerInfo(info);
    setHouses(pickRandomHouses());
    setPhase("map");
  }

  function handleAnswer(index: number, risky: boolean) {
    setAnswers((prev) => ({ ...prev, [index]: risky }));
  }

  function handleRestart() {
    setAnswers({});
    setHouses(pickRandomHouses());
    setPhase("map");
  }

  if (phase === "setup" || !playerInfo) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (phase === "result") {
    return (
      <ResultScreen
        playerInfo={playerInfo}
        houses={houses}
        answers={answers}
        onRestart={handleRestart}
        onBackToMap={() => setPhase("map")}
      />
    );
  }

  return (
    <MapScreen
      playerInfo={playerInfo}
      houses={houses}
      answers={answers}
      onAnswer={handleAnswer}
      onShowResult={() => setPhase("result")}
    />
  );
}
