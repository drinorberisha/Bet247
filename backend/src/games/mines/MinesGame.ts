interface MinesGameState {
  gameId: string;
  betAmount: number;
  minesCount: number;
  minePositions: number[];
  revealedPositions: number[];
  currentMultiplier: number;
  isComplete: boolean;
}

class MinesGame {
  private state: MinesGameState;

  constructor(gameId: string, betAmount: number, minesCount: number) {
    this.state = {
      gameId,
      betAmount,
      minesCount,
      minePositions: [],
      revealedPositions: [],
      currentMultiplier: 1,
      isComplete: false
    };
    this.initializeGame();
  }

  private initializeGame(): void {
    // Generate mine positions
    this.state.minePositions = this.generateMinePositions();
  }

  private generateMinePositions(): number[] {
    const positions = new Set<number>();
    while (positions.size < this.state.minesCount) {
      positions.add(Math.floor(Math.random() * 25));
    }
    return Array.from(positions);
  }

  public revealTile(position: number): {
    isMine: boolean;
    currentMultiplier: number;
    currentProfit: number;
  } {
    if (this.state.isComplete || this.state.revealedPositions.includes(position)) {
      throw new Error('Invalid move');
    }

    const isMine = this.state.minePositions.includes(position);
    if (isMine) {
      this.state.isComplete = true;
      return {
        isMine: true,
        currentMultiplier: 0,
        currentProfit: 0
      };
    }

    this.state.revealedPositions.push(position);
    this.updateMultiplier();

    return {
      isMine: false,
      currentMultiplier: this.state.currentMultiplier,
      currentProfit: this.calculateProfit()
    };
  }

  private updateMultiplier(): void {
    // Calculate new multiplier based on revealed tiles and mines count
    // This would use the actual probability calculations
    this.state.currentMultiplier = this.calculateMultiplier();
  }

  private calculateMultiplier(): number {
    // Implement actual multiplier calculation based on probability
    // This is a placeholder
    return 1 + (this.state.revealedPositions.length * 0.1);
  }

  private calculateProfit(): number {
    return this.state.betAmount * this.state.currentMultiplier;
  }

  public cashout(): number {
    if (!this.state.isComplete && this.state.revealedPositions.length > 0) {
      this.state.isComplete = true;
      return this.calculateProfit();
    }
    throw new Error('Cannot cashout');
  }

  public getState(): MinesGameState {
    return { ...this.state };
  }
}

export default MinesGame; 