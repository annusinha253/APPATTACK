import React, { useState, useEffect } from "react";
import MealCard from "./MealCard";
import RecipeModal from "./RecipeModal";
import recipesData from "../data/recipes.json";
import translations from "../translations";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const MainPage = ({ language = "en" }) => {
  const t = translations[language] || translations.en;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]); // local recipes
  const [filteredData, setFilteredData] = useState([]); // all results
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    setData(recipesData.recipes);
    setFilteredData(recipesData.recipes);
  }, []);

  const handleSearch = async () => {
    setMsg("");
    setLoading(true);
    let results = [];
    const searchLower = search.trim().toLowerCase();
    if (searchLower) {
      results = data.filter(recipe =>
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.category.toLowerCase().includes(searchLower) ||
        (Array.isArray(recipe.ingredients) && recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower)))
      ).map(r => ({ ...r, _source: "local" }));
    } else {
      results = data.map(r => ({ ...r, _source: "local" }));
    }
    if (results.length === 0 && searchLower) {
      try {
        const mealdbRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchLower)}`);
        const mealdbData = await mealdbRes.json();
        if (mealdbData.meals) {
          const mealdbRecipes = mealdbData.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory || "other",
            cookingTime: "30 min",
            difficulty: "Medium",
            image: meal.strMealThumb,
            ingredients: Object.keys(meal)
              .filter(key => key.startsWith('strIngredient') && meal[key])
              .map(key => meal[key]),
            instructions: meal.strInstructions ? meal.strInstructions.split('. ').filter(step => step.trim()) : [],
            nutrition: {
              calories: 300,
              protein: "15g",
              carbs: "25g",
              fat: "12g"
            },
            isFavorite: favorites.includes(meal.idMeal),
            _source: "mealdb"
          }));
          results = mealdbRecipes;
        }
      } catch (e) {
        setMsg(t.error + ": TheMealDB API");
      }
    }
    if (results.length === 0 && searchLower && OPENAI_API_KEY) {
      try {
        const prompt = `Give me a detailed recipe for '${search}'. Include ingredients, instructions, and a short description. Format as JSON with keys: name, category, ingredients (array), instructions (array), description.`;
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful recipe generator." },
              { role: "user", content: prompt }
            ],
            max_tokens: 600,
            temperature: 0.7
          })
        });
        const openaiData = await openaiRes.json();
        let recipeJson = null;
        try {
          const match = openaiData.choices?.[0]?.message?.content.match(/\{[\s\S]*\}/);
          recipeJson = match ? JSON.parse(match[0]) : null;
        } catch (e) {}
        if (recipeJson) {
          results = [{
            id: `ai-${Date.now()}`,
            name: recipeJson.name || search,
            category: recipeJson.category || "other",
            cookingTime: "30 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
            ingredients: recipeJson.ingredients || [],
            instructions: recipeJson.instructions || [],
            nutrition: {
              calories: 300,
              protein: "15g",
              carbs: "25g",
              fat: "12g"
            },
            isFavorite: false,
            _source: "openai",
            description: recipeJson.description || "AI generated recipe."
          }];
        } else {
          setMsg(t.noResults);
        }
      } catch (e) {
        setMsg(t.error + ": OpenAI");
      }
    }
    let finalResults = results;
    if (selectedCategory === "favorites") {
      finalResults = results.filter(recipe => favorites.includes(recipe.id));
    } else if (selectedCategory !== "all") {
      finalResults = results.filter(recipe => recipe.category === selectedCategory);
    }
    setFilteredData(finalResults);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, [search, selectedCategory, data, favorites, language]);

  const handleInput = (e) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setMsg("");
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleFavoriteToggle = (recipeId) => {
    const newFavorites = favorites.includes(recipeId)
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setData(prevData => 
      prevData.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  const categories = [
    { id: "all", name: t.allRecipes },
    { id: "veg", name: t.vegetarian },
    { id: "non-veg", name: t.nonVeg },
    { id: "quick", name: t.quick }
  ];

  return (
    <>
      <div className="app-header">
        <h1 className="head">🍽️ {t.appTitle}</h1>
        {/* Search Bar */}
        <div className="searchBar">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={handleInput}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className="btn" disabled={loading}>
            {loading ? t.searching : t.search}
          </button>
        </div>
        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {/* Favorites Toggle */}
        <div className="favorites-section">
          <button 
            className={`favorites-btn ${selectedCategory === "favorites" ? "active" : ""}`}
            onClick={() => handleCategoryChange("favorites")}
          >
            ❤️ {t.favoritesCount.replace("{count}", favorites.length)}
          </button>
        </div>
        {/* Error Message */}
        {msg && <h3 className="error">{msg}</h3>}
        {/* Results Count */}
        {filteredData.length > 0 && (
          <p className="results-count">
            {t.found.replace("{count}", filteredData.length).replace("{plural}", filteredData.length !== 1 ? 's' : '')}
          </p>
        )}
      </div>
      {/* Recipe Cards */}
      <div className="container">
        <MealCard 
          detail={filteredData}
          onRecipeClick={handleRecipeClick}
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
          language={language}
        />
      </div>
      {/* Recipe Modal */}
      {showModal && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setShowModal(false)}
          onFavoriteToggle={() => handleFavoriteToggle(selectedRecipe.id)}
          isFavorite={favorites.includes(selectedRecipe.id)}
          language={language}
        />
      )}
    </>
  );
};

export default MainPage;
