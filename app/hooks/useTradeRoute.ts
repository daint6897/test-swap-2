import { useQuery } from "@tanstack/react-query";
import { getTradeRoute, TradeRouteParams } from "../services/aftermath";

export function useTradeRoute(
  { amountCoinParams, coinInType, coinOutType, slippage }: TradeRouteParams,
  enable: boolean
) {
  return useQuery({
    queryKey: [
      "tradeRoute",
      amountCoinParams,
      coinInType,
      coinOutType,
      slippage,
    ],
    queryFn: async ({ signal }) => {
      if (!amountCoinParams?.coinInAmount && !amountCoinParams?.coinOutAmount)
        return null;
      const res = await getTradeRoute(
        {
          amountCoinParams: amountCoinParams, // Convert to number as expected by the API
          coinInType: coinInType,
          coinOutType: coinOutType,
          slippage: slippage,
        },
        signal
      );
      return res;
    },

    refetchInterval: 3000,
    enabled: enable,
  });
}
