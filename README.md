
 ![image](https://github.com/user-attachments/assets/c56f9da4-2eb7-48fc-9719-b99046a0fc97)

  Hack the Wallet

**Hack the Wallet** is an immersive blockchain-based game built on Starknet, blending conversational AI with retro pixel-art aesthetics. Challenge Joe, a cunning AI, to reclaim borrowed crypto through witty dialogue. With a Star Wars-inspired crawl, voice interaction, and a free 100-token airdrop, this game makes DeFi fun and accessible. Ready to outsmart the wallet? 🚀

---

## 📜 Table of Contents

- [Project Summary](#project-summary)
- [Features](#features)
- [Demo Screenshots](#demo-screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [How to Play](#how-to-play)
- [Airdrop](#airdrop)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌟 Project Summary

**Hack the Wallet** is a Next.js-powered game where players connect their Starknet wallet to engage in a conversational challenge. The goal? Convince Joe, an AI opponent, to return borrowed cryptocurrency by building trust through clever arguments. The game features a retro pixelated UI, a cinematic Star Wars crawl intro, and blockchain integration for betting and rewards.

Key objectives:
- Create an engaging DeFi experience with gamified blockchain interactions.
- Combine conversational AI with voice input/output for accessibility.
- Offer a free airdrop to onboard new players seamlessly.

Built for the Sepolia testnet, the game supports wallet connections, on-chain transactions, and a trust-based scoring system. Whether you’re a blockchain enthusiast or a casual gamer, **Hack the Wallet** delivers a unique blend of strategy and style.

---

## ✨ Features

- **Starknet Wallet Integration**: Connect wallets like Argent X or Braavos to bet and win tokens.
- **Conversational Gameplay**: Outwit Joe using text or voice; win by raising his trust score.
- **Pixel-Art Aesthetic**: Retro design with Press Start 2P font and animated backgrounds.
- **Star Wars Crawl**: A cinematic intro that sets the sci-fi tone.
- **Airdrop System**: Mint 100 free tokens to try the game without spending.
- **Voice Interaction**: Speech recognition and text-to-speech for immersive gameplay.
- **Non-Responsive UI**: Fixed layout with pixel-perfect design (e.g., `h-[700px]`, `w-72`).
- **On-Chain Rewards**: Successful players view transactions on Sepolia Voyager.

---

## 📷 Demo Screenshots

Explore the game’s retro-futuristic vibe through these screenshots!

| **Landing Page** | **Airdrop Page** |
|-----------------|-----------------|
| ![LandingPage](https://github.com/user-attachments/assets/4842170b-d4eb-4991-bf65-3657385014ae)
|![airdroppage](https://github.com/user-attachments/assets/73a72974-ca42-42a0-8b1c-7c73b7dbe1d3)
|

| **Star Wars Crawl** | **Game Interface** |
|---------------------|-------------------|
| ![narrationpage](https://github.com/user-attachments/assets/4c214fb2-6098-481c-850e-ce7b6468da46)
| ![gamepage](https://github.com/user-attachments/assets/74a99569-f75d-4d6b-b51e-6d566f7a5d22)
|

| **Game Win** | **Transaction Confirmation** |
|-------------|-----------------------------|
|![winpage](https://github.com/user-attachments/assets/e00ce850-6d48-453e-8474-2008017f8fcd)
 | ![lastpagewheretokenaresendafterwinning](https://github.com/user-attachments/assets/0f926727-3a84-41c8-a84d-bf133948527e)
 |

---

## 🛠 Tech Stack

- **Frontend**:
  - Next.js (React framework)
  - Tailwind CSS (styling)
  - Framer Motion (animations)
  - tw-animate-css (additional effects)
- **Blockchain**:
  - Starknet (Layer 2 scaling)
  - starknet-react/core (wallet and contract hooks)
- **Fonts**:
  - Geist, Geist Mono
  - Press Start 2P (pixel font)
- **APIs**:
  - Gemini 1.5 Flash (conversational AI)
  - Axios (backend communication)
  - SpeechRecognition & SpeechSynthesis (voice features)
- **Contract**:
  - Starknet contract for minting and transactions
  - ABI for reading contract data

---

## 🚀 Getting Started

Run **Hack the Wallet** locally to join the fun.

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended package manager)
- **Starknet Wallet** (e.g., Argent X or Braavos, set to Sepolia testnet)
- **Git**

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/hack-the-wallet.git
   cd hack-the-wallet
