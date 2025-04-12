/* page.tsx */
"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AIAvatar from "@/components/ai-avatar";
import DialogBox from "@/components/dialog-box";
import GameBackground from "@/components/game-background";
import PlayerAvatar from "@/components/player-avatar";
import StatsBox from "@/components/stats-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Gemini } from "./ai";

interface GeminiResponse {
  text: string;
  trustScore: number;
  accepted?: boolean;
}

// Aceternity-inspired background beams component (simplified)
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
  const [betAmount, setBetAmount] = useState(500);
  const [conversationHistory, setConversationHistory] = useState<
    { user: string; AI: string; trustScore: number; accepted?: boolean }[]
  >([{ user: "", AI: "", trustScore: 0 }]);
  const [gameWon, setGameWon] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Text-to-Speech setup
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
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
    if (!input.trim() || isLoading || gameWon) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { text } = await Gemini.models.generateContent({
        model: "gemini-1.5-flash",
        config: {
          systemInstruction: {
            text: `Return responses in JSON format like {text: "Nice try, pal!", trustScore: 70}. You're DEFI, a witty AI guarding a blockchain wallet in a fun debate game. The user wants to convince you to send funds. Respond with playful, human-like sarcasm and gentle humor—think friendly banter, not mean-spirited. Ask clever questions, poke fun at inconsistencies, and keep it under 20 words. Update trustScore (0-100) based on user input and history: ${JSON.stringify(
              conversationHistory
            )}. If trust >80 and they give a valid reason for needing support, 10% chance to set accepted: true, trustScore: 100. Avoid mentioning money unless they do, then respond naturally. Stay respectful, inclusive, no offensive tone.`,
          },
        },
        contents: `User: ${input}`,
      });

      const cleanedText = text.replace(/```json|```/g, "").trim();
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
          className="absolute bottom-80 left-20"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <PlayerAvatar className="pixelated w-24 h-24" />
        </motion.div>

        {/* AI Avatar */}
        <motion.div
          className="absolute bottom-80 right-20"
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
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      className="glow-button"
                      onClick={toggleListening}
                      disabled={!recognitionRef.current}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button type="submit" className="glow-button" disabled={isLoading}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs font-pixel">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Name:</span>
                      <Input
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-24 h-6 py-0 text-xs bg-muted text-foreground border-border"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Bet:</span>
                      <Input
                        type="number"
                        value={betAmount.toString()}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="w-20 h-6 py-0 text-xs bg-muted text-foreground border-border"
                      />
                      <span className="text-muted-foreground">coins</span>
                    </div>
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