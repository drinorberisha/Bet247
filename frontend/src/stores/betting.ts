import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';
import { useMatchesStore } from './matches';
import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

interface PlaceBetResponse {
  success: boolean;
  newBalance: number;
  message?: string;
}

interface Selection {
  type: string;
  odds: number;
  matchId: string;
  sportKey: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  status?: string;
}

interface Bet {
  _id?: string;
  id?: string;
  betType: 'single' | 'multiple';
  selections: Selection[];
  amount: number;
  totalOdds: number;
  potentialWin: number;
  status?: string;
  createdAt?: Date;
  settledAt?: Date;
  stake?: number;
  homeTeam?: string;
  awayTeam?: string;
}

export const useBettingStore = defineStore('betting', {
  state: () => ({
    // Current betslip selections
    currentSelections: [] as Selection[],
    currentBets: [] as Bet[],
    
    // Historical bets from DB
    placedBets: [] as Bet[],
    activeBets: [] as Bet[],
    settledBets: [] as Bet[],
    
    loading: false,
    error: null as string | null,
    activeMode: "single" as "single" | "multi",
    multiStake: 0,
    isBetslipExpanded: true,
    isBetslipClosed: false,
    isMobile: false,
  }),

  getters: {
    // Use currentSelections for betslip calculations
    multiOdds(): number {
      return this.currentSelections.reduce((total, selection) => total * selection.odds, 1);
    },
potentialMultiWin(): number {
      return this.multiStake * this.multiOdds;
    },
    // Alias currentBets as bets for BetSlip component compatibility
    bets(): Bet[] {
      return this.currentBets;
    },
    selections(): Selection[] {
      return Number((this.currentSelections).toFixed(2));
    },

    conflictingMatchIds(): string[] {
      const matchCounts = this.bets.reduce((acc, bet) => {
        acc[bet.matchId] = (acc[bet.matchId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(matchCounts)
        .filter(([_, count]) => count > 1)
        .map(([matchId]) => matchId);
    },

    canPlaceBet(): boolean {
      if (this.activeMode === "multi") {
        return (
          this.bets.length > 1 &&
          this.multiStake > 0 &&
          this.conflictingMatchIds.length === 0
        );
      }
      // For single mode, allow betting as long as there's a stake
      return this.bets.some((bet) => bet.stake > 0);
    },
  },

  actions: {
    addSelection(matchData: {
      matchId: string;
      homeTeam: string;
      awayTeam: string;
      type: string;
      odds: number;
      sportKey: string;
    }) {
      // Check if this exact selection already exists
      const existingBetIndex = this.bets.findIndex(
        (b) =>
          b.matchId === matchData.matchId &&
          b.selections[0].type === matchData.type
      );

      if (existingBetIndex >= 0) {
        // Remove the bet if clicking the same selection again
        this.bets.splice(existingBetIndex, 1);
        return;
      }

      if (this.activeMode === "single") {
        // In single mode, always create a new bet card
        this.bets.push({
          id: crypto.randomUUID(),
          matchId: matchData.matchId,
          homeTeam: matchData.homeTeam,
          awayTeam: matchData.awayTeam,
          selections: [
            {
              type: matchData.type,
              odds: matchData.odds,
            },
          ],
          stake: 0,
          sportKey: matchData.sportKey,
        });
    addSelection(selection: Selection) {
      // Check if selection already exists
      const existingIndex = this.currentSelections.findIndex(s => 
        s.matchId === selection.matchId && s.type === selection.type
      );

      if (existingIndex !== -1) {
        // Remove if already selected
        this.currentSelections.splice(existingIndex, 1);
      } else {
        // Add new selection
        this.currentSelections.push(selection);
      }

      // Update currentBets array for betslip
      this.currentBets = this.currentSelections.map(s => ({
        id: s.matchId,
        betType: 'single',
        selections: [s],
        amount: 0,
        totalOdds: s.odds,
        potentialWin: 0,
        stake: 0,
        homeTeam: s.homeTeam,
        awayTeam: s.awayTeam
      }));
        // In multi mode, check for existing match selection
        const existingMatchBet = this.bets.find(
          (b) => b.matchId === matchData.matchId
        );

        if (!existingMatchBet) {
          // Only add new selection if no existing bet for this match
          this.bets.push({
            id: crypto.randomUUID(),
            matchId: matchData.matchId,
            homeTeam: matchData.homeTeam,
            awayTeam: matchData.awayTeam,
            selections: [
              {
                type: matchData.type,
                odds: matchData.odds,
              },
            ],
            stake: 0,
            sportKey: matchData.sportKey,
          });
        }
        // If match already has a selection, do nothing (keep first selection)
      }
    },

    setMode(mode: "single" | "multi") {
      this.activeMode = mode;

      if (mode === "multi") {
        this.bets = this.bets.map((bet) => ({
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
        this.currentSelections = this.currentSelections.filter(s => s.matchId !== betId);
      }
    },

    clearAllBets() {
      this.currentBets = [];
      this.currentSelections = [];
      this.multiStake = 0;
    },

    setMode(mode: 'single' | 'multi') {
      this.activeMode = mode;
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
          : this.currentBets.reduce((sum, bet) => sum + (bet.amount || 0), 0);

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
        if (!this.currentBets.some((bet) => bet.amount > 0)) {
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

      if (!authStore.token) {
        throw new Error("Authentication required");
      }

      // Add debug logging
      console.log("Auth token:", authStore.token);

      this.loading = true;
      this.error = null;

      try {
        // Calculate total odds
        const totalOdds =
          this.activeMode === "multi"
            ? this.multiOdds
            : this.currentBets[0]?.selections[0]?.odds || 0;

        // Calculate amount and potential win
        const amount =
          this.activeMode === "multi"
            ? this.multiStake
            : this.currentBets.reduce((sum, bet) => sum + (bet.amount || 0), 0);

        const potentialWin = amount * totalOdds;

        const payload = {
          betType: this.activeMode === "multi" ? "multiple" : "single",
          amount,
          totalOdds,
          potentialWin,
          selections: this.currentBets.flatMap((bet) =>
            bet.selections.map((selection) => ({
              matchId: selection.matchId,
              selection: selection.type,
              odds: selection.odds,
              sportKey: selection.sportKey,
              event: `${selection.homeTeam} vs ${selection.awayTeam}`,
              market: this.getMarketType(selection.type),
              sport: selection.sportKey.split(":")[0],
              homeTeam: selection.homeTeam,
              awayTeam: selection.awayTeam,
            }))
          ),
        };

        console.log("Placing bet with payload:", payload); // Debug log

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

        console.log("Bet placement response:", response.data); // Debug log

        if (response.data.success) {
          authStore.updateBalance(response.data.newBalance);
          this.clearAllBets();
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/bets/user`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bets');
        }

        const data = await response.json();
        this.placedBets = Array.isArray(data) ? data : [];
        
        // Filter bets into active and settled
        this.activeBets = this.placedBets.filter(bet => 
          ['pending'].includes(bet.status || '')
        );
        
        this.settledBets = this.placedBets.filter(bet => 
          ['won', 'lost', 'cancelled', 'cashed_out'].includes(bet.status || '')
        );

      } catch (err: any) {
        this.error = err.message;
        console.error('Error fetching bets:', err);
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/bets/settle`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to settle bets');
        }

        const data = await response.json();
        console.log('Settled bets:', data);

        // Refresh user bets after settlement
        await this.fetchUserBets();

        return data;
      } catch (error) {
        console.error('Error settling bets:', error);
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
        console.error('Error checking bet statuses:', error);
      }
    },
  },
}) as unknown as () => BettingStore;
