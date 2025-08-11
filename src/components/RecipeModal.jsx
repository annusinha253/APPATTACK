import React from "react";

const RecipeModal = ({ recipe, onClose, onFavoriteToggle, isFavorite }) => {
  if (!recipe) return null;

  const handleFavoriteClick = () => {
    onFavoriteToggle();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{recipe.name}</h2>
          <div className="modal-actions">
            <button 
              className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="recipe-image">
            <img src={recipe.image} alt={recipe.name} />
          </div>

          <div className="recipe-details">
            <div className="recipe-meta">
              <span className="category-badge category-{recipe.category}">
                {recipe.category === 'veg' ? '🥬 Vegetarian' : 
                 recipe.category === 'non-veg' ? '🍗 Non-Vegetarian' : 
                 recipe.category === 'quick' ? '⚡ Quick Recipe' : recipe.category}
              </span>
              <span className="cooking-time">⏱️ {recipe.cookingTime}</span>
              <span className="difficulty">📊 {recipe.difficulty}</span>
            </div>

            {recipe.nutrition && (
              <div className="nutrition-section">
                <h3>Nutrition Information</h3>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-label">🔥 Calories</span>
                    <span className="nutrition-value">{recipe.nutrition.calories}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">💪 Protein</span>
                    <span className="nutrition-value">{recipe.nutrition.protein}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">🍞 Carbs</span>
                    <span className="nutrition-value">{recipe.nutrition.carbs}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">🥑 Fat</span>
                    <span className="nutrition-value">{recipe.nutrition.fat}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="ingredients-section">
              <h3>📋 Ingredients</h3>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h3>👨‍🍳 Instructions</h3>
              <ol className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal; 