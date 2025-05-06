import { useState } from 'react'
// import headShot from './assets/groose.jpg'
import './App.css'
import axios from 'axios';

const App = () =>{
  const [location, setLocation] = useState('')
  const [responseFromAi, setResponseFromAi] = useState([])
  const [cuisine, setCuisine] = useState('')
  const [isLoading, setIsLoading] = useState(false);


  const options = {
    method: 'POST',
    url: 'https://chatgpt-42.p.rapidapi.com/chat',
    headers: {
      'x-rapidapi-key': 'acc8a56a93msh48709932071e291p13c243jsn711c059f145e',
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      messages: [
        {
          role: 'user',
          content: `Return ONLY this JSON array of restaurants. No text, no markdown, no explanation.
          [
            {
              "name": "Can Culleretes",
            "cuisine": "Catalan",
            "averagePerPerson": "10 - 30 euros",
            "customerScore": "4.5",
            "topMenuItem": "Patatas Bravas",
            "atmosphere": "Casual",
            "dressCode": "Any",
            "usersFavorites": "Pizza, Pasta, Tiramisu",
            "address": "Carrer d'en Quintana, 5, 08002 Barcelona",
            "rating": 4.6
            "linkToSite": "https://culleretes.com/"
            }
          ]
          Now return a list of 10 ${cuisine} restaurants for this location: ${location} `
        }
      ],
      model: 'gpt-4o-mini'
    }
  };
  

  

  

  const callToApi= async ()=>{
    setIsLoading(true);
    try {
      const response = await axios.request(options);
      setResponseFromAi(JSON.parse(response.data.choices[0].message.content));
    
    } catch (error) {
      console.error(error);
    } finally{
      setIsLoading(false);
    }

  }

  const handleClick=(url)=>{
    window.open(url, "_blank")
  }
  



  return <div>

<nav className="my-navbar">
        <h1>Worldwide Restaurant Finder</h1>
      </nav>

      <nav className="search-navbar">
      <input className='location-style' type="text" placeholder= "Enter a location" onChange={(e) => setLocation(e.target.value)} />
    <input className='cuisine-style' type="text" placeholder= "Desired Cuisine" onChange={(e) => setCuisine(e.target.value)} />

    <button className='search-style' onClick={callToApi}>
    <>
          <span role="img" aria-hidden="true">🔍</span> Search
          {/* Or just the icon: <span role="img" aria-label="Search">🔍</span> */}
        </></button>

      </nav>

      {responseFromAi.length==0 && <p>This will be some content</p>}



    {isLoading && (
        <div className="loading-screen">
          <p>Loading restaurants, please wait...</p>
          {/* You could add a spinner GIF or CSS animation here too! */}
        </div>
      )}


    <div className= 'restaurants-grid'>
    {responseFromAi.map((ele, index)=>(<div onClick={()=>handleClick(ele.linkToSite)} className='restaurant-wrapper' key={index}> 
      <div><h1> {ele.name}</h1>
      <h4><i>Restaurant Rating: {ele.rating}</i></h4>
      <h5>Customer Score: {ele.customerScore}</h5></div>

      <p><h2>Cuisine: {ele.cuisine}</h2></p>

      <p><b>Atmosphere:</b> {ele.atmosphere}</p>
      <p><b>Dress Code:</b> {ele.dressCode}</p>
      <p><b>Top Menu Item:</b> {ele.topMenuItem}</p>
      <p><b>Menu Favorites:</b> {ele.usersFavorites}</p>
      <p><b>Average Price/Person:</b> {ele.averagePerPerson}</p>
      <p><b>Address:</b> {ele.address}</p>
      


    </div>))}
    </div>

    <div className= "footer">
      <footer>
        <h4>Gabrielle Roose - All rights Reserved <br /> May 6, 2025 / Barcelona, Spain</h4>
        
      </footer>


    </div>

    



    {/* <p>This is going to be a search engine website</p>
    <p>I want it to be a website where you enter your location in the top left hand corner</p>
    <p>Then it takes the results of your input, and puts it into a return</p>
    <p>It will then ask what you want to filter for restaurants....</p>
    <p>Say- you're in Barcelona, want to go to a restaurant mid price, by the water, and have it be Italian or Spanish</p>
    <p>It will then output ideas meeting the requirements of your input, and check reviews based on Google and have Google Maps pop up!</p> */}
    </div>
  
}



export default App
