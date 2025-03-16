"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  useWallets,
  ConnectButton,
  useCurrentAccount,
  useSuiClientQuery,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { createSwapTransaction } from "../services/aftermath";

import { useTradeRoute } from "../hooks/useTradeRoute";
import { convertToBigInt } from "../helper/convertToBigInt";
import { formatBigintToNumber } from "../helper/formatBigintToNumber";
import SelectPercentAmount from "./SelectPercentAmount";
import { TOKENS } from "../constant/TokenWhiteList";
import { useExchangeRate } from "../hooks/useExchangeRate";
import ButtonSelectCoin from "./ButtonSelectCoin";
import { getAmountCoinByRate } from "../helper/getAmountCoinByRate";
import { formatCurrencyToNumber } from "../helper/formatCurrencyToNumber";
import { isValInputOnlyNumber } from "../helper/isValInputOnlyNumber";
import { InputAmount } from "./InputAmount";

export default function SwapInterface() {
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [fromToken, setFromToken] = useState(TOKENS.SUI);
  const [toToken, setToToken] = useState(TOKENS.CETUS);

  const isChangingInput = useRef(false);

  const wallets = useWallets();
  const account = useCurrentAccount();

  const [isSwapping, setIsSwapping] = useState(false);
  const [slippage, setSlippage] = useState("1");
  const [transactionDigest, setTransactionDigest] = useState<string>("");
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const { data: priceInfo, isFetching: isLoadingRate } = useExchangeRate({
    coinTypeFrom: fromToken.coinType,
    coinTypeTo: toToken.coinType,
  });

  const { data: fromTokenBalance } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address || "",
      coinType: fromToken.coinType,
    },
    {
      enabled: !!account?.address,
      refetchInterval: 5000,
    }
  );

  const { data: toTokenBalance } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address || "",
      coinType: fromToken.coinType,
    },
    {
      enabled: !!account?.address,
      refetchInterval: 5000,
    }
  );

  const handleInputChange = (value: string) => {
    isChangingInput.current = true;
    setInputAmount(value);
    if (value === "0" || value === "") {
      setOutputAmount("");
    }
  };

  const handleOutputChange = (value: string) => {
    isChangingInput.current = false;
    setOutputAmount(value);
    if (value === "0" || value === "") {
      setInputAmount("");
    }
  };

  const onChangeSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if(value === ""){
      setSlippage("0");
      return
    }
    if (isValInputOnlyNumber(value)) return;
    
    if(value.match(/^\d*\.$/)){
      setSlippage(value);
      return
    }
    const numValue = parseFloat(value);
    if (numValue > 100) {
      setSlippage("100");
    } else if (numValue < 0) {
      setSlippage("0");
    } else {
      setSlippage(numValue.toString());
    }
  };

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
    isChangingInput.current = !isChangingInput.current;
  };

  const coinInAmount = convertToBigInt(inputAmount);
  const coinOutAmount = convertToBigInt(outputAmount);

  const amountCoinParams = isChangingInput.current
    ? { coinInAmount: coinInAmount }
    : { coinOutAmount: coinOutAmount };

  const balanceFromToken = formatBigintToNumber(
    fromTokenBalance?.totalBalance,
    fromToken.roundNumber
  );
  const balanceToToken = formatBigintToNumber(
    toTokenBalance?.totalBalance,
    toToken.roundNumber
  );
  const checkBalanceInsufficient = () => {
    if (isChangingInput.current) {
      if (Number(balanceFromToken) < formatCurrencyToNumber(inputAmount)) {
        return true;
      }
      return false;
    } else {
      if (Number(balanceToToken) < formatCurrencyToNumber(outputAmount)) {
        return true;
      }
      return false;
    }
  };
  const isInsufficientFunds = checkBalanceInsufficient();

  const {
    data: routeData,
    isLoading: isRouteLoading,
    isError: isErrorRoute,
  } = useTradeRoute(
    {
      amountCoinParams,
      coinInType: fromToken.coinType,
      coinOutType: toToken.coinType,
      slippage: parseFloat(slippage) / 100,
    },
    !isInsufficientFunds
  );

  // const tradeMetadata = routeData?.tradeMetadata

  useEffect(() => {
    if (routeData) {
      if (isChangingInput.current) {
        const coinOutAmount = routeData?.coinOut?.amount || "0";
        setOutputAmount(
          formatBigintToNumber(coinOutAmount, toToken.roundNumber)
        );
      } else {
        const coinInAmount = routeData?.coinIn.amount || "0";
        setInputAmount(
          formatBigintToNumber(coinInAmount, fromToken.roundNumber)
        );
      }
    }
  }, [routeData]);

  const handleSwap = async () => {
    if (!account || !inputAmount) return;

    setIsSwapping(true);
    try {
      const routers = {
        completeRoute: {
          routes: routeData?.routes,
          coinIn: routeData?.coinIn,
          coinOut: routeData?.coinOut,
          spotPrice: routeData?.spotPrice,
          netTradeFeePercentage: routeData?.netTradeFeePercentage,
        },
        isSponsoredTx: false,
      };

      const swapRes = await createSwapTransaction(
        routers,
        account.address,
        parseFloat(slippage) / 100
      );
      signAndExecuteTransaction(
        {
          transaction: swapRes,
          chain: "sui:mainnet",
        },
        {
          onSuccess: (result) => {
            console.log("executed transaction", result);
          },
        }
      );
    } catch (error) {
      console.error("Failed to prepare swap:", error);
    } finally {
      setIsSwapping(false);
    }
  };
  const isDisabledSwap =
    isInsufficientFunds ||
    isSwapping ||
    isRouteLoading ||
    !inputAmount ||
    !outputAmount;
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header with Wallet Info */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Swap</h2>
          {account ? (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                {formatAddress(account.address)}
              </div>
            </div>
          ) : null}
        </div>


        {/* Input Token */}
        <div className="bg-gray-50 p-4 rounded-xl mb-2">
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">You pay</p>
            <p className="text-gray-500">
              Balance: {balanceFromToken} {fromToken.symbol}
            </p>
            <SelectPercentAmount
              onChangePercentAmount={(percentAmount) => {
                handleInputChange(
                  (percentAmount * Number(balanceFromToken)).toString()
                );
              }}
            />
          </div>
          <div className="flex justify-between">
            <InputAmount
              value={inputAmount}
              onChange={(val) => handleInputChange(val)}
            />
            <ButtonSelectCoin
              tokenSelected={fromToken}
              setTokenSelected={setFromToken}
            />
          </div>
          {inputAmount
            ? `=
            $${getAmountCoinByRate(
              inputAmount,
              priceInfo?.priceData[fromToken.coinType]?.price
            )}`
            : null}
          <span></span>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-3 z-10 relative">
          <button
            onClick={handleSwapTokens}
            className="bg-white border-4 border-gray-100 rounded-xl p-2 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* Output Token */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <div className="flex justify-between mb-2">
            <p className="text-gray-500">You receive</p>
            <p className="text-gray-500">
              Balance:{" "}
              {formatBigintToNumber(
                toTokenBalance?.totalBalance,
                toToken.roundNumber
              )}{" "}
              {toToken.symbol}
            </p>
            <SelectPercentAmount
              onChangePercentAmount={(percentAmount) => {
                handleOutputChange(
                  (percentAmount * Number(balanceToToken)).toString()
                );
              }}
            />
          </div>
          <div className="flex justify-between">
            {/* <input
              type="text"
              value={outputAmount}
              onChange={(e) => handleOutputChange(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-2xl outline-none w-[60%]"
            /> */}
            <InputAmount
              value={outputAmount}
              onChange={(val) => handleOutputChange(val)}
            />
            <ButtonSelectCoin
              tokenSelected={toToken}
              setTokenSelected={setToToken}
            />
          </div>
          {outputAmount
            ? `=
            $${getAmountCoinByRate(
              outputAmount,
              priceInfo?.priceData[toToken.coinType]?.price
            )}`
            : null}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Exchange Rate</span>
            <div className="text-right">
              <div className="flex items-center justify-end">
                1 {fromToken.symbol} ={" "}
                {isLoadingRate ? "..." : priceInfo?.rate?.toFixed(2)}
                {toToken.symbol}
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Network Fee</span>
            <span>{routeData?.netTradeFeePercentage?.toFixed(6)} SUI</span>
          </div>
        </div>

        {/* Add Slippage Setting */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Slippage: </label>
          <input
            className="text-gray-500 w-[40px] border-1 border-gray-300 p-1"
            type="text"
            value={slippage}
            onChange={onChangeSlippage}
          />{" "}
          <span className="text-gray-500">%</span>
        </div>

        {isInsufficientFunds && (
          <div className="text-red-500 w-full text-center py-2">
            You have insufficient funds
          </div>
        )}
        {!account?.address && (
          <div className="text-red-500 w-full text-center py-2">
            Please connect your wallet
          </div>
        )}
        {/*  Swap Button */}
        {account?.address ? (
          <button
            onClick={handleSwap}
            disabled={isDisabledSwap}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold ${
              isDisabledSwap ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSwapping ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Swapping...
              </div>
            ) : (
              "Swap"
            )}
          </button>
        ) : (
          <ConnectButton className="w-full !bg-blue-600 !hover:bg-blue-700 !text-white rounded-xl py-3 font-semibold" />
        )}
      </div>
    </div>
  );
}
