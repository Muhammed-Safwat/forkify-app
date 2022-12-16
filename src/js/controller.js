import * as model from './model.js';
import recipeView  from './views/recipeView.js';
import searchVeiw from './views/searchVeiw.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import icons from 'url:../img/icons.svg';
import  'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';

///////////////////////////////////////

if(module.hot){
  module.hot.accept();
}

const controlRecipe = async function(){
  try{
    const id = window.location.hash.slice(1);
    if(!id) return ;
  
    recipeView.renderSpinner() ;
    // 0 update results 
    resultsView.update(model.getSearchResultsPage());
        //3)  updateing book markes view
        bookmarksView.update(model.state.bookmarks);
    //1) loding resip e
    await model.loadRecipe(id);

    // 2) Rendering recipe 
    recipeView.render(model.state.recipe); 


       
  }catch(err){
      recipeView.renderError();
  }
}

const controlSearchResults = async function(){

  resultsView.renderSpinner();
  // 1 get search query
  const query = searchVeiw.getQuery();
  //console.log(query);
  if(!query) return ; 
  try{
    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results 
     
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination button 
    paginationView.render(model.state.search);
  }catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
  //console.log(goToPage);
}

const controlServings = function(numServings){
  // update the recipe servings (in state) 
  model.updateSerings(numServings);
  // update the view 
 // recipeView.render(model.state.recipe); 
 recipeView.update(model.state.recipe); 
}

const controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else 
    model.deleteBookmark(model.state.recipe.id);
  
  // update 
    recipeView.update(model.state.recipe);
  // render bookmarks 
   bookmarksView.render(model.state.bookmarks);
  }


const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    // render recipe 
    addRecipeView.renderMessage();

    // Render Bookmark view 
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL 
    window.history.pushState(null , '' , `#${model.state.recipe.id}`);


    // close from window 
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, 2500);
  }catch(err){
    console.log(err);
    addRecipeView.renderError(err.message);
  }
 // console.log(newRecipe);
  
}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings); 
  recipeView.addHandlerAddBookmark(controlAddBookmark); 
  searchVeiw.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpLoad(controlAddRecipe);
}

init();
   
 