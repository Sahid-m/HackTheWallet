import { ABI } from "@/abi/abi";
import { NextRequest } from "next/server";
import {
  Account,
  cairo,
  CallData,
  constants,
  Contract,
  ec,
  json,
  num,
  Provider,
  RPC,
  RpcProvider,
} from "starknet";
import { any, z } from "zod";
import { Contract_abi } from "../abi";
import { ACCOUNT_ADDRESS, PRIVATE_KEY, PUBLIC_KEY } from "../account";

export async function POST(request: NextRequest) {
  try {
    const { recipient, bet } = await request.json();

    if (!recipient || !bet) {
      return new Response(
        JSON.stringify({ error: "Missing recipient address or bet" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("inp", recipient, bet);

    const Private_KEY = PRIVATE_KEY;
    const P_KEY = PUBLIC_KEY;
    const CONTRACT_ADDRESS =
      "0x01aac141ce32fc26b55d20350bc165c70c6d5e013ca0f5adcee56785ef318293";

    if (!Private_KEY || !P_KEY || !CONTRACT_ADDRESS) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const provider = new RpcProvider({
      nodeUrl: "https://starknet-sepolia.public.blastapi.io",
    });

    const ContractABI = new Contract(ABI, CONTRACT_ADDRESS, provider);

    const account = new Account(
      provider,
      ACCOUNT_ADDRESS,
      PRIVATE_KEY,
      undefined,
      constants.TRANSACTION_VERSION.V3
    );

    const myCall = ContractABI.populate("games_start", [recipient, bet]);
    //@ts-ignore
    const maxQtyGasAuthorized = 1800n; // max quantity of gas authorized
    //@ts-ignore
    const maxPriceAuthorizeForOneGas = 50n * 10n ** 12n; // max FRI authorized to pay 1 gas (1 FRI=10**-18 STRK)
    console.log(
      "max authorized cost =",
      maxQtyGasAuthorized * maxPriceAuthorizeForOneGas,
      "FRI"
    );
    const { transaction_hash: txH } = await account.execute(myCall, {
      version: 3,
      maxFee: 10 ** 15,
      feeDataAvailabilityMode: RPC.EDataAvailabilityMode.L1,
      tip: 10 ** 13,
      paymasterData: [],
      resourceBounds: {
        l1_gas: {
          max_amount: num.toHex(maxQtyGasAuthorized),
          max_price_per_unit: num.toHex(maxPriceAuthorizeForOneGas),
        },
        l2_gas: {
          max_amount: num.toHex(0),
          max_price_per_unit: num.toHex(0),
        },
      },
    });
    const txR = await provider.waitForTransaction(txH);
    if (txR.isSuccess()) {
      console.log("Paid fee =", txR.actual_fee);
      console.log("Paid fee =", txR.transaction_hash);

      return new Response(
        JSON.stringify({
          message: "Mint successful",
          txHash: txR.transaction_hash,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Mint failed",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Mint failed:", error);
    return new Response(
      JSON.stringify({ error: "Mint failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
