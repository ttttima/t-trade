import { useEffect, useState } from 'react'

export const CHART_WIDTH = 800
export const CHART_HEIGHT = 500

const MAX_POINTS = 60

function createStartingPrices() {
  const prices = [100]

  for (let index = 1; index < MAX_POINTS; index += 1) {
    const previousPrice = prices[index - 1]
    prices.push(Math.max(1, previousPrice + (Math.random() - 0.5) * 8))
  }

  return prices
}

export function useTimaPrice() {
  const [prices, setPrices] = useState(createStartingPrices)
  const [buyPrice, setBuyPrice] = useState(null)
  const [overallProfitLoss, setOverallProfitLoss] = useState(0)

  useEffect(() => {
    const priceTimer = window.setInterval(() => {
      setPrices((currentPrices) => {
        const lastPrice = currentPrices[currentPrices.length - 1]
        const nextPrice = Math.max(1, lastPrice + (Math.random() - 0.5) * 14)

        return [...currentPrices.slice(-(MAX_POINTS - 1)), nextPrice]
      })
    }, 800)

    return () => window.clearInterval(priceTimer)
  }, [])

  const lowestPrice = Math.min(...prices)
  const highestPrice = Math.max(...prices)
  const priceRange = Math.max(highestPrice - lowestPrice, 1)
  const latestPrice = prices[prices.length - 1]
  const chartPoints = prices.map((price, index) => {
      const x = (index / (prices.length - 1)) * CHART_WIDTH
      const y = CHART_HEIGHT - ((price - lowestPrice) / priceRange) * (CHART_HEIGHT - 60) - 30
      return { x, y, price }
    })
  const chartSegments = chartPoints.slice(1).map((point, index) => {
    const previousPoint = chartPoints[index]

    return {
      x1: previousPoint.x,
      y1: previousPoint.y,
      x2: point.x,
      y2: point.y,
      color: point.price >= previousPoint.price ? '#32d583' : '#f04438',
    }
  })

  function buyCoin() {
    if (buyPrice !== null) return

    setBuyPrice(latestPrice)
  }

  function sellCoin() {
    if (buyPrice === null) return

    setOverallProfitLoss((currentProfitLoss) => (
      currentProfitLoss + latestPrice - buyPrice
    ))
    setBuyPrice(null)
  }

  const hasBought = buyPrice !== null
  const unrealizedProfitLoss = hasBought ? latestPrice - buyPrice : 0

  return {
    latestPrice,
    chartSegments,
    buyPrice,
    buyCoin,
    sellCoin,
    hasBought,
    overallProfitLoss,
    unrealizedProfitLoss,
  }
}
