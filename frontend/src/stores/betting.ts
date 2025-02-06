import axios from '../utils/axios';
import { useAuthStore } from "./auth";
import { useMatchesStore } from "./matches";
import { SGM_LIMITS } from '../types';
import type { Selection, Bet, PlaceBetResponse } from '../types';
import { defineStore } from "pinia";

const API_URL = import.meta.env.VITE_API_URL;

// Define the store's state interface
interface BettingState {
  balance: number;
  currentSelections: Selection[];
  currentBets: Bet[];
  placedBets: Bet[];
  activeBets: Bet[];
  settledBets: Bet[];
  loading: boolean;
  error: string | null;
  activeMode: "single" | "multi" | "sgm";
  multiStake: number;
  isBetslipExpanded: boolean;
  isBetslipClosed: boolean;
  isMobile: boolean;
}

// Define the store type with its actions
interface BettingStore {
  state: BettingState;
  addSelection: (matchData: Omit<Selection, 'market'>) => void;
  setMode: (mode: "single" | "multi" | "sgm") => void;
  updateStake: (betId: string, stake: number) => void;
  updateMultiStake: (stake: number) => void;
  removeBet: (betId: string) => void;
  clearAllBets: () => void;
  fetchUserBets: () => Promise<void>;
  cashoutBet: (betId: string) => Promise<any>;
  placeBet: () => Promise<PlaceBetResponse>;
  addSGMSelection: (matchData: Omit<Selection, 'market'>) => void;
  placeSGMBet: () => Promise<PlaceBetResponse>;
  // ... add other action types here
}

export const useBettingStore = defineStore("betting", {
  state: (): BettingState => ({
    balance: 0,
    currentSelections: [] as Selection[],
    currentBets: [] as Bet[],
    placedBets: [] as Bet[],
    activeBets: [] as Bet[],
    settledBets: [] as Bet[],
    loading: false,
    error: null,
    activeMode: "single",
    multiStake: 0,
    isBetslipExpanded: true,
    isBetslipClosed: false,
    isMobile: false,
  }),

  getters: {
    multiOdds(): number {
      return this.currentSelections.reduce(
        (total, selection) => total * selection.odds,
        1
      );
    },
    potentialMultiWin(): number {
      return this.multiStake * this.multiOdds;
    },
    selections(): Selection[] {
      return this.currentSelections;
    },

    conflictingMatchIds(): string[] {
      const matchCounts = this.currentBets.reduce((acc, bet) => {
        const matchId = bet.selections[0]?.matchId;
        if (matchId) {
          acc[matchId] = (acc[matchId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(matchCounts)
        .filter(([_, count]) => count > 1)
        .map(([matchId]) => matchId);
    },

    canPlaceBet(): boolean {
      if (this.activeMode === "multi") {
        return (
          this.currentBets.length > 1 &&
          this.multiStake > 0 &&
          this.conflictingMatchIds.length === 0
        );
      }
      return this.currentBets.some((bet) => (bet.stake || 0) > 0);
    },

    isSGM(): boolean {
      return this.activeMode === 'sgm';
    },

    sgmOdds(): number {
      if (!this.isSGM) return 0;
      return this.currentSelections.reduce(
        (total, selection) => total * selection.odds,
        1
      );
    },

    potentialSGMWin(): number {
      if (!this.isSGM) return 0;
      return this.multiStake * this.sgmOdds;
    },

    canPlaceSGMBet(): boolean {
      if (!this.isSGM) return false;
      return (
        this.currentSelections.length >= 2 &&
        this.multiStake > 0 &&
        !this.hasIncompatibleMarkets
      );
    },

    hasIncompatibleMarkets(): boolean {
      const markets = this.currentSelections.map(s => s.market);
      return SGM_LIMITS.incompatibleMarkets.some(
        incompatiblePair =>
          incompatiblePair.every(market => markets.includes(market))
      );
    },

    isFromSGMPage(): boolean {
      if (!this.currentSelections.length) return false;
      const firstMatchId = this.currentSelections[0]?.matchId;
      return this.currentSelections.every(s => s.matchId === firstMatchId);
    }
  },

  actions: {
    addSelection(matchData: Omit<Selection, 'market'>) {
      console.log('Adding selection - Initial matchData:', matchData);

      const selection: Selection = {
        ...matchData,
        market: this.getMarketType(matchData.type),
        selection: matchData.type.split('_')[1] || matchData.type
      };

      console.log('Processed selection object:', selection);

      const existingIndex = this.currentSelections.findIndex(
        (s) => s.matchId === selection.matchId && s.type === selection.type
      );

      if (existingIndex !== -1) {
        this.currentSelections.splice(existingIndex, 1);
      } else {
        this.currentSelections.push(selection);
      }

      // Debug current selections after update
      console.log('Current selections after update:', this.currentSelections);

      // Add debug for bet placement
      console.log('Selection being sent to backend:', {
        selections: this.currentSelections.map(s => ({
          ...s,
          selection: s.selection,
          type: s.type
        }))
      });

      // Group selections from the same match into one bet
      const groupedSelections = new Map<string, Selection[]>();
      
      this.currentSelections.forEach(s => {
        const existing = groupedSelections.get(s.matchId) || [];
        groupedSelections.set(s.matchId, [...existing, s]);
      });

      this.currentBets = Array.from(groupedSelections.entries()).map(([matchId, selections]): Bet => ({
        id: matchId,
        betType: 'single',
        selections: selections,
        amount: 0,
        totalOdds: selections.reduce((total, s) => total * s.odds, 1),
        potentialWin: 0,
        stake: 0,
        homeTeam: selections[0].homeTeam,
        awayTeam: selections[0].awayTeam,
      }));
    },

    setMode(mode: "single" | "multi" | "sgm") {
      this.activeMode = mode;
      if (mode === "multi") {
        this.currentBets = this.currentBets.map((bet) => ({
          ...bet,
          selections: [bet.selections[0]],
          stake: 0,
        }));
      }
      this.multiStake = 0;
    },

    updateStake(betId: string, stake: number) {
      const bet = this.currentBets.find((b) => b.id === betId);
      if (bet) {
        bet.stake = stake;
        bet.potentialWin = stake * bet.totalOdds;
      }
    },

    updateMultiStake(stake: number) {
      this.multiStake = stake;
    },

    removeBet(betId: string) {
      const index = this.currentBets.findIndex((b) => b.id === betId);
      if (index !== -1) {
        this.currentBets.splice(index, 1);
        // Also remove from currentSelections
        this.currentSelections = this.currentSelections.filter(
          (s) => s.matchId !== betId
        );
      }
    },

    clearAllBets() {
      this.currentBets = [];
      this.currentSelections = [];
      this.multiStake = 0;
    },

    expandBetslip() {
      this.isBetslipExpanded = true;
      this.isBetslipClosed = false;
    },

    collapseBetslip() {
      this.isBetslipExpanded = false;
    },

    closeBetslip() {
      this.isBetslipClosed = true;
      this.isBetslipExpanded = false;
    },

    reopenBetslip() {
      this.isBetslipClosed = false;
      this.isBetslipExpanded = false;
    },

    setMobileState(isMobile: boolean) {
      this.isMobile = isMobile;
    },

    validateBet(): { valid: boolean; message?: string } {
      const authStore = useAuthStore();
      const userBalance = authStore.getUserBalance();
      const totalStake =
        this.activeMode === "multi"
          ? this.multiStake
          : this.currentBets.reduce((sum, bet) => sum + (bet.stake || 0), 0);

      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        return {
          valid: false,
          message: "Please login to place bets",
        };
      }

      // Check if user has enough balance
      if (totalStake > userBalance) {
        return {
          valid: false,
          message: "Insufficient balance",
        };
      }

      // Check if all required fields are filled
      if (this.activeMode === "multi") {
        if (this.currentBets.length < 2) {
          return {
            valid: false,
            message: "Multi bet requires at least 2 selections",
          };
        }
        if (!this.multiStake) {
          return {
            valid: false,
            message: "Please enter stake amount",
          };
        }
      } else {
        if (!this.currentBets.some((bet) => (bet.stake || 0) > 0)) {
          return {
            valid: false,
            message: "Please enter stake amount",
          };
        }
      }

      return { valid: true };
    },

    async placeBet(): Promise<PlaceBetResponse> {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        console.log('Starting bet placement. Mode:', this.activeMode);
        console.log('Current selections:', this.currentSelections);
        console.log('Current bets:', this.currentBets);

        let payload;

        if (this.activeMode === "multi") {
          console.log('Preparing multiple bet payload');
          console.log('Multi stake:', this.multiStake);
          console.log('Multi odds:', this.multiOdds);
          
          // For multiple bets, use all current selections
          const selections = this.currentSelections.map(selection => ({
            matchId: selection.matchId,
            selection: selection.selection || selection.type || '1',
            type: selection.type || selection.selection || '1',
            odds: selection.odds,
            sportKey: selection.sportKey,
            event: `${selection.homeTeam} vs ${selection.awayTeam}`,
            market: selection.market || this.getMarketType(selection.type || selection.selection || '1'),
            sport: selection.sportKey.split(":")[0],
            homeTeam: selection.homeTeam,
            awayTeam: selection.awayTeam,
          }));

          console.log('Processed selections for multi bet:', selections);

          payload = {
            betType: "multiple",
            amount: this.multiStake,
            totalOdds: this.multiOdds,
            potentialWin: this.multiStake * this.multiOdds,
            selections: selections
          };
        } else {
          console.log('Preparing single bet payload');
          
          // For single bets, filter bets with stakes
          const betsWithStakes = this.currentBets.filter(bet => bet.stake > 0);
          console.log('Bets with stakes:', betsWithStakes);

          const selections = betsWithStakes.flatMap(bet => 
            bet.selections.map(selection => ({
              matchId: selection.matchId,
              selection: selection.selection || selection.type || '1',
              type: selection.type || selection.selection || '1',
              odds: selection.odds,
              sportKey: selection.sportKey,
              event: `${selection.homeTeam} vs ${selection.awayTeam}`,
              market: selection.market || this.getMarketType(selection.type || selection.selection || '1'),
              sport: selection.sportKey.split(":")[0],
              homeTeam: selection.homeTeam,
              awayTeam: selection.awayTeam,
            }))
          );

          console.log('Processed selections for single bets:', selections);

          const totalStake = betsWithStakes.reduce((sum, bet) => sum + (bet.stake || 0), 0);
          const totalOdds = betsWithStakes[0]?.totalOdds || 0;

          payload = {
            betType: "single",
            amount: totalStake,
            totalOdds: totalOdds,
            potentialWin: totalStake * totalOdds,
            selections: selections
          };
        }

        console.log('Final payload being sent:', payload);

        const response = await axios.post<PlaceBetResponse>(
          `${API_URL}/bets/place`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log('Response from server:', response.data);

        if (response.data.success) {
          authStore.updateBalance(response.data.newBalance);

          if (this.activeMode === "single") {
            // Remove only the bets that were placed (had stakes)
            const betsWithStakes = this.currentBets.filter(bet => bet.stake > 0);
            betsWithStakes.forEach(bet => {
              this.removeBet(bet.id);
            });
          } else {
            // For multi mode, clear everything
            this.clearAllBets();
          }
        }

        return response.data;
      } catch (error: any) {
        console.error("Bet placement error:", error.response?.data || error);
        this.error = error.response?.data?.message || "Failed to place bet";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    getMarketType(selectionType: string): string {
      if (selectionType === "home") return "Match Winner";
      if (selectionType === "away") return "Match Winner";
      if (selectionType === "draw") return "Match Winner";
      // Add more market types as needed
      return "Match Winner"; // Default
    },

    async fetchUserBets() {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        if (!authStore.token) {
          console.log('No auth token found');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/bets/user`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
            params: {
              populate: "selections",
            },
          }
        );

        const data = response.data;
        console.log('Raw bets data:', data);

        // Transform the data to include formatted selections
        this.placedBets = Array.isArray(data) ? data.map(bet => ({
          ...bet,
          selections: bet.selections.map(selection => ({
            ...selection,
            // Extract selection type from market or type field
            selection: selection.type?.split('_')[1] || selection.market?.split('_')[1] || selection.type || 'unknown',
            // Ensure we have the event teams split correctly
            homeTeam: selection.event?.split(' vs ')[0] || selection.homeTeam,
            awayTeam: selection.event?.split(' vs ')[1] || selection.awayTeam
          }))
        })) : [];

        console.log('Transformed placed bets:', this.placedBets);

        // Filter bets into active and settled
        this.activeBets = this.placedBets.filter((bet) =>
          ["pending"].includes(bet.status || "")
        );
        console.log('Active bets with transformed selections:', this.activeBets);

        this.settledBets = this.placedBets.filter((bet) =>
          ["won", "lost", "cancelled", "cashed_out"].includes(bet.status || "")
        );
        console.log('Settled bets with transformed selections:', this.settledBets);

      } catch (err: any) {
        console.error('Fetch error:', err.response?.data || err);
        this.error = err.response?.data?.message || "Failed to fetch bets";
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    async settleBets() {
      const authStore = useAuthStore();

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/bets/settle`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to settle bets");
        }

        const data = await response.json();
        console.log("Settled bets:", data);

        // Refresh user bets after settlement
        await this.fetchUserBets();

        return data;
      } catch (error) {
        console.error("Error settling bets:", error);
        throw error;
      }
    },

    // Method to check and update bet statuses
    async checkBetStatuses() {
      const matchesStore = useMatchesStore();

      try {
        // First check for new match results
        const updatedMatches = await matchesStore.checkMatchResults();

        if (updatedMatches && updatedMatches.length > 0) {
          // If we have updated matches, trigger bet settlement
          await this.settleBets();
        }
      } catch (error) {
        console.error("Error checking bet statuses:", error);
      }
    },

    isBetSelected(matchId: string, type: string): boolean {
      return this.currentSelections.some(
        (selection) => selection.matchId === matchId && selection.type === type
      );
    },

    async cashoutBet(betId: string) {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        console.log("Initiating cashout for bet:", betId);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/bets/${betId}/cashout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Cashout response:", response.data);

        if (response.data.success) {
          // Update local state with the cashed out bet
          const updatedBet = {
            ...response.data.bet,
            cashoutAmount: response.data.cashoutAmount,
          };

          console.log("Updated bet with cashout amount:", updatedBet);

          // Update the bets lists
          this.placedBets = this.placedBets.map((bet) =>
            bet._id === betId ? updatedBet : bet
          );

          // Move bet from active to settled
          this.activeBets = this.activeBets.filter((bet) => bet._id !== betId);
          this.settledBets.unshift(updatedBet);

          // Update user balance
          authStore.updateBalance(response.data.newBalance);

          return response.data;
        } else {
          throw new Error(response.data.message || "Failed to cash out bet");
        }
      } catch (err: any) {
        console.error("Cashout error:", err.response?.data || err);
        this.error = err.response?.data?.message || "Failed to cash out bet";
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    updateBalance(newBalance: number) {
      this.balance = newBalance;
    },

    clearBetSlip() {
      this.currentBets = [];
      this.multiStake = 0;
    },

    addSGMSelection(matchData: Omit<Selection, 'market'>) {
      const selection: Selection = {
        ...matchData,
        market: this.getMarketType(matchData.type),
      };

      // For SGM, we allow multiple selections from same match
      // but not from the same market type
      const existingIndex = this.currentSelections.findIndex(
        (s) => s.matchId === selection.matchId && s.type === selection.type
      );

      if (existingIndex !== -1) {
        this.currentSelections.splice(existingIndex, 1);
      } else {
        this.currentSelections.push(selection);
      }

      // For SGM, we create a single bet with multiple selections
      this.currentBets = [{
        id: selection.matchId,
        betType: 'sgm',
        selections: this.currentSelections,
        amount: 0,
        totalOdds: this.sgmOdds,
        potentialWin: 0,
        stake: this.multiStake,
        homeTeam: selection.homeTeam,
        awayTeam: selection.awayTeam,
      }];
    },

    addRegularSelection(selection: Selection) {
      const existingIndex = this.currentSelections.findIndex(
        (s) => s.matchId === selection.matchId && s.type === selection.type
      );

      if (existingIndex !== -1) {
        this.currentSelections.splice(existingIndex, 1);
      } else {
        this.currentSelections.push(selection);
      }

      this.currentBets = this.currentSelections.map((s): Bet => ({
        id: s.matchId,
        betType: this.activeMode === "multi" ? "multiple" : "single",
        selections: [s],
        amount: 0,
        totalOdds: s.odds,
        potentialWin: 0,
        stake: 0,
        homeTeam: s.homeTeam,
        awayTeam: s.awayTeam,
      }));
    },
    async placeSGMBet(): Promise<PlaceBetResponse> {
      const authStore = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const payload = {
          betType: 'sgm',
          amount: this.multiStake,
          totalOdds: this.sgmOdds,
          potentialWin: this.potentialSGMWin,
          isSGM: true,
          selections: this.currentSelections.map(selection => ({
            matchId: selection.matchId,
            selection: selection.selection || selection.type,
            odds: selection.odds,
            sportKey: selection.sportKey,
            event: `${selection.homeTeam} vs ${selection.awayTeam}`,
            market: selection.market,
            sport: selection.sportKey.split(":")[0],
            homeTeam: selection.homeTeam,
            awayTeam: selection.awayTeam,
            commenceTime: selection.commenceTime
          }))
        };

        const response = await axios.post<PlaceBetResponse>(
          `${API_URL}/bets/place`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          authStore.updateBalance(response.data.newBalance);
          this.clearBetSlip();
        }

        return response.data;
      } catch (error: any) {
        console.error("SGM bet placement error:", error.response?.data || error);
        this.error = error.response?.data?.message || "Failed to place SGM bet";
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
}) as unknown as () => BettingStore;

// Define the store type
interface BettingStore extends ReturnType<typeof useBettingStore> {}
