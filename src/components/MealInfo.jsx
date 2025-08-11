import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react';

const MealInfo = () => {
  const {mealid} = useParams();
  const[info,setInfo] = useState()
  console.log(mealid);

  const getInfo = async () => {
    const get= await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealid}`);
    const jsonData = await get.json();
    console.log(jsonData.meals[0]);
    setInfo(jsonData.meals[0]);
  }
  if(!info !=" "){
    getInfo();
  }

  console.timeLog(mealid);
  return (

   <div>
     {
      !info ? "Data not found" : <div className='mealInfo'>
      <img src={info.strMealThumb} />
      <div className='info'>
        <h1>Recipe Details</h1>
        <button>{info.strMeal}</button>
        <h3>Instructions</h3>
        <p>{info.strInstructions}</p>
      </div>
    </div>
    }
   </div>

  )
}

export default MealInfo