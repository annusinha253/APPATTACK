import React, { useState, useEffect } from "react";
import MealCard from "./MealCard";

const PRESET_FOODS = [
  { name: "Paneer Butter Masala", type: "veg" },
  { name: "Chole Bhature", type: "veg" },
  { name: "Dal Makhani", type: "veg" },
  { name: "Veg Pulao", type: "veg" },
  { name: "Chicken Biryani", type: "nonveg" },
  { name: "Egg Curry", type: "nonveg" },
  { name: "Fish Fry", type: "nonveg" },
  { name: "Mutton Rogan Josh", type: "nonveg" },
  { name: "Aloo Paratha", type: "veg" },
  { name: "Butter Chicken", type: "nonveg" },
];

const MainPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [toggleOn, setToggleOn] = useState(false); // ON/OFF state for filter
  const [vegMenu, setVegMenu] = useState(""); // '', 'veg', 'nonveg'
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // dark/light mode

  useEffect(() => {
    if (!toggleOn) {
      fetchRandomRecipe("all");
    } else if (vegMenu === "veg" || vegMenu === "nonveg") {
      fetchRandomRecipe(vegMenu);
    }
    // eslint-disable-next-line
  }, [toggleOn, vegMenu]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const fetchRandomRecipe = async (type) => {
    setLoadingSuggestion(true);
    let url = "https://www.themealdb.com/api/json/v1/1/random.php";
    let tries = 0;
    let found = false;
    let recipe = null;
    while (!found && tries < 10) {
      const res = await fetch(url);
      const json = await res.json();
      if (json.meals && json.meals.length > 0) {
        recipe = json.meals[0];
        if (type === "all") {
          found = true;
        } else if (type === "veg") {
          const nonVegKeywords = [
            "beef", "pork", "chicken", "lamb", "fish", "seafood", "mutton", "duck", "turkey", "bacon", "ham", "anchovy", "salmon", "shrimp", "crab", "clam", "octopus", "squid", "meat"
          ];
          const ingredients = Object.keys(recipe)
            .filter((k) => k.startsWith("strIngredient") && recipe[k])
            .map((k) => recipe[k].toLowerCase());
          if (!ingredients.some(ing => nonVegKeywords.some(nv => ing.includes(nv)))) {
            found = true;
          }
        } else if (type === "nonveg") {
          const nonVegKeywords = [
            "beef", "pork", "chicken", "lamb", "fish", "seafood", "mutton", "duck", "turkey", "bacon", "ham", "anchovy", "salmon", "shrimp", "crab", "clam", "octopus", "squid", "meat"
          ];
          const ingredients = Object.keys(recipe)
            .filter((k) => k.startsWith("strIngredient") && recipe[k])
            .map((k) => recipe[k].toLowerCase());
          if (ingredients.some(ing => nonVegKeywords.some(nv => ing.includes(nv)))) {
            found = true;
          }
        }
      }
      tries++;
    }
    setRandomRecipe(recipe);
    setLoadingSuggestion(false);
  };

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const myFun = async () => {
    if (search == " ") {
      setMsg("Please enter a dish name");
    } else {
      const get = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}        `
      );
      const jsonData = await get.json();
      setData(jsonData.meals);
    }
  };

  const handleToggle = () => {
    setToggleOn((prev) => {
      if (prev) setVegMenu("");
      return !prev;
    });
  };

  const handleMenuSelect = (type) => {
    setVegMenu(type);
  };

  const handleDarkToggle = () => {
    setDarkMode((prev) => !prev);
  };

  // Filter preset foods based on toggle/vegMenu
  let filteredFoods = PRESET_FOODS;
  if (toggleOn && vegMenu) {
    filteredFoods = PRESET_FOODS.filter(f => f.type === vegMenu);
  }

  return (
    <>
      <h1 className="head">BHUKKAR</h1>
      <div className="container" style={{position: 'relative'}}>
        <div className="toggle-corner toggle-corner-left">
          <div className={`switch-toggle small ${darkMode ? 'on' : 'off'}`} onClick={handleDarkToggle}>
            <span className="toggle-emoji sun">🌞</span>
            <span className="switch-knob-small"></span>
            <span className="toggle-emoji moon">🌙</span>
          </div>
        </div>
        <div className="toggle-corner">
          <div className={`switch-toggle small ${toggleOn ? 'on' : 'off'}`} onClick={handleToggle}>
            <span className="switch-knob-small"></span>
          </div>
          {toggleOn && (
            <div className="veg-menu-popup">
              <button className={`veg-menu-btn ${vegMenu === 'veg' ? 'selected' : ''}`} onClick={() => handleMenuSelect('veg')}>
                <span className="dot green-dot"></span> Veg
              </button>
              <button className={`veg-menu-btn ${vegMenu === 'nonveg' ? 'selected' : ''}`} onClick={() => handleMenuSelect('nonveg')}>
                <span className="dot red-dot"></span> Non-Veg
              </button>
            </div>
          )}
        </div>
        <div className="searchBar">
          <input
            type="text"
            placeholder="Enter Dishes..."
            onChange={handleInput}
          />
          <button onClick={myFun} className="btn">
            {" "}
            Search{" "}
          </button>
        </div>
        {/* Pre-search food section */}
        <div className="presearch-food-section">
          {filteredFoods.map((food, idx) => (
            <div className="presearch-food-card" key={idx}>
              <span className={`dot ${food.type === 'veg' ? 'green-dot' : 'red-dot'}`}></span>
              <span className="presearch-food-name">{food.name}</span>
            </div>
          ))}
        </div>
        <p className="logo-text">If you're a BHUKKAR just COOKKAR</p>
        {msg && <h3 className="error">{msg}</h3>}
        <div>
          <MealCard detail={data}></MealCard>
        </div>
      </div>
      {showPopup && randomRecipe && (
        <div className="popup-suggestion">
          <span>
            You can try this recipe: <b>{randomRecipe.strMeal}</b>
          </span>
          <button className="close-popup" onClick={() => setShowPopup(false)}>&times;</button>
        </div>
      )}
    </>
  );
};
export default MainPage;
