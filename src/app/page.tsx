"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useBalance, useAccount } from "@starknet-react/core";
const WalletBar = dynamic(() => import('../components/wallet-bar'), { ssr: false })


export default function Home() {
  const { address, status } = useAccount();
  const { data, error } = useBalance({
  address: address,
});
  return (
    <div>
    <Button>
      Hello World
    </Button>
    {data?.formatted}
    {status}
    <WalletBar />
  </div>
  );
}

