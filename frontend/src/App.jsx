import { useState } from 'react'
import Desktop from './components/Desktop'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-white">
      <Desktop />
    </div>
  )
}

export default App