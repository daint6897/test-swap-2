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
  idRoute?: string;
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
interface TbData {
  protocol: string;
  a2b: boolean;
  price_info_x_object_id?: string;
  price_info_y_object_id?: string;
  offchain_price_feed_offchain_id_x?: string;
  offchain_price_feed_offchain_id_y?: string;
  fee_type?: string;
}

interface Protocol {
  protocol: string;
}

interface PoolMetadata {
  tbData: TbData;
  protocol: Protocol;
}

interface Coin {
  type: string;
  amount: string;
  tradeFee: string;
}

interface Path {
  protocolName: string;
  poolId: string;
  poolMetadata: PoolMetadata;
  coinIn: Coin;
  coinOut: Coin;
  spotPrice: number;
}

export interface RouteSwap {
  paths: Path[];
  portion: string;
  coinIn: Coin;
  coinOut: Coin;
  spotPrice: number;
}
export interface TradeRoute {
  coinIn: ICoin;
  coinOut: ICoin;
  netTradeFeePercentage: number;
  routes: RouteSwap[];
  spotPrice: number;
}
export interface TradeRouteOther {
  completeRoute: TradeRoute;
  tradeMetadata: SwapTransactionAftermath;
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

export async function getTradeRouteOther(
  params: TradeRouteParams,
  signal?: AbortSignal
): Promise<TradeRouteOther> {
  const response = await fetch(
    `${AFTERMATH_API}/router/${params.idRoute}/trade-route`,
    {
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
    }
  ).catch((err) => {
    throw new Error("Failed to get trade route");
  });
  return response.json();
}

export async function createSwapTransaction(
  routers: any,
  walletAddress: string,
  slippage: number,
  idRoute: string
): Promise<string> {
  const url = idRoute === "Aftermath" ? `${AFTERMATH_API}/router/transactions/trade` : `${AFTERMATH_API}/router/${idRoute}/trade`;
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: "blocked=false",
    },

    body: JSON.stringify({ ...routers, walletAddress, slippage }),
  });

  if (!response.ok) {
    throw new Error("Failed to create swap transaction");
  }

  return response.json();
}
