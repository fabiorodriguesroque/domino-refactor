export function useScore() {
  const validateScore = (score: number) => {
    if (score === 10) {
      alert(`You have ${score} points! You win!`)
    }
  }

  return { validateScore }
}
