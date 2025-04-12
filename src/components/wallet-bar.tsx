import { cn } from '@/lib/utils';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';

const WalletBar: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center space-y-4">
      {!address ? (
        <div className="flex flex-wrap justify-center gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className={cn("font-pixel text-base md:text-lg bg-[#4d61e3] text-white px-6 py-3 rounded-lg",
                "shadow-[0_0_10px_#4d61e3/_0.5,_0_0_20px_#e6c054/_0.3]",
                "hover:shadow-[0_0_20px_#4d61e3/_0.7,_0_0_30px_#e6c054/_0.5] hover:-translate-y-0.5",
                "active:scale-95 transition-all duration-300 ease-out",
                "border border-[#e6c054] outline outline-2 outline-[#4d61e3] outline-offset-2",
                "opacity-100 scale-100")} >
              Connect {connector.id}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className={cn("font-pixel text-lg text-[#e6c054] transition-all duration-300 ease-out", "opacity-100 scale-100")}>
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={() => disconnect()}
            className={cn("font-pixel text-lg text-[#e6c054] transition-all duration-300 ease-out", "opacity-100 scale-100")}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletBar;
