"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function StarWarsCrawl() {
    const router = useRouter()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isCrawlComplete, setIsCrawlComplete] = useState(false)

    useEffect(() => {
        // Start playing the theme when component mounts
        if (audioRef.current) {
            audioRef.current.volume = 0.5
            audioRef.current.play().catch((err) => console.error("Audio playback failed:", err))
        }

        // Set a timer to stop the music when the crawl animation ends (90s)
        const timer = setTimeout(() => {
            setIsCrawlComplete(true)
            if (audioRef.current) {
                // Fade out the audio
                const fadeAudio = setInterval(() => {
                    if (audioRef.current && audioRef.current.volume > 0.1) {
                        audioRef.current.volume -= 0.1
                    } else {
                        if (audioRef.current) audioRef.current.pause()
                        clearInterval(fadeAudio)
                        // Redirect to the main content page after audio fades out
                        router.push("/ai")
                    }
                }, 200)
            } else {
                // If audio failed to load, still redirect
                router.push("/ai")
            }
        }, 30000) // 90 seconds to match the crawl animation duration

        // Clean up
        return () => {
            clearTimeout(timer)
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }, [router])

    useEffect(() => {
        // Add stars to the background
        const container = document.querySelector(".stars-container")
        if (container) {
            for (let i = 0; i < 200; i++) {
                const star = document.createElement("div")
                star.className = "star"
                star.style.width = `${Math.random() * 2}px`
                star.style.height = star.style.width
                star.style.left = `${Math.random() * 100}%`
                star.style.top = `${Math.random() * 100}%`
                star.style.animationDuration = `${Math.random() * 3 + 1}s`
                container.appendChild(star)
            }
        }
    }, [])

    return (
        <div className="overflow-hidden h-full w-full bg-black relative">
            <audio ref={audioRef} src="/star-wars-theme.mp3" preload="auto" loop={false} className="hidden" />
            <div className="stars-container absolute inset-0 z-0"></div>

            <div className="flex flex-col items-center justify-start h-full w-full">
                <div className="text-center mb-8 mt-8 animate-fade-out z-10">
                    <p className="text-blue-400 text-2xl font-bold star-wars-font">
                        A long time ago in a galaxy far, far away....
                    </p>
                </div>

                <div className="crawl-container perspective z-10">
                    <div className="crawl animate-crawl">
                        <div className="title">
                            <h2 className="text-yellow-400 text-4xl font-bold mb-8 text-center star-wars-font">
                                IN A WORLD WHERE BLOCKCHAINS ARE MIGHTIER THAN BATTLE CARDS…
                            </h2>
                        </div>

                        <p className="text-yellow-400 text-xl md:text-2xl mb-6 text-center">
                            The galaxy is no longer ruled by champions, trainers, or professors… but by decentralized tokens, AI
                            minds, and digital debts.
                        </p>

                        <p className="text-yellow-400 text-xl md:text-2xl mb-6 text-center">
                            Somewhere in the Neon Cluster, a human named Joe has done the unthinkable — he borrowed crypto from YOU.
                        </p>

                        <p className="text-yellow-400 text-xl md:text-2xl mb-6 text-center">
                            No smart contract. No ledger entry. Just a nod... and a promise.
                        </p>

                        <p className="text-yellow-400 text-xl md:text-2xl mb-6 text-center">
                            Now, with the space economy in chaos and golden coins raining down across the stars, you've tracked Joe
                            down — to settle the score.
                        </p>

                        <p className="text-yellow-400 text-xl md:text-2xl mb-6 text-center">
                            But Joe is no ordinary debtor. He's clever. Charming. And extremely good at talking his way out of
                            everything.
                        </p>

                        <p className="text-yellow-400 text-xl md:text-2xl mb-6 text-center">
                            To win back what's yours, you'll need more than logic. You'll need patience, wit, and an ironclad
                            argument.
                        </p>

                        <p className="text-yellow-400 text-xl md:text-2xl mb-6 text-center">
                            The debate begins now... in a café beyond the moon, under a sky full of falling stardust and digital gold.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @font-face {
          font-family: "Star Wars";
          src: url("https://fonts.cdnfonts.com/css/star-wars") format("woff");
          font-display: swap;
        }
        
        .star-wars-font {
          font-family: "Star Wars", sans-serif;
          letter-spacing: 0.2em;
        }
        
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle ease infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .perspective {
          perspective: 800px;
          height: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        
        .crawl {
          position: relative;
          top: 0;
          width: 100%;
          max-width: 800px;
          padding: 0 20px;
          transform-origin: 50% 100%;
          transform: rotateX(55deg) translateZ(0);
        }
        
        @keyframes crawl {
          0% {
            top: 100vh;
            transform: rotateX(55deg) translateZ(0);
          }
          100% {
            top: -250vh;
            transform: rotateX(55deg) translateZ(0);
          }
        }
        
        @keyframes fade-out {
          0%, 20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .animate-crawl {
          animation: crawl 50s linear forwards;
        }
        
        .animate-fade-out {
          animation: fade-out 5s ease-out forwards;
        }
      `}</style>
        </div>
    )
}
