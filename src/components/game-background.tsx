"use client";

import Image from "next/image";

export default function GameBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="background-container">
        <Image
          src="/GameBack.jpg"
          alt="Game Background"
          layout="fill"
          objectFit="cover"
          className="background-image"
        />
      </div>
      <style jsx>{`
        .background-container {
          width: 100%;
          height: 100%;
        }
        .background-image {
          /* No pixelation, use default rendering */
        }
      `}</style>
    </div>
  );
}