"use client"

import type React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"

export default function AirdropForm() {
    const [address, setAddress] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!address.trim()) return

        setIsLoading(true)
        setResult(null)

        try {

            const response = await fetch(`/api/mint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ recipient: address }),
            })

            const data = await response.json()

            if (response.ok) {
                setResult({ success: true, message: data.message || "Tokens successfully sent to your wallet!" })
            } else {
                setResult({ success: false, message: data.error || "Failed to process your request." })
            }
        } catch (error) {
            setResult({ success: false, message: "Network error. Please try again later." })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Claim Your Tokens</CardTitle>
                <CardDescription>Enter your wallet address to receive the airdrop</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="0x..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={isLoading}
                            className="font-mono"
                        />
                    </div>

                    {result && (
                        <Alert variant={result.success ? "default" : "destructive"}>
                            {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>{result.message}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={isLoading || !address.trim()} className="w-full">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Claim Tokens"
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
