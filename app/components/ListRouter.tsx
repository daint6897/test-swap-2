import { useEffect, useRef } from "react";
import { TOKENS } from "../constant/TokenWhiteList";
import { formatBigintToNumber } from "../helper/formatBigintToNumber";
import { getAmountCoinByRate } from "../helper/getAmountCoinByRate";
import { useTradeRoute } from "../hooks/useTradeRoute";
import { useTradeRouteOther } from "../hooks/useTradeRouteOther";
import { TradeRoute, TradeRouteOther } from "../services/aftermath";

export default function ListRouter({
  routes,
  idRouteSelected,
  coinNameIn,
  onSelectRoute,
  priceCoinOut,
  amountCoinParams,
  fromTokenCoinType,
  toTokenCoinType,
  slippage,
}: {
  routes: TradeRoute;
  onSelectRoute: (
    route: TradeRoute | undefined | TradeRouteOther["tradeMetadata"],
    idRouteSelected: string
  ) => void;
  coinNameIn: string;
  priceCoinOut: number | undefined;
  amountCoinParams: {
    coinInAmount?: string;
    coinOutAmount?: string;
  };
  fromTokenCoinType: string;
  toTokenCoinType: string;
  slippage: string;
  idRouteSelected: string;
}) {
  const autoSelectRoute = useRef(true);
  const params = {
    amountCoinParams,
    coinInType: fromTokenCoinType,
    coinOutType: toTokenCoinType,
    slippage: parseFloat(slippage) / 100,
  };
  const { data: routeDataCetus, isFetching: isRouteCetusLoading } =
    useTradeRouteOther(
      {
        ...params,
        idRoute: "cetus",
      },
      true
    );
//   const { data: routeDataFlowx, isFetching: isRouteFlowxLoading } =
//     useTradeRouteOther(
//       {
//         ...params,
//         idRoute: "flowx",
//       },
//       true
//     );
//   const { data: routeData7k, isFetching: isRoute7kLoading } =
//     useTradeRouteOther(
//       {
//         ...params,
//         idRoute: "7k",
//       },
//       true
//     );
  const dataRote = [
    {
      id: "Aftermath",
      data: routes,
      dataMeta: undefined,
      isLoading: false,
    },
    {
      id: "cetus",
      data: routeDataCetus?.completeRoute,
      dataMeta: routeDataCetus?.tradeMetadata,
      isLoading: isRouteCetusLoading,
    },
    // {
    //   id: "7k",
    //   data: routeData7k?.completeRoute,
    //   dataMeta: routeData7k?.tradeMetadata,
    //   isLoading: isRoute7kLoading,
    // },
    // {
    //   id: "flowx",
    //   data: routeDataFlowx?.completeRoute,
    //   dataMeta: routeDataFlowx?.tradeMetadata,
    //   isLoading: isRouteFlowxLoading,
    // },
  ];

  const getBestRouter = () => {
    let bestRouter = "";
    let maxAmountOut = 0;
    dataRote.forEach((item) => {
      const amountOut = parseFloat(
        formatBigintToNumber(
          item?.data?.coinOut?.amount,
          TOKENS[coinNameIn as keyof typeof TOKENS].roundNumber
        )
      );
      if (amountOut > maxAmountOut) {
        maxAmountOut = amountOut;
        bestRouter = item.id;
      }
    });
    return bestRouter;
  };
  const idRouterBest = getBestRouter();

  useEffect(() => {
    if (autoSelectRoute.current) {
      onSelectRoute(
        dataRote.find((item) => item.id === idRouterBest)?.data,
        idRouterBest
      );
    }
  }, [idRouterBest]);
  return (
    <div className="space-y-4 h-96 overflow-y-auto pr-2 mt-4">
      Router:
      {dataRote.map((route) => {
        let coinOutAmount = route?.data?.coinOut?.amount;
        coinOutAmount = formatBigintToNumber(
          coinOutAmount,
          TOKENS[coinNameIn as keyof typeof TOKENS].roundNumber
        );
        const isBest = idRouterBest === route.id;
        const isSelected = idRouteSelected === route.id;
        return (
          <div
            key={route.id}
            className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-xl p-2 border border-gray-700 ${
              isSelected ? "border-green-500" : ""
            }`}
            onClick={() => {
              autoSelectRoute.current = false;
              if (route.dataMeta) {
                onSelectRoute(route?.dataMeta, route.id, );
              } else {
                onSelectRoute(route?.data, route.id);
              }
            }}
          >
            <div className="flex items-center space-x-3 w-full">
              {coinOutAmount ? (
                <div>
                  <div className="font-medium">
                    {coinOutAmount} {coinNameIn}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span>{`$${getAmountCoinByRate(
                      coinOutAmount,
                      priceCoinOut
                    )}`}</span>
                  </div>
                </div>
              ) : (
                <div className="text-red-400">No router available</div>
              )}

              <div className="ml-auto">
                {isBest ? (
                  <div className="text-xs text-right text-green-500">BEST</div>
                ) : null}

                {route.id}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
