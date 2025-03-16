import { useQuery } from "@tanstack/react-query";
import { fetchSuiCetusPrice } from "../services/price";

interface UseExchangeRateProps {
  coinTypeFrom: string;
  coinTypeTo: string;
}

export function useExchangeRate({
  coinTypeFrom,
  coinTypeTo,
}: UseExchangeRateProps) {
  return useQuery({
    queryKey: ["exchangeRate", coinTypeFrom, coinTypeTo],
    queryFn: async () => {
      const priceData = await fetchSuiCetusPrice({
        coinTypeFrom,
        coinTypeTo,
      });
      const coinFromPrice = priceData[coinTypeFrom]?.price;
      const coinToPrice = priceData[coinTypeTo]?.price;

      const rate = coinFromPrice / coinToPrice;

      return { rate, priceData };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}
