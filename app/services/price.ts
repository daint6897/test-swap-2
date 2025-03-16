const AFTERMATH_API_URL = "https://aftermath.finance/api/price-info";

interface AftermathPriceResponse {
  [key: string]: {
    price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume_24h: number;
  };
}

export async function fetchSuiCetusPrice({
  coinTypeFrom,
  coinTypeTo,
}: {
  coinTypeFrom: string;
  coinTypeTo: string;
}): Promise<AftermathPriceResponse> {
  try {
    // Fetch SUI price
    const priceResponse = await fetch(AFTERMATH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        coins: [coinTypeFrom, coinTypeTo],
      }),
    });
    const priceData: AftermathPriceResponse = await priceResponse.json();
    return priceData;
  } catch (error) {
    console.error("Error fetching prices from Aftermath:", error);
    return {};
  }
}

// Keep the backup method as fallback
export async function fetchSuiPriceBackup(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd"
    );
    const data = await response.json();
    return data.sui.usd;
  } catch (error) {
    console.error("Error fetching backup price:", error);
    return 2.5; // Default fallback price
  }
}
