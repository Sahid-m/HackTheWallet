export default function GameBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-green-300 to-green-500 z-0">
      {/* Pixelated grass pattern */}
      <div
        className="absolute inset-0 bg-repeat z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='%2348bb78' fillOpacity='0.2'/%3E%3Cpath d='M0 10h20v2H0v-2zm0-4h20v2H0V6zm0-4h20v2H0V2zm0 12h20v2H0v-2zm0 4h20v2H0v-2z' fill='%2338a169' fillOpacity='0.3'/%3E%3C/svg%3E")`,
          imageRendering: "pixelated",
        }}
      ></div>
    </div>
  )
}
