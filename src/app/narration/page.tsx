"use client"

import { StarWarsCrawl } from "@/components/star-wars-crawl"
import Head from "next/head"

export default function Home() {
    return (
        <>
            <Head>
                <link href="https://fonts.cdnfonts.com/css/star-wars" rel="stylesheet" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
                <div className="relative w-full h-screen">
                    <StarWarsCrawl />
                </div>
            </main>
        </>
    )
}
