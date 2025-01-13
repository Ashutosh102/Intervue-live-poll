'use client'

import { Provider } from 'react-redux'
import { store } from './store/store'
import { WelcomePage } from './components/welcome-page'
import '../styles/globals.css'

export default function App() {
  return (
    <Provider store={store}>
      <WelcomePage />
    </Provider>
  )
}

