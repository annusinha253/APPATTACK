import React from "react";

const MealCard = ({ detail, onRecipeClick, onFavoriteToggle, favorites }) => {
  if (!detail || detail.length === 0) {
    return (
      <div className="no-results">
        <p>No recipes found. Try searching for something else!</p>
      </div>
    );
  }

  const handleFavoriteClick = (e, recipeId) => {
    e.stopPropagation(); // Prevent triggering the recipe click
    onFavoriteToggle(recipeId);
  };

  return ( 
    <div className="meals">
      {detail.map((curItem) => {
        const isFav = favorites.includes(curItem.id);
        return (
          <div 
            className="mealImg" 
            key={curItem.id}
            onClick={() => onRecipeClick(curItem)}
          >
            <div className="meal-image-container">
              <img src={curItem.image} alt={curItem.name} />
              <button 
                className={`favorite-btn ${isFav ? 'favorited' : ''}`}
                onClick={(e) => handleFavoriteClick(e, curItem.id)}
              >
                {isFav ? '❤️' : '🤍'}
              </button>
            </div>
            <div className="meal-info">
              <h3 className="meal-name">{curItem.name}</h3>
              <div className="meal-meta">
                <span className="category-badge category-{curItem.category}">
                  {curItem.category === 'veg' ? '🥬 Veg' : 
                   curItem.category === 'non-veg' ? '🍗 Non-Veg' : 
                   curItem.category === 'quick' ? '⚡ Quick' : curItem.category}
                </span>
                <span className="cooking-time">⏱️ {curItem.cookingTime}</span>
                <span className="difficulty">📊 {curItem.difficulty}</span>
              </div>
              {curItem.nutrition && (
                <div className="nutrition-info">
                  <span>🔥 {curItem.nutrition.calories} cal</span>
                  <span>💪 {curItem.nutrition.protein}</span>
                </div>
              )}
            </div>
            <button className="view-recipe-btn">
              View Recipe
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MealCard;
