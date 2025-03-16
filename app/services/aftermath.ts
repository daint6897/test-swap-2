const AFTERMATH_API = "https://aftermath.finance/api";

export interface TradeRouteParams {
  coinOutType: string;
  coinInType: string;
  // coinInAmount: string;
  amountCoinParams: {
    coinInAmount?: string;
    coinOutAmount?: string;
  };
  slippage?: number;
}

export interface ICoin {
  coinType: string;
  amount: string;
  tradeFee: string;
}
interface ExtendedDetails {
  afterSqrtPrice: bigint;
}

interface Path {
  id: string;
  direction: boolean;
  provider: string;
  from: string;
  target: string;
  feeRate: string;
  amountIn: number;
  amountOut: number;
  extendedDetails: ExtendedDetails;
}

interface Route {
  path: Path[];
  amountIn: bigint;
  amountOut: bigint;
  initialPrice: string;
}

export interface SwapTransactionAftermath {
  amountIn: string;
  amountOut: string;
  routes: Route[];
}

export interface TradeRoute {
  // completeRoute: {
  //   coinIn: ICoin;
  //   coinOut: ICoin;
  //   netTradeFeePercentage: number;
  //   routes: any[];
  //   spotPrice: number;
  // };
  // tradeMetadata: SwapTransactionAftermath;

  coinIn: ICoin;
  coinOut: ICoin;
  netTradeFeePercentage: number;
  routes: any[];
  spotPrice: number;
}

export interface SwapTransaction {
  tx: {
    kind: string;
    data: any;
  };
}

export async function getTradeRoute(
  params: TradeRouteParams,
  signal?: AbortSignal
): Promise<TradeRoute> {
  const response = await fetch(`${AFTERMATH_API}/router/trade-route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params.amountCoinParams,
      coinInType: params.coinInType,
      coinOutType: params.coinOutType,
      slippage: params.slippage,
    }),
    signal,
  }).catch((err) => {
    throw new Error("Failed to get trade route");
  });
  return response.json();
}

export async function createSwapTransaction(
  routers: any,
  walletAddress: string,
  slippage: number
): Promise<string> {
  const response = await fetch(`${AFTERMATH_API}/router/transactions/trade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": "blocked=false"
    },

    body: JSON.stringify({ ...routers, walletAddress, slippage }),

  });

  if (!response.ok) {
    throw new Error("Failed to create swap transaction");
  }

  return response.json();
}
