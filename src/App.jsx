import { useState, useMemo } from 'react'
import Select from 'react-select';
import './App.css'
import axios from 'axios';
import rrImage from './images/RR.jpg'
import rrMainImage from './images/RR-main.webp'
 
const cuisineOptionsList = [
  { value: 'american', label: 'American' },
  { value: 'catalan', label: 'Catalan' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'french', label: 'French' },
  { value: 'georgian', label: 'Georgian' },
  { value: 'greek', label: 'Greek' },
  { value: 'indian', label: 'Indian' },
  { value: 'italian', label: 'Italian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'middle-eastern', label: 'Middle-Eastern' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'thai', label: 'Thai' },
];

const PRICE_TIERS = [
  { label: '$', max: 15 },
  { label: '$$', max: 30 },
  { label: '$$$', max: 60 },
  { label: '$$$$', max: Infinity },
];

const parseMaxPrice = (str) => {
  if (!str) return Infinity;
  const nums = str.match(/\d+/g);
  if (!nums) return Infinity;
  return parseInt(nums[nums.length - 1], 10);
};
 
const selectStyles = {
  control: (base) => ({
    ...base,
    background: '#2A1C0E',
    border: '1px solid #3D2A18',
    borderRadius: '8px',
    height: '44px',
    minHeight: '44px',
    boxShadow: 'none',
    '&:hover': { borderColor: '#C8521A' },
  }),
  valueContainer: (base) => ({ ...base, padding: '0 16px' }),
  placeholder: (base) => ({ ...base, color: '#7A5C40', fontSize: '14px', margin: 0 }),
  singleValue: (base) => ({ ...base, color: '#FAF7F2', fontSize: '14px', margin: 0 }),
  input: (base) => ({ ...base, color: '#FAF7F2', margin: 0, padding: 0 }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#7A5C40',
    '&:hover': { color: '#C8521A' },
    paddingRight: '12px',
  }),
  menu: (base) => ({
    ...base,
    background: '#2A1C0E',
    border: '1px solid #3D2A18',
    borderRadius: '8px',
    marginTop: '4px',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? '#3D2A18' : 'transparent',
    color: state.isFocused ? '#FAF7F2' : '#A08060',
    fontSize: '14px',
    cursor: 'pointer',
  }),
};
 
const StarRating = ({ rating }) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('★');
    else if (i === full && half) stars.push('½');
    else stars.push('☆');
  }
  return <span className="rr-stars-display">{stars.join('')}</span>;
};
 
const App = () => {
  const [location, setLocation] = useState('');
  const [responseFromAi, setResponseFromAi] = useState([]);
  const [cuisine, setCuisine] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [locationInput, setLocationInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [activePriceTiers, setActivePriceTiers] = useState([]);
  const [sortOrder, setSortOrder] = useState('none');
 
  const options = {
    method: 'POST',
    url: 'https://chatgpt-42.p.rapidapi.com/chat',
    headers: {
      'x-rapidapi-key': 'ea6fbcd991mshc004837dec20aeap1f20b5jsne9912198989f',
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
            "rating": 4.6,
            "linkToSite": "https://culleretes.com/"
            }
          ]
          Now return a list of 10 ${cuisine?.value} restaurants for this location: ${location}`
        }
      ],
      model: 'gpt-4o-mini'
    }
  };
 
  
  const callToApi = async () => {
    setIsLoading(true);
    setTimeout(() => {
      document.querySelector('.rr-loading')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    try {
      const response = await axios.request(options);
      const parsed = JSON.parse(response.data.choices[0].message.content);
      setResponseFromAi(parsed);
      setTimeout(() => {
        document.querySelector('.rr-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleClick = (url) => {
    window.open(url, '_blank');
  };
 
  const handleHomeClick = () => {
    setResponseFromAi([]);
    setLocation('');
    setCuisine(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            'your location';
          setLocationInput(city);
          setLocation(city);
        } catch {
          setLocationInput('Could not detect location');
        } finally {
          setIsLocating(false);
        }
      },
      () => { setIsLocating(false); }
    );
  };
  
  const togglePriceTier = (label) => {
    setActivePriceTiers((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };
  
  const displayedResults = useMemo(() => {
    let results = [...responseFromAi];
    if (activePriceTiers.length > 0) {
      results = results.filter((r) => {
        const max = parseMaxPrice(r.averagePerPerson);
        return activePriceTiers.some((tierLabel) => {
          const tier = PRICE_TIERS.find((t) => t.label === tierLabel);
          if (!tier) return false;
          const prevMax = PRICE_TIERS[PRICE_TIERS.indexOf(tier) - 1]?.max ?? 0;
          return max > prevMax && max <= tier.max;
        });
      });
    }
    if (sortOrder === 'high') {
      results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortOrder === 'low') {
      results.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
    }
    return results;
  }, [responseFromAi, activePriceTiers, sortOrder]);
 
  return (
    <div className="rr-root">
 
      {/* Top nav */}
      <nav className="rr-nav">
        {/* <div className="rr-nav-logo">
          <img src={rrImage} alt="Restaurant Rover logo" />
        </div> */}
        <button className="rr-nav-title" onClick={handleHomeClick}>
          Restaurant Rover
        </button>
        <span className="rr-nav-sub">Find your table anywhere</span>
      </nav>
 
      {/* Hero + search */}
      <div className="rr-hero">
        <div className="rr-hero-left">
          <div className="rr-hero-eyebrow">Curated dining discovery</div>
          <h1 className="rr-hero-headline">
            Find your next<br /><span>perfect meal</span>
          </h1>
          <p className="rr-hero-desc">
            Enter a city, pick a cuisine — we'll surface 10 handpicked restaurants worth your time.
          </p>
          <div className="rr-search-bar">
          <div className="rr-location-wrap">
              <input
                className="rr-location-input"
                type="text"
                placeholder="📍  City or neighborhood"
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setLocation(e.target.value);
                }}
              />
              <button
                className="rr-locate-btn"
                onClick={handleUseMyLocation}
                title="Use my current location"
                disabled={isLocating}
              >
                {isLocating ? '⏳' : <span style={{ display: 'inline-block', transform: 'rotate(-45deg)', fontSize: '16px' }}>➤</span>}
              </button>
            </div>
            <Select
              value={cuisine}
              onChange={setCuisine}
              options={cuisineOptionsList}
              styles={selectStyles}
              placeholder="🍽  Desired cuisine"
              className="rr-cuisine-select"
              menuPlacement="auto"
              menuPosition="fixed"
            />
            <button className="rr-search-btn" onClick={callToApi}>
              🔍 Search
            </button>
          </div>
        </div>
        <div className="rr-hero-right">
          <img src={rrMainImage} alt="Dining experience" className="rr-hero-main-img" />
        </div>
      </div>
 
      {/* Loading */}
      {isLoading && (
        <div className="rr-loading">
          <div className="rr-loading-spinner" />
          <p>Scouting restaurants, please wait…</p>
        </div>
      )}
 
      {/* Results */}
      {responseFromAi.length > 0 && (
        <div className="rr-results">
          <div className="rr-section-label">
            <span className="results-bold">Results</span> — {location} · {cuisine?.label}
          </div>
          {/* Filter */}
                  <div className="rr-filter-bar">
          <div className="rr-filter-group">
            <span className="rr-filter-label">Price</span>
            <div className="rr-price-toggles">
              {PRICE_TIERS.map((tier) => (
                <button
                  key={tier.label}
                  className={`rr-price-btn ${activePriceTiers.includes(tier.label) ? 'active' : ''}`}
                  onClick={() => togglePriceTier(tier.label)}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rr-filter-group">
            <span className="rr-filter-label">Sort by rating</span>
            <div className="rr-sort-toggles">
              <button
                className={`rr-sort-btn ${sortOrder === 'high' ? 'active' : ''}`}
                onClick={() => setSortOrder(sortOrder === 'high' ? 'none' : 'high')}
              >
                High → Low
              </button>
              <button
                className={`rr-sort-btn ${sortOrder === 'low' ? 'active' : ''}`}
                onClick={() => setSortOrder(sortOrder === 'low' ? 'none' : 'low')}
              >
                Low → High
              </button>
            </div>
          </div>
          {(activePriceTiers.length > 0 || sortOrder !== 'none') && (
            <button
              className="rr-clear-btn"
              onClick={() => { setActivePriceTiers([]); setSortOrder('none'); }}
            >
              Clear filters
            </button>
          )}
        </div>
        {displayedResults.length === 0 ? (
            <div className="rr-no-results">
              No restaurants match your filters. Try adjusting the price range.
            </div>
          ) : (
          <div className="rr-grid">
            {displayedResults.map((ele, index) => (
              <div
                key={index}
                className="rr-card"
                onClick={() => handleClick(ele.linkToSite)}
              >
                <div className="rr-card-num">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="rr-card-name">{ele.name}</div>
                <div className="rr-card-cuisine">
                  {ele.cuisine} · {ele.atmosphere}
                </div>
                <div className="rr-card-rating">
                  <StarRating rating={parseFloat(ele.rating)} />
                  <span className="rr-rating-text">
                    {ele.rating} · Customer score {ele.customerScore}
                  </span>
                </div>
                <div className="rr-card-divider" />
                <div className="rr-card-row">
                  <span className="rr-label">Top menu item</span>
                  <span className="rr-value">{ele.topMenuItem}</span>
                </div>
                <div className="rr-card-row">
                  <span className="rr-label">Favorites</span>
                  <span className="rr-value">{ele.usersFavorites}</span>
                </div>
                <div className="rr-card-row">
                  <span className="rr-label">Avg per person</span>
                  <span className="rr-value">{ele.averagePerPerson}</span>
                </div>
                <div className="rr-card-row">
                  <span className="rr-label">Dress code</span>
                  <span className="rr-value">{ele.dressCode}</span>
                </div>
                <div className="rr-card-address">
                  📍 {ele.address}
                </div>
                <div className="rr-card-link">
                  Visit website →
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}
 
      {/* Footer */}
      <footer className="rr-footer">
        <span className="rr-footer-copy">© 2025 Restaurant Rover · All rights reserved</span>
        <span className="rr-footer-name">Gabrielle Roose · Carrer de Paris, Barcelona</span>
      </footer>
 
    </div>
  );
};
 
export default App;