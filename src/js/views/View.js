 
import icons from 'url:../../img/icons.svg';
export default class View{
  _data ; 
  /**
   * 
   * @param {Object | Object[]} data The data to be rendered(e)
   * @param {boolean} [render=true]  if false , create markup string of rendering to the dom
   * @returns 
   */
  render(data , render = true){
    if(!data || ( Array.isArray(data) && data.length === 0 ) )
        return this.renderError();

    this._data = data ;
    let markup = this._generateMarkup();


    if(!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin" , markup);
  }

  update(data){
    if(!data || ( Array.isArray(data) && data.length === 0 ) )
    return this.renderError();

    this._data = data ;
    let newMarkup = this._generateMarkup();
    
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElemnts =Array.from(newDOM.querySelectorAll("*")) ;
    const curElements =Array.from(this._parentElement.querySelectorAll('*')) ;
     // console.log(newElemnts);
      // console.log(curElements);
    newElemnts.forEach((newEl , i)=>{
      const curEl = curElements[i];
      //console.log(curEl , newEl.isEqualNode(curEl));

      // update Changed Text 
      if(!newEl.isEqualNode(curEl) &&
       newEl.firstChild?.nodeValue.trim() !== ''){
        curEl.textContent= newEl.textContent;
      }

      // update changed Attributes 
      if(!newEl.isEqualNode(curEl)){
        Array.from(newEl.attributes).forEach(attr => 
          curEl.setAttribute(attr.name , attr.value));
      }
    });
  }

  _clear(){
    this._parentElement.innerHTML = '';
  }

  renderSpinner(){
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin',markup);
  }

  renderError(message = this._errorMassage){
    // console.log(this._errorMassage)
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="src/img/icons.svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin',markup);
  }

  renderMessage(message = this._message){
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin',markup);
  }

}