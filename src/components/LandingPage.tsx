"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useAccount, useBalance } from "@starknet-react/core"
import axios from 'axios'
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import WalletBar from "./wallet-bar"

export default function Landing() {
    const [isConnected, setIsConnected] = useState(false)
    const [betAmount, setBetAmount] = useState<number>(100)
    const [betError, setBetError] = useState<string | null>(null)
    const [selectedScenario, setSelectedScenario] = useState<"ai" | "student" | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)
    const [Balance, setBalance] = useState("0");
    const [buttonText, setButtonText] = useState("Start Game");

    const { address: userAddress, status } = useAccount();
    const router = useRouter();


    const { data, isLoading, error } = useBalance({
        token: "0x01aac141ce32fc26b55d20350bc165c70c6d5e013ca0f5adcee56785ef318293",
        address: userAddress,
    });

    useEffect(() => {
        setIsLoaded(true)
        // fetchBalance();
    }, [isLoaded])


    useEffect(() => {
        if (data) {
            setBalance(data.formatted);
        }
    }, [data]);

    // useEffect(() => {
    //     fetchBalance();
    // })

    // fetchBalance();




    const handleConnectWallet = () => {
        setIsConnected(true)
    }

    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value)
        setBetAmount(value)

        if (isNaN(value) || value == 0) {
            setBetError("Bet must be bigger than 0!"
            )
        } else if (value > parseFloat(Balance)) {
            setBetError("Your Balance is less than the bet")
        }
        else {
            setBetError(null)
        }
    }

    const handleScenarioSelect = (scenario: "ai" | "student") => {
        setSelectedScenario(scenario)
    }

    function handleSubmit() {

    }

    const isStartDisabled = isConnected || betError || buttonText == 'Starting the game....';

    return (
        <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={() => setIsVideoLoaded(true)}
                    style={{ opacity: isVideoLoaded ? 1 : 0, transition: "opacity 1s ease" }}
                >
                    <source
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/164386-830461339-SEYInJm7h7f5dwmmTamx7U9cjGTajB.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Dark overlay for better contrast */}
                <div className="absolute inset-0 bg-black/40 z-10"></div>
            </div>

            <div
                className={cn(
                    "relative z-20 max-w-[1024px] w-full mx-auto p-8 md:p-12 bg-[#1a1a2e]/90 border-4 border-[#e6c054] rounded-lg shadow-lg",
                    "transform transition-all duration-500 ease-out",
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
                )}
            >
                <header
                    className={cn(
                        "text-center mb-8 transition-all duration-500 ease-out",
                        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90",
                    )}
                >
                    <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-[#e6c054] mb-4 tracking-tight">
                        Hack the Wallet
                    </h1>
                    <p className="font-pixel text-base md:text-xl text-[#a0a0cf]">Welcome, Farmer! Ready to test your skills?</p>
                </header>

                <section
                    className={cn(
                        "text-center mb-8 max-w-[600px] mx-auto transition-all duration-500 ease-out delay-200",
                        isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5",
                    )}
                >
                    <p className="text-lg text-[#e2e2f0] font-sans">
                        Harvest coins in this fun challenge! Convince an AI or outwit a student to win big!
                    </p>
                    <button
                        className={cn(
                            "font-pixel text-lg bg-[#4d61e3] text-white px-8 py-4 rounded-lg",
                            "shadow-[0_0_10px_#4d61e3/_0.5,_0_0_20px_#e6c054/_0.3]",
                            "hover:shadow-[0_0_20px_#4d61e3/_0.7,_0_0_30px_#e6c054/_0.5] hover:-translate-y-0.5",
                            "active:scale-95 transition-all duration-300 ease-out",
                            "border border-[#e6c054] outline outline-2 outline-[#4d61e3] outline-offset-2 transform transition-all duration-500 ease-out delay-700"
                        )}
                        onClick={() => {
                            router.push('/airdrop')
                        }}
                    >
                        Get FREE Airdrop
                    </button>
                </section>

                <section className="text-center mb-8">
                    {!isConnected ? (
                        // <button
                        //     onClick={handleConnectWallet}
                        //     className={cn(
                        //         "font-pixel text-base md:text-lg bg-[#4d61e3] text-white px-6 py-3 rounded-lg",
                        //         "shadow-[0_0_10px_#4d61e3/_0.5,_0_0_20px_#e6c054/_0.3]",
                        //         "hover:shadow-[0_0_20px_#4d61e3/_0.7,_0_0_30px_#e6c054/_0.5] hover:-translate-y-0.5",
                        //         "active:scale-95 transition-all duration-300 ease-out",
                        //         "border border-[#e6c054] outline outline-2 outline-[#4d61e3] outline-offset-2",
                        //         isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90",
                        //     )}
                        // >
                        //     Connect Wallet
                        // </button>
                        <WalletBar />
                    ) : (
                        <p
                            className={cn(
                                "font-pixel text-lg text-[#e6c054] transition-all duration-300 ease-out",
                                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90",
                            )}
                        >
                            Wallet Connected!
                        </p>
                    )}
                </section>

                <section
                    className={cn(
                        "text-center mb-8 transition-all duration-500 ease-out delay-200 flex items-center justify-center",
                        isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5",
                    )}
                >
                    <div className=" text-left flex flex-col items-center justify-center">
                        <label htmlFor="bet-amount" className="block font-pixel text-sm text-[#a0a0cf] mb-2">
                            Bet Amount
                            <span className="text-[#e6c054]">[{Balance}]</span>
                        </label>
                        <input
                            id="bet-amount"
                            type="number"
                            step="0.00001"
                            min="0"
                            max="1000"
                            value={betAmount}
                            onChange={handleBetChange}
                            className={cn(
                                "w-48 h-10 px-4 py-2 bg-[#2a2a40] text-white font-sans text-base rounded-lg",
                                "border border-[#4d61e3]",
                                "focus:outline-none focus:ring-2 focus:ring-[#4d61e3]",
                                betError ? "border-[#e6546c] ring-1 ring-[#e6546c]" : "",
                            )}
                        />
                        {betError && <p className="font-pixel text-xs text-[#e6546c] mt-2">{betError}</p>}
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex flex-col md:flex-row gap-8 justify-center">
                        <div
                            onClick={() => handleScenarioSelect("ai")}
                            className={cn(
                                "w-full md:w-64 h-48 p-3 pixelated-button rounded-lg cursor-pointer",
                                "border-2 border-[#4d61e3]",
                                "transition-all duration-300 ease-out",
                                "hover:-translate-y-1 hover:shadow-[0_8px_32px_#4d61e3/_0.3]",
                                selectedScenario === "ai" ? "border-4 border-[#e6c054]" : "",
                                "transform transition-all duration-500 ease-out delay-400",
                                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90",
                            )}
                        >
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <h3 className="font-pixel text-xl text-white mb-2" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.3)" }}>
                                    Challenge Joe
                                </h3>
                                <p className="font-sans text-sm text-white" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.3)" }}>
                                    Outwit Joe, a confident opponent, to claim his prize coins!
                                </p>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
    .pixelated-button {
      background-color: #4c6c6e;
      background-image:
        linear-gradient(
          45deg,
          #6f9fa2 25%,
          transparent 25%,
          transparent 75%,
          #6f9fa2 75%,
          #6f9fa2
        ),
        linear-gradient(
          45deg,
          #6f9fa2 25%,
          transparent 25%,
          transparent 75%,
          #6f9fa2 75%,
          #6f9fa2
        );
      background-size: 10px 10px;
      background-position: 0 0, 5px 5px;
    }
  `}</style>
                </section>



                <section className="text-center">
                    {<button
                        //@ts-ignore
                        disabled={isStartDisabled}
                        className={cn(
                            "font-pixel text-lg bg-[#4d61e3] text-white px-8 py-4 rounded-lg",
                            "shadow-[0_0_10px_#4d61e3/_0.5,_0_0_20px_#e6c054/_0.3]",
                            "hover:shadow-[0_0_20px_#4d61e3/_0.7,_0_0_30px_#e6c054/_0.5] hover:-translate-y-0.5",
                            "active:scale-95 transition-all duration-300 ease-out",
                            "border border-[#e6c054] outline outline-2 outline-[#4d61e3] outline-offset-2",
                            isStartDisabled ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none" : "",
                            "transform transition-all duration-500 ease-out delay-700",
                            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90",
                        )}
                        onClick={async () => {
                            localStorage.setItem("userAddress", userAddress ?? "0xabaSA");
                            localStorage.setItem("betAmount", betAmount.toString());
                            setButtonText("Starting the game....")

                            console.log("before contract call")
                            const response = await axios.post(`/api/gameStarted`, {
                                recipient: userAddress,
                                bet: betAmount * 1000000000000000000,
                            }, {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });

                            console.log(response);

                            console.log("after contract call")

                            if (response.status == 200) {
                                router.push('/narration');
                            }
                        }}
                    >
                        {buttonText}
                    </button>}
                </section>
            </div>
        </main>
    )
}
