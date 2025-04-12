"use client"
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useBalance, useAccount, useReadContract, useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core";
import { ABI } from "../abi/abi";
import { type Abi } from "starknet";
const WalletBar = dynamic(() => import('../components/wallet-bar'), { ssr: false })

export default function Home() {
  const { address: userAddress, status } = useAccount();
  // const { isLoading: balanceIsLoading, isError: balanceIsError, error: balanceError, data: balanceData } = useBalance({
  //   address: userAddress,
  //   watch: true
  // });
  const { data, error } = useBalance({ token: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  address: userAddress,
});

const contractAddress = "0x02a924fc35A8ebFc8eCEfFBEa819887b5BEF9Cc9D467C76Dd98C96DAdb2F5184";
  const { data: readData, refetch: dataRefetch, isError: readIsError, isLoading: readIsLoading, error: readError } = useReadContract({
    functionName: "name",
    args: [],
    abi: ABI as Abi,
    address: contractAddress,
    watch: true,
    refetchInterval: 1000
  });



  const [amount, setAmount] = useState<number | ''>(0);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    writeAsync();
  };


  const typedABI = ABI as Abi;
  const { contract } = useContract({
    abi: typedABI,
    address: contractAddress,
  });

  const calls = useMemo(() => {
    if (!userAddress || !contract) return [];
    return [contract.populate("mint",["0x012a81Af33795eA220345E37F91f90a5126c9bDe80443c24aa6b360f6CAfcB63",100000000000000000])];
  }, [contract, userAddress]);

  const {
    send: writeAsync,
    data: writeData,
    isPending: writeIsPending,
  } = useSendTransaction({
    calls,
  });

  const {
    data: waitData,
    status: waitStatus,
    isLoading: waitIsLoading,
    isError: waitIsError,
    error: waitError
  } = useTransactionReceipt({ hash: writeData?.transaction_hash, watch: true })

  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex items-center space-x-2">
      <div className="animate-spin">
        <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <span>{message}</span>
    </div>
  );
  const buttonContent = () => {
    if (writeIsPending) {
      return <LoadingState message="Send..." />;
    }

    if (waitIsLoading) {
      return <LoadingState message="Waiting for confirmation..." />;
    }

    if (waitStatus === "error") {
      return <LoadingState message="Transaction rejected..." />;
    }

    if (waitStatus === "success") {
      return "Transaction confirmed";
    }

    return "Send";
  };

console.log(userAddress);
  return (
    <div>
    <Button>
      Hello World
    </Button>
    {data?.formatted}
    {status}
    {readData}
    <WalletBar />
    <form onSubmit={handleSubmit} className="bg-white p-4 border-black border">
            <h3 className="text-lg font-bold mb-2">Increase Counter</h3>
            <button
              type="submit"
              className="mt-3 border border-black text-black font-regular py-2 px-4 bg-yellow-300 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!userAddress || writeIsPending}
            >
              {buttonContent()}
            </button>
            {writeData?.transaction_hash && (
              <a
                href={`https://sepolia.voyager.online/tx/${writeData?.transaction_hash}`}
                target="_blank"
                className="block mt-2 text-blue-500 hover:text-blue-700 underline"
                rel="noreferrer"
              >
                Check TX on Sepolia
              </a>
            )}
          </form>
  </div>
  );
}

