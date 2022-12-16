import {async} from 'regenerator-runtime';
import { API_URL , RES_PER_PAGE , KEY } from './config'; 
import {AJAX} from './views/helper'


export const state  = {
  recipe:{},
  search:{
    query:'', 
    results:[],
    page : 1 , 
    resultsRerPage : RES_PER_PAGE  , 
  },
  bookmarks: [],
}
const createRecipeObject  =function (data){
  const {recipe} = data.data;
  return {
    id: recipe.id,  
    title  : recipe.title , 
    publisher : recipe.publisher,
    sourceUrl : recipe.source_url , 
    image: recipe.image_url , 
    servings : recipe.servings,
    cookingTime : recipe.cooking_time , 
    ingredients : recipe.ingredients,
    ...(recipe.key && {key : recipe.key}), 
  };
   
}
export const loadRecipe = async function(id){
  try{
    const data = await AJAX(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);

    if(state.bookmarks.some(bookmark => bookmark.id === id)){
      state.recipe.bookmarked =true; 
    }else {
      state.recipe.bookmarked = false; 
    }
    console.log(state.recipe);
  }catch(err){
    throw err; 
  }
};


export const loadSearchResults = async function(query){
  try{
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results =data.data.recipes.map(rec =>{
      return {
        id: rec.id,  
        title  : rec.title , 
        publisher : rec.publisher,
        image: rec.image_url , 
        ...(rec.key && { key : rec.key})
      }
     });
     console.log(state.search.results);
     state.search.page=1;
  }catch(err){
    console.log(err);
    throw err ;
  }
};

export const getSearchResultsPage = function(page = state.search.page){
  state.search.page=page;
  const start = (page - 1) * state.search.resultsRerPage ;
  const end = page * state.search.resultsRerPage; 
  console.log(start , end);
  return state.search.results.slice(start,end);
}
 
export const updateSerings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
      ing.quantity  = (ing.quantity *  newServings ) / state.recipe.servings;
      // new quantity = old quantity * newServings / oldServings  // 
    }); 

   state.recipe.servings  = newServings; 
}

const persistBookmarks  = function (){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
  // Add bookMark 
  state.bookmarks.push(recipe);
  // Mark current recipe as bookMark 
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true; 
  
  persistBookmarks();
}

export const deleteBookmark = function(id){
  const index  = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index ,1);
  if(id === state.recipe.id) state.recipe.bookmarked = false; 

  persistBookmarks();
}

const init = function(){
  const storge = localStorage.getItem('bookmarks');
  if(storge) state.bookmarks = JSON.parse(storge);
}


init();


const clearBookmarks = function() {
  localStorage.clear('bookmarks');
}

export const uploadRecipe = async function(newRecipe){
 try{

 
  console.log(Object.entries(newRecipe));
  const ingredients = Object.entries(newRecipe)
  .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
  .map(ing => {
    const ingArr  = ing[1].replaceAll('' , '').split(',');
    if(ingArr.length !== 3) throw new Error('Wrong ingredient fromat ! Please use the Correc Format ;)')
    const [quantity , unit , description] = ing[1].replaceAll(" ","").split(',');
    return {quantity :quantity  ? +quantity : null , unit , description};
  });
  const recipe = {
    title : newRecipe.title , 
    sourceUrl:newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher:newRecipe.publisher,
    cooking_time : +newRecipe.cookingTime,
    servings:+newRecipe.servings,
    ingredients,
  }
  console.log('recipe ==>' ,recipe);

  const data = await AJAX(`${API_URL}?key=${KEY}`,recipe);
  console.log(data);
  state.recipe = createRecipeObject(data);
   addBookmark(state.recipe)
  }catch(err){
    throw err;   
  }

}
 