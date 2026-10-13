import './App.css'
import { CHART_HEIGHT, CHART_WIDTH, useTimaPrice } from './useTimaPrice.js'

function formatProfitLoss(value) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}$${Math.abs(value).toFixed(2)}`
}

function App() {
  const {
    latestPrice,
    chartSegments,
    buyPrice,
    buyCoin,
    sellCoin,
    hasBought,
    overallProfitLoss,
    unrealizedProfitLoss,
  } = useTimaPrice()

  return (
    <>

      <div className="container flex-column justify-center">

        <div className='srodkowanie'>

          <div id='wypelniacz-1'></div>

          <div className="table">


            <p>
              Overall profit and loss:{' '}
              <span className={overallProfitLoss >= 0 ? 'profit positive' : 'profit negative'}>
                {formatProfitLoss(overallProfitLoss)}
              </span>
            </p>

            <p>
              Unrealized profit and loss:{' '}
              <span className={unrealizedProfitLoss >= 0 ? 'profit positive' : 'profit negative'}>
                {formatProfitLoss(unrealizedProfitLoss)}
              </span>
            </p>

            <p>
              Bought TIMA at: {buyPrice === null ? 'Not bought yet' : `$${buyPrice.toFixed(2)}`}
            </p>


          </div>
          <div id='wypelniacz-2'></div>

        </div>
        <div className='container'>
          <div className="buttons width-third">
            <button type="button" id="sellButton" className='buttons-size-100-50' onClick={sellCoin} disabled={!hasBought}>Sell</button>
            <button type="button" id="buyButton" className='buttons-size-100-50' onClick={buyCoin} disabled={hasBought}>
              {hasBought ? 'Bought' : 'Buy'}
            </button>
          </div>
          <div className="chart">
            <div className="coinPrice">
              <strong>TIMA</strong>
              <span>${latestPrice.toFixed(2)}</span>
            </div>

            <svg
              className="priceChart"
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              preserveAspectRatio="none"
              aria-label={`Tima coin price: $${latestPrice.toFixed(2)}`}
            >
              {[100, 200, 300, 400].map((y) => (
                <line key={y} x1="0" y1={y} x2={CHART_WIDTH} y2={y} className="gridLine" />
              ))}

              {chartSegments.map((segment, index) => (
                <line
                  key={index}
                  x1={segment.x1}
                  y1={segment.y1}
                  x2={segment.x2}
                  y2={segment.y2}
                  stroke={segment.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          </div>

          <div className="history width-third">
            <p>history</p>
          </div>
        </div>
      </div>


    </>
  )
}

export default App
