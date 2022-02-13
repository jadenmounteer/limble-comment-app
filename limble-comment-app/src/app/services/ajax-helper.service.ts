import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AjaxHelperService {

  constructor() { }
  
  /**
   * Fetch helper function for fetching a json response from a file or url
   * @param {*} url 
   * @returns a json response
   */
  fetchJSON(url: RequestInfo) {
    return fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText); 
        } else {
          return response.json();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
}
