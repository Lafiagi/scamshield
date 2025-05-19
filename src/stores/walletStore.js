import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWalletStore = create(
  persist(
    (set, get) => ({
      walletAddress: null,
      connected: false,

      setWalletAddress: (address) => {
        set({
          walletAddress: address,
          connected: !!address,
        });
        if (address) {
          localStorage.setItem("wallet_address", address);
        } else {
          localStorage.removeItem("wallet_address");
        }
      },

      clearWallet: () => {
        set({
          walletAddress: null,
          connected: false,
        });
        localStorage.removeItem("wallet_address");
      },

      isConnected: () => !!get().walletAddress,
    }),
    {
      name: "wallet-storage",
      getStorage: () => localStorage,
    }
  )
);
