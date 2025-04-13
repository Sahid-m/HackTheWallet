import AirdropForm from "@/components/airdropComponent"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Token Airdrop</h1>
                <p className="text-muted-foreground text-center mb-8">Enter your wallet address below to receive your tokens</p>
                <AirdropForm />
            </div>
        </main>
    )
}
