import { Injectable } from '@angular/core';
import { Comment } from '../app-interfaces/comments.interface';
import { User } from '../app-interfaces/user.interface';
import { AjaxHelperService } from './ajax-helper.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  ajaxHelperService: AjaxHelperService;

  comments: Array<Comment> = [
    {
      "comment": "This task was assigned to Morning Team",
      "userName": "Wanda Maximoff",
      "createdDate": "2022/02/03 12:15 AM"
    },
    {
      "comment": "This Task's Status was changed from Open to In Progress",
      "userName": "Wanda Maximoff",
      "createdDate": "2022/02/03 12:15 AM"
    }
  ];

  users: Array<User> = [
    {'userID' : 1, 'name' : 'Kevin'},
    {'userID' : 2, 'name' : 'Jeff'},
    {'userID' : 3, 'name' : 'Bryan'},
    {'userID' : 4, 'name' : 'Gabbey'}
  ];

  constructor(ajaxHelperService: AjaxHelperService) { 
    // Create a new instance of the ajaxHelperService so we can work with JSON
    this.ajaxHelperService = ajaxHelperService;
  }

  getAllComments(): Array<Comment> {
    // TODO: return a clone of this object.. this object cannot be changed from other places
    return this.comments;
  }

  /**
   * Called when the user selects the Submit button.
   * @param textAreaValue
   */
  addComment(textAreaValue: string): void {
    // Create a new comment and add the comment along with the username
    let newComment = {
      "comment": textAreaValue,
      "userName": "The Vision",
      "createdDate": this.generateTimestamp()
    }

    // Add the new comment to the list of new comments
    this.comments.push(newComment);    
  }

  /**
   * Generates a timestamp using the current date and time.
   * @returns a timestamp in the 2022/02/03 12:15 AM format.
   */  
  generateTimestamp(): string{
    // Create a date object
    let dateObject = new Date();

    // Get the year, convert it to a string
    let year = dateObject.getFullYear().toString();

    // Get the month, add one and convert it to a string
    let month = (dateObject.getMonth() + 1).toString();

    // If the month has only 1 digit, add a zero before the digit
    let convertedMonth;
    if (month.length == 1) {
      convertedMonth = "0".concat(month);
    }
    else {
      // If the month has two digits, we don't do anything with it
      convertedMonth = month;
    }

    // Get the day, convert it to a string
    let day = dateObject.getDate().toString();

    // If the day has only one digit, add a zero
    let convertedDay;
    if (day.length == 1) {
      convertedDay = "0".concat(day);
    }
    else {
      // If the month has two digits, we don't do anything with it
      convertedDay = day;
    }

    // Get the hour
    // we don't convert this to a string yet so we can do some arithmatic
    let hour = dateObject.getHours(); 

    // Convert the hour to standard time and set if it is am or pm
    let amOrpm = "AM";
    if (hour > 12) {
      hour -= 12;
      amOrpm = "PM";
    }

    // Convert the hour to a string
    let hourAsString = hour.toString();

    // If the hour has only one digit, add a zero
    let convertedHour;
    if (hourAsString.length == 1) {
      convertedHour = "0".concat(hourAsString);
    }
    else {
      // If the hour has two digits, we don't do anything with it
      convertedHour = hourAsString;
    }

    // Get the minutes. Convert it to a string
    let minutes = dateObject.getMinutes().toString();

    // If the minutes has only one digit, add a zero
    let convertedMinutes;
    if (minutes.length == 1) {
      convertedMinutes = "0".concat(minutes);
    }
    else {
      // If the minutes has two digits, we don't do anything with it
      convertedMinutes = minutes;
    }

    // Return the timestamp
    return `${year}/${convertedMonth}/${convertedDay} ${convertedHour}:${convertedMinutes} ${amOrpm}`;
  }

  /**
   * Gets and returns a list of users from the JSON database
   * TODO: This will acutally return something like: Array<any> or Array<user>. Might want to make a user interface.
   */
  getUsers(): Array<User>{
    return this.users;


    //TODO: maybe get this from the json

    /*
    // User the ajaxHelperService to fetch the data from the json database
    const getlistOfUsers = this.ajaxHelperService.fetchJSON("/users.json");
    console.log("Processing...");
    
    // Once the promise is finished...
    getlistOfUsers.then(
      // If it was successful...
      function(value){
        console.log("Promise complete");
        console.log(value);
      },
      function(error){console.log(`Error! ${error}`);}
    )
    */


  }

}
