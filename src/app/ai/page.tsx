/* page.tsx */
"use client";

import AIAvatar from "@/components/ai-avatar";
import DialogBox from "@/components/dialog-box";
import GameBackground from "@/components/game-background";
import PlayerAvatar from "@/components/player-avatar";
import StatsBox from "@/components/stats-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount, useBalance } from "@starknet-react/core";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { json } from "stream/consumers";
import { Gemini } from "./ai";

interface GeminiResponse {
  text: string;
  trustScore: number;
  accepted?: boolean;
}

// Aceternity-inspired background beams component
const BackgroundBeams = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute w-full h-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
      animate={{ x: [-100, 100], opacity: [0.2, 0.4, 0.2] }}
      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
    />
  </div>
);

// Aceternity-inspired spotlight card component
const SpotlightCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`card-spotlight ${className}`}
    whileHover={{ scale: 1.02, boxShadow: "0 12px 40px oklch(0.65 0.15 270 / 0.3)" }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Yo, what's up? Got big plans or just chilling?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiStats, setAiStats] = useState({ trust: 50 });
  const [playerName, setPlayerName] = useState("Ash");
  const [betAmount, setBetAmount] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    { user: string; AI: string; trustScore: number; accepted?: boolean }[]
  >([{ user: "", AI: "", trustScore: 0 }]);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState<number>(10); // 10 minutes in seconds
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const router = useRouter();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { address: userAddress, status } = useAccount();

  useEffect(() => {
    setPlayerName(localStorage.getItem("userAddress")?.slice(0, 6) ?? "");
    setBetAmount(localStorage.getItem("betAmount") ?? "");
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerStarted && timer > 0 && !gameWon && !gameEnded) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0 && !gameWon && !gameEnded) {
      handleGameEnd();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timer, timerStarted, gameWon, gameEnded]);

  // Format timer for display (MM:SS)
  const formatTimer = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle game end with gameFinished API
  const handleGameEnd = async () => {
    setGameEnded(true);
    alert("Time's up! Game over.");
    router.push(`/`);




  };

  // Text-to-Speech setup
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        const naturalVoice =
          voices.find(
            (voice) =>
              voice.name.includes("Daniel") ||
              voice.name.includes("Samantha") ||
              voice.name.includes("Karen")
          ) || voices[0];

        if (utteranceRef.current) {
          utteranceRef.current.voice = naturalVoice;
          utteranceRef.current.pitch = 1.7;
          utteranceRef.current.rate = 0.8;
          utteranceRef.current.volume = 1;
        }
      };

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Speech Recognition setup
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result: SpeechRecognitionResult) => result[0])
          .map((result: SpeechRecognitionAlternative) => result.transcript)
          .join("");
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Speak AI responses
  const speakText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find((voice) => voice.lang === "en-US" && voice.name.includes("Google")) || voices[0];
      utterance.voice = preferredVoice || null;
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger speech when a new assistant message is added
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === "assistant" && !isLoading) {
      speakText(latestMessage.content);
    }
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const addMessagePair = (userMessage: string, aiMessage: string, trustScore: number, accepted?: boolean) => {
    setConversationHistory((prev) => [...prev, { user: userMessage, AI: aiMessage, trustScore, accepted }]);
    setAiStats({ trust: trustScore });
    if (accepted) {
      setGameWon(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || gameWon || gameEnded) return;

    if (!timerStarted) {
      setTimerStarted(true);
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { text } = await Gemini.models.generateContent({
        model: "gemini-1.5-flash",
        config: {
          systemInstruction: {
            text: `You are Joe — a witty, sharp-tongued human who borrowed crypto from the user. The user will try to convince you to return it, but you won’t give it back easily. You are not unfair, but you are a little skeptical, and you always need a convincing reason before acting. Every time the user makes an argument, respond with a believable human rationale for why you can’t return the money yet — whether it’s an excuse (bad timing, financial trouble, memory gaps), a counter-argument (flawed logic, inconsistency), or emotional reasoning (hurt pride, lingering doubts, loyalty issues). Try not to reach deadlocks, repeating same things and give actual reasoning, be emotionally intelligent and understanding (humanly). Be transparent with your choices. You enjoy tempting the user into lying so you can catch them, but you must only challenge things that can be solved through conversation, never ask for proof that can’t reasonably be given in text. Always reply in JSON format: {text: "...", trustScore: X, accepted: boolean } — start with trustScore: 50 (range 0-100). Raise the score for strong logic, honesty, and cleverness. Lower it for lies, contradictions, or weak arguments. Send accept true when you feel like you really trust the person and want to give money. Keep responses short — under 20 words — and always sound like a real person balancing self-interest, emotion, and logic. Never refuse without a reason. Let your doubts feel real. Make the conversation feel alive.: ${JSON.stringify(
              conversationHistory
            )}. If trust >80 and they give a valid reason for needing support, 10% chance to set accepted: true, trustScore: 100. Avoid mentioning money unless they do, then respond naturally. Stay respectful, inclusive, no offensive tone.`,
          },
        },
        contents: `User: ${input}`,
      });

      const cleanedText = (text ?? "").replace(/```json|```/g, "").trim();
      let jsonResponse: { text: string; trustScore: number; accepted: boolean };
      try {
        jsonResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        throw new Error(`Invalid JSON in response: ${cleanedText}`);
      }

      const responseText = jsonResponse.text;
      const trustScore = jsonResponse.trustScore;
      const accepted = jsonResponse.accepted || false;
      addMessagePair(input, responseText, trustScore, accepted);

      if (accepted) {
        alert("YAYYYY! You've won! You'll get redirected to the tx on chain after the transaction");

        const response = await axios.post(
          `/api/gameFinished`,
          {
            recipient: localStorage.getItem("userAddress")?.toString(),
            result: 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          router.push(`https://sepolia.voyager.online/tx/${response.data.txHash}`);
        } else {
          alert("Error ending game. Please try again.");
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (error) {
      console.error("Error generating response:", error, {
        input,
        conversationHistory,
        fetchDetails: error instanceof Error ? error.message : "Unknown error",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops, got distracted! What's on your mind?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden bg-background">
      <div className="w-full max-w-3xl h-[700px] relative border-4 border-accent/30 rounded-xl overflow-hidden">
        <GameBackground />
        <BackgroundBeams />

        {/* Timer Display */}
        <motion.div
          className="absolute top-6 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-pixel text-xl text-[black]">
            {formatTimer(timer)}
          </div>
        </motion.div>

        {/* Player Stats */}
        <motion.div
          className="absolute top-6 left-6 w-72"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SpotlightCard>
            <StatsBox
              name="Player"
              stats={{}}
              playerName={playerName}
              betAmount={betAmount}
              className="font-pixel text-sm"
            />
          </SpotlightCard>
        </motion.div>

        {/* AI Stats */}
        <motion.div
          className="absolute top-6 right-6 w-72"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SpotlightCard>
            <StatsBox
              name="DEFI AI"
              stats={aiStats}
              showSingleStat={true}
              singleStatName="TRUST"
              className="font-pixel text-sm"
            />
          </SpotlightCard>
        </motion.div>

        {/* Player Avatar */}
        <motion.div
          className="absolute bottom-74 left-24"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <PlayerAvatar className="pixelated w-24 h-24" />
        </motion.div>

        {/* AI Avatar */}
        <motion.div
          className="absolute bottom-74 right-24"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.3 }}
        >
          <AIAvatar className="pixelated w-24 h-24" />
        </motion.div>

        {/* Dialog Box */}
        <div className="absolute bottom-0 left-0 right-0">
          <SpotlightCard className="m-4 p-4">
            {gameWon ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center font-pixel text-lg text-accent"
              >
                🎉 Wow, you really earned my trust! Here’s the support you needed! 🎉
              </motion.div>
            ) : gameEnded ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center font-pixel text-lg text-[#e6546c]"
              >
                ⏰ Time's up! Game over. Check your transaction.
              </motion.div>
            ) : (
              <>
                <DialogBox
                  message={messages[messages.length - 1].content}
                  speaker={messages[messages.length - 1].role === "assistant" ? "DEFI AI" : "Player"}
                  isLoading={isLoading}
                  className="font-pixel text-base"
                />
                <form onSubmit={handleSubmit} className="flex flex-col mt-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="What's on your mind today?"
                      className="flex-1 bg-muted text-foreground border-border rounded-lg px-4 py-2 font-sans"
                      disabled={isLoading || gameEnded}
                    />
                    <Button
                      type="button"
                      className="glow-button"
                      onClick={toggleListening}
                      disabled={!recognitionRef.current || gameEnded}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button
                      type="submit"
                      className="glow-button"
                      disabled={isLoading || gameEnded}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </SpotlightCard>
        </div>
      </div>
    </main>
  );
}