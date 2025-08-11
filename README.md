# 🍽️ Food Recipe App

A modern, feature-rich recipe browsing and search application built with React and Vite.

## ✨ Features

### Required Features ✅
1. **Static Recipe Data** - Local JSON file with 8 curated recipes
2. **Recipe Details Modal** - Click any recipe to view detailed information
3. **Category Filtering** - Filter by Vegetarian, Non-Vegetarian, and Quick recipes

### Optional Features ✅
1. **TheMealDB API Integration** - Toggle between local data and external API
2. **Favorite Recipes** - Save and manage your favorite recipes with localStorage persistence

### Additional Features 🎉
- **Modern UI/UX** - Beautiful gradient design with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Search Functionality** - Search recipes by name
- **Nutrition Information** - Detailed nutritional facts for each recipe
- **Cooking Instructions** - Step-by-step cooking instructions
- **Ingredient Lists** - Complete ingredient lists with measurements
- **Real-time Filtering** - Instant search and category filtering
- **Loading States** - Smooth loading indicators during API calls

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

## 📱 How to Use

### Browsing Recipes
- **Local Recipes**: Browse 8 curated recipes with detailed information
- **TheMealDB API**: Search thousands of recipes from the external API
- **Category Filters**: Filter by Vegetarian, Non-Vegetarian, or Quick recipes
- **Favorites**: View only your saved favorite recipes

### Recipe Details
- Click any recipe card to open a detailed modal
- View ingredients, instructions, nutrition facts, and cooking time
- Add/remove recipes from favorites directly from the modal

### Search & Filter
- Use the search bar to find specific recipes
- Combine search with category filters
- Real-time results as you type

## 🛠️ Technical Details

### Data Sources
- **Local Data**: `src/data/recipes.json` - 8 hand-curated recipes
- **External API**: TheMealDB API for extensive recipe database

### State Management
- React hooks for local state management
- localStorage for persistent favorites
- Real-time filtering and search

### Styling
- Modern CSS with gradients and animations
- Responsive grid layout
- Smooth transitions and hover effects

## 📁 Project Structure

```
src/
├── components/
│   ├── MainPage.jsx      # Main application component
│   ├── MealCard.jsx      # Recipe card component
│   └── RecipeModal.jsx   # Recipe details modal
├── data/
│   └── recipes.json      # Local recipe data
├── App.jsx               # Root component
└── index.css            # Global styles
```

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful purple gradient theme
- **Card-based Layout** - Clean recipe cards with hover effects
- **Modal Overlays** - Elegant recipe detail modals
- **Responsive Grid** - Adaptive layout for all screen sizes
- **Smooth Animations** - Hover effects and transitions
- **Color-coded Categories** - Visual category indicators

## 🔧 Customization

### Adding New Recipes
Edit `src/data/recipes.json` to add more local recipes:

```json
{
  "id": 9,
  "name": "Your Recipe Name",
  "category": "veg|non-veg|quick",
  "cookingTime": "30 min",
  "difficulty": "Easy|Medium|Hard",
  "image": "image-url",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "nutrition": {
    "calories": 300,
    "protein": "15g",
    "carbs": "25g",
    "fat": "12g"
  }
}
```

### Styling
Modify `src/index.css` to customize colors, layouts, and animations.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

---

**Built with ❤️ using React + Vite**
