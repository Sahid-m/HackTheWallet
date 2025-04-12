"use client"

import Image from "next/image"

export default function PlayerAvatar() {
  return (
    <div className="relative w-24 h-24 transform-gpu">
      <div className="pixelated-container">
        <Image
          src="/player.png"
          alt="Player Avatar"
          width={96}
          height={96}
          className="pixelated"
        />
      </div>
      <style jsx>{`
        .pixelated-container {
          image-rendering: pixelated;
          transform: scale(1.5);
          transform-origin: bottom center;
        }
        .pixelated {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  )
}
