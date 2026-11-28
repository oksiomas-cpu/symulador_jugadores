import React from 'react'
import ReactDOM from 'react-dom/client'
import SimuladorJugador from './SimuladorJugador'
import { MafiaHost, MafiaPlayer } from './Mafia'

// «Мафия»: ?mafia=host — пульт ведущего, ?mafia — пульт игрока. Остальное — как было.
const mafia = (() => { try { return new URLSearchParams(window.location.search).get('mafia') } catch (e) { return null } })()
const App = mafia === 'host' ? MafiaHost : mafia !== null ? MafiaPlayer : SimuladorJugador

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
