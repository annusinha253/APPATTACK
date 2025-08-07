
import './App.css';
import MainPage from "./components/MainPage";
import {Route, Routes} from "react-router-dom";
import MealInfo from './components/MealInfo';

function App() {
  return(
    
    //<MainPage/>
   
    <Routes>
      <Route path='/' element={<MainPage/>}/>
      <Route path='/:mealid' element={<MealInfo/>}/>
    </Routes>
    
    
  )
}

export default App;
