export const TOKENS = {
    SUI: {
      name: "SUI",
      symbol: "SUI",
      roundNumber: 9,
      icon: "/assets/tokens/sui.svg", // Updated to official SUI logo
      coinType:
        "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI", //mainnet
      //"0x2::sui::SUI",
    },
    CETUS: {
      name: "CETUS",
      symbol: "CETUS",
      roundNumber: 9,
      icon: "/assets/tokens/cetus.png", // Updated to official CETUS logo
      // Testnet CETUS token address
      coinType:
        "0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS", //mainnet
      //"0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS",
    },
    USDC: {
      name: "USDC",
      symbol: "USDC",
      roundNumber: 6,
      icon: "/assets/tokens/usdc.png",
      coinType:
        "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
    },
  };