import { useState } from 'react'
// import headShot from './assets/groose.jpg'
import './App.css'
import axios from 'axios';

const App = () =>{
  const [location, setLocation] = useState('')
  const [responseFromAi, setResponseFromAi] = useState([])
  const [cuisine, setCuisine] = useState('')


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
            "usersFavorites": "pizza, pasta, tiramisu",
            "address": "Carrer d'en Quintana, 5, 08002 Barcelona",
            "rating": 4.6
            }
          ]
          Now return a list of 10 ${cuisine} restaurants for this location: ${location} `
        }
      ],
      model: 'gpt-4o-mini'
    }
  };
  

  

  

  const callToApi= async ()=>{
    try {
      const response = await axios.request(options);
      setResponseFromAi(JSON.parse(response.data.choices[0].message.content));
    
    } catch (error) {
      console.error(error);
    }

  }
  



  return <div>

    <input type="text" placeholder= "Enter a location" onChange={(e) => setLocation(e.target.value)} />
    <input type="text" placeholder= "Desired Cuisine" onChange={(e) => setCuisine(e.target.value)} />
    <button onClick={callToApi}>Search!</button>
    {responseFromAi.map((ele, index)=>(<div className='restaurant-wrapper' key={index}> 
      <p><h1>Restaurant: {ele.name}</h1>
      <h4><i>Restaurant Rating: {ele.rating}</i></h4>
      <h5>Customer Score: {ele.customerScore}</h5></p>

      <p><h2>Cuisine: {ele.cuisine}</h2></p>

      <p>Atmosphere: {ele.atmosphere}</p>
      <p>Dress Code: {ele.dressCode}</p>
      <p>Top Menu Item: {ele.topMenuItem}</p>
      <p>Menu Favorites: {ele.usersFavorites}</p>
      <p>Average Price/Person: {ele.averagePerPerson}</p>
      <p>Address: {ele.address}</p>
      


    </div>))}

    



    {/* <p>This is going to be a search engine website</p>
    <p>I want it to be a website where you enter your location in the top left hand corner</p>
    <p>Then it takes the results of your input, and puts it into a return</p>
    <p>It will then ask what you want to filter for restaurants....</p>
    <p>Say- you're in Barcelona, want to go to a restaurant mid price, by the water, and have it be Italian or Spanish</p>
    <p>It will then output ideas meeting the requirements of your input, and check reviews based on Google and have Google Maps pop up!</p> */}
    </div>
  
}



export default App
