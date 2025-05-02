import { useState } from 'react'
// import headShot from './assets/groose.jpg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () =>{
  const user = 'Gabrielle'
  const friends = ['Elizabeth', 'Caroline', 'Gabrielle']

  return <div>
    <p><h1>Gabrielle Roose Website</h1></p>
    <p>Hello {user}</p>


  
    {friends.map((friend, index) => {
      return <p key={index}>{friend}</p>
    })}




    <p>This is going to be a search engine website</p>
    <p>I want it to be a website where you enter your location in the top left hand corner</p>
    <p>Then it takes the results of your input, and puts it into a return</p>
    <p>It will then ask what you want to filter for restaurants....</p>
    <p>Say- you're in Barcelona, want to go to a restaurant mid price, by the water, and have it be Italian or Spanish</p>
    <p>It will then output ideas meeting the requirements of your input, and check reviews based on Google and have Google Maps pop up!</p>
    </div>
  

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}



export default App
