import random
from abc import ABC, abstractmethod
from typing import List, Dict

class BracketStrategy(ABC):
    """
    Abstract Base Class for Bracket Generation Strategies
    """
    @abstractmethod
    def generate(self, teams: list) -> List[Dict]:
        pass

class KnockoutBracketStrategy(BracketStrategy):
    """
    Concrete Strategy implementing a single elimination Knockout Bracket
    """
    def generate(self, teams: list) -> List[Dict]:
        shuffled = teams.copy()
        random.shuffle(shuffled)
        
        matches = []
        # Pair teams
        for i in range(0, len(shuffled) - 1, 2):
            matches.append({
                "team_a_id": shuffled[i].id,
                "team_b_id": shuffled[i+1].id,
                "round_number": 1
            })
            
        # If there's an odd number of teams, the remaining team gets a "bye" 
        # (Auto-advances to the next round, so no round 1 match is generated for them)
        return matches

class BracketContext:
    """
    The Context maintains a reference to one of the Strategy objects and communicates
    with it through the Strategy interface.
    """
    def __init__(self, strategy: BracketStrategy):
        self._strategy = strategy

    @property
    def strategy(self) -> BracketStrategy:
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: BracketStrategy):
        self._strategy = strategy

    def generate_bracket(self, teams: list) -> List[Dict]:
        return self._strategy.generate(teams)
