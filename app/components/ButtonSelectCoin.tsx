import React, { useState } from "react";
import { TOKENS } from "../constant/TokenWhiteList";

interface Coin {
  name: string;
  symbol: string;
  roundNumber: number;
  icon: string;
  coinType: string;
}

const ButtonSelectCoin = ({
  tokenSelected,
  setTokenSelected,
}: {
  tokenSelected: Coin;
  setTokenSelected: (token: Coin) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const onClickCoin = (coin: Coin) => {
    setTokenSelected(coin);
    closeModal();
  };
  const coins = Object.values(TOKENS);
  return (
    <div>
      <button
        onClick={openModal}
        className="bg-gray-200 hover:bg-gray-100 text-white rounded-full px-4 py-2 flex items-center space-x-3 cursor-pointer"
      >
        <div className="rounded-full w-8 h-8 flex items-center justify-center">
          <img
            src={tokenSelected.icon}
            className="w-6 h-6"
            alt={tokenSelected.symbol}
          />
        </div>
        <span className="font-bold text-lg text-black">
          {tokenSelected.symbol}
        </span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 text-white rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Select a coin</h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={closeModal}
              >
                X
              </button>
            </div>
            <div className="mt-4">
              <div className="space-y-4 h-96 overflow-y-auto pr-2">
                {coins.map((coin) => (
                  <div
                    key={coin.coinType}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-800 rounded-xl p-2 border border-gray-700"
                    onClick={() => onClickCoin(coin)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full w-8 h-8 flex items-center justify-center">
                        <img
                          src={coin.icon}
                          className="w-6 h-6"
                          alt={coin.symbol}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <span>{coin.symbol}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonSelectCoin;
