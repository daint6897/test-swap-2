import { useQuery } from "@tanstack/react-query";
import { getTradeRoute, getTradeRouteOther, TradeRouteParams } from "../services/aftermath";

export function useTradeRouteOther(
  { amountCoinParams, coinInType, coinOutType, slippage, idRoute }: TradeRouteParams,
  enable: boolean
) {
  return useQuery({
    queryKey: [
      "tradeRoute",
      amountCoinParams,
      coinInType,
      coinOutType,
      slippage,
      idRoute
    ],
    queryFn: async ({ signal }) => {
      if (!amountCoinParams?.coinInAmount && !amountCoinParams?.coinOutAmount)
        return null;
      const res = await getTradeRouteOther(
        {
          amountCoinParams: amountCoinParams, // Convert to number as expected by the API
          coinInType: coinInType,
          coinOutType: coinOutType,
          slippage: slippage,
          idRoute: idRoute,
        },
        signal
      );
      return res;
    },

    refetchInterval: 10000,
    enabled: enable,
  });
}
