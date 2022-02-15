import { Component, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { CommentsService } from 'src/app/services/comments.service';
import { Comment } from 'src/app/app-interfaces/comments.interface';
import { User } from 'src/app/app-interfaces/user.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
  
})
export class CommentsComponent implements OnInit {

  // PROPERTIES
  commentsService: CommentsService; // // The comments service so we can update our comments
  showListOfUsers: boolean = false; // used to track if we should show the list of users so the user can mention someone
  showAddCommentSection: boolean = false; // Used to show/hide the Add New Comment section
  comments: Array<Comment> = []; // Used to store the comments.
  users: Array<User> = []; // This is where the list of users are stored
  newCommentValue: string = ""; // Here, we keep track of the new comment value so we know what the user last typed
  justMentionedSomeone:boolean = false; // Used to track if the user just tried to mention someone using the mention button
  currentlyCheckingForUser:boolean = false; // Used to track if we are currently checking for a user and should keep the menu open.

  constructor(commentsService: CommentsService) {
    // Create a commentService object so we can retrieve and add comments
    this.commentsService = commentsService;
  }


  ngOnInit(): void {
    // Get the comments from the service
    this.comments = this.commentsService.getAllComments();
  }


  /**
   * Called when the user clicks on the add comment button.
   * Shows or hides the add comment section.
   */
  addComment(): void {
    this.showAddCommentSection = !this.showAddCommentSection;
  }


  /**
   * Gets whether we should show or hide the add new comment section.
   * @returns this.showAddCommentSection
   */
  getShowAddCommentSection(): boolean {
    return this.showAddCommentSection;
  }


  /**
   * Listens to the text area input.
   * Called every time a user presses a key while in the textarea.
   * @param $event 
   */
   listenCommentInput($event: KeyboardEvent): void {
    // Grab the new comment value
    let value = (<HTMLInputElement>$event.target).innerHTML;

    // Add the new value to the property so we can track it
    this.newCommentValue = value;
    
    // Get the last character the user typed
    let lastCharacterTyped = value[value.length - 1];
    
    // First, we check if the value contains an @
    if (!value.includes("@")){
      // If it doesn't, we remove the menu
      this.currentlyCheckingForUser = false;
      this.hideListOfUsers();
      // Refocus on the text area
      this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);
    }
    else {
      // Check if the user just typed a space
      let userTypedSpace = this.checkForSpace(value);

      // If the last character typed is a @...
      // or if we are currently checking for a user...
      // And we didn't just type a space...
      if (value.length != 0 && lastCharacterTyped == "@" || (this.currentlyCheckingForUser && !userTypedSpace)) {
        // Set currentlyCheckingForUser to false so we grab a new list of individuals
        this.currentlyCheckingForUser = false;
        // Call the mentionSomeone() method
        this.mentionSomeone();
      }

      // Else, if the user typed a space or, if they erased everything
      else if (userTypedSpace || (value.length == 0)) {
        // Remove the mentionSomeone menu
        this.hideListOfUsers();
        // Refocus on the text area
        this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);
        // Set currentlyCheckingForUser to false
        this.currentlyCheckingForUser = false;
        
      }
      else {
        // Remove the mentionSomeone menu
        this.hideListOfUsers();
        // Set currentlyCheckingForUser to false
        this.currentlyCheckingForUser = false;
        // If there is a <br> in the html
        if (value =="<br>") {
          // Remove the break
          document.getElementById("new-comment-text-box-div")!.innerHTML = "";
          // Refocus on the text are/
          this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);
        }
      }

    }
  }


  /**
   * Adds the mention symbol to the text area.
   * Makes the cursor go to the end of the text.
   * Call the mention someone method.
   */
  addMentionSymbol(): void {
    // Set currentlyCheckingForUser to false so we grab a new list of individuals
    this.currentlyCheckingForUser = false;

    // Grab the last character typed
    let lastCharacterTyped = this.newCommentValue[this.newCommentValue.length - 1];

    // Select the text area
    const textArea = document.getElementById("new-comment-text-box-div")!;

    // If the user hasn't tried to mention someone yet and the last character of the new comment text is not a @
    if (!this.justMentionedSomeone && lastCharacterTyped != "@") {
      
      // Add the @ symbol to the text content of the text area and to the newCommentValue property
      textArea.innerHTML += "@";

      // Set the property so we know the user just tried to mention someone
      this.justMentionedSomeone = true;

      // Call the mention someone method
      this.mentionSomeone();
    }

    // If they have already tried to mention someone and the menu is visible...
    else if(this.justMentionedSomeone && this.showListOfUsers) {
      // Set justMentionedSomeone to false so we do not create another @
      this.justMentionedSomeone = false;
      // Hide the list of users
      this.hideListOfUsers();
    }
    else {
      // Add another @ symbol
      textArea.innerHTML += "@";
      // Set the property so we know the user just tried to mention someone
      this.justMentionedSomeone = true;
      // Show the mention someone menu
      this.mentionSomeone();
    }

    // Focus on the text area
    this.focusOnTextArea(textArea);
    
  }


  /**
   * Listens to see if the user clicked on the submit button.
   * Calls the addComment method from the service.
   */
  listenSubmitButton(): void {
    // Call the addComment method from the comments service
    let textArea = document.getElementById("new-comment-text-box-div")!.innerHTML;
    this.commentsService.addComment(textArea);
  
    // Hide the add comment section
    this.addComment();
  }


  /**
   * Called when the last character the user typed is an @ symbol.
   * Gets the list of users and shows them to the user.
   * TODO: Include a sort function to sort according to the user's input.
   */
  mentionSomeone(): void {
    // If we haven't started checking for a user...
    if (!this.currentlyCheckingForUser) {
      // Gets a new list of users from the service
      this.users = this.commentsService.getUsers();
    }
    
    // Set currentlyCheckingForUser to true
    this.currentlyCheckingForUser = true;

    // Check to see if we should sort the users by checking if the user typed anything after the @
    const textAreaValue = document.getElementById("new-comment-text-box-div")!.innerHTML;
    if (textAreaValue[textAreaValue.length - 1] != "@"){
      // Call the sorting function.
      // Update the list of users accordingly.
      this.users = this.sortListOfusers(this.users, textAreaValue);
    }

    // Now that we have the list of users, display them to the user
    this.showListOfUsers = true;

  }


  /**
   * Hides the list of users.
   */
  hideListOfUsers(): void {
    this.showListOfUsers = false;
  }


  /**
   * Called when the user clicks on a user's name.
   * Adds the username to the new comment text.
   * Updates the properties accordingly. 
   * @param $event 
   */
  chooseIndividualToMention($event: MouseEvent): void {
    // Remove the previous typed characters
    this.removeUserTypedCharacters();

    // Grab the user name
    let value = (<HTMLInputElement>$event.target).textContent;

    // Trim the user name of leading and ending whitespace
    let trimmedValue = value?.trim();
    
    // Create a new span element for the mention someone name
    const newSpan = document.createElement("span");
    // Add the username to the span element along with the new @ symbol
    newSpan.innerHTML = "@" + trimmedValue;
    // Create a new attribute
    const newAttribute = document.createAttribute("class");
    // Give the new attribute a value
    newAttribute.value = "mentioned-username";
    // Add the attribute to the new span
    newSpan.setAttributeNode(newAttribute);
    // Add the span element to the text area
    document.getElementById("new-comment-text-box-div")?.appendChild(newSpan);

    // Add a space after the new span
    document.getElementById("new-comment-text-box-div")!.innerHTML += "&nbsp;";

    // Set currentlyCheckingFor User to false 
    this.currentlyCheckingForUser = false;
    // Hide the list of users
    this.hideListOfUsers();

    // Focus on the text area
    this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);

  }


  /**
   * Sets the focus to the end of a text area.
   * @param textArea 
   */
  focusOnTextArea(textArea: any): void{
    // Here, we work some magic to make sure the cursor is not set back to the beginning of the textarea
    // Inspired by this blog: https://thewebdev.info/2021/05/01/how-to-set-the-cursor-position-on-contenteditable-div-with-javascript/
    const selection = window.getSelection();  
    const range = document.createRange();  
    selection?.removeAllRanges();  
    range.selectNodeContents(textArea);  
    range.collapse(false);  
    selection?.addRange(range);  

    // Finally, we focus on the textArea field
    textArea.focus();
  }


  /**
   * Checks if an innerHTML value contains a space &nbsp;
   * @param value 
   */
  checkForSpace(value: string): boolean {
    // Check if the last 6 digits of the string represent a space
    if (
      value[value.length - 1] == ";" &&
      value[value.length - 2] == "p" &&
      value[value.length - 3] == "s" &&
      value[value.length - 4] == "b" &&
      value[value.length - 5] == "n" &&
      value[value.length - 6] == "&"
      ) {
        // If so, return true
        return true;
    }
    else {
      // Else, return false
      return false;
    }

  }

  /**
   * Sorts the list of user according to the user input.
   * @param listOfUsers 
   * @param textAreaValue 
   * @returns The filtered array of users.
   */
  sortListOfusers(listOfUsers: Array<User>, textAreaValue: string): Array<User> {
    // Slice out the @ of the string
    //let splicedString = textAreaValue.slice(1);

    // Find the index of the last @ symbol
    let indexOfLastSymbol = this.findIndexOfLastMentionSymbol();

    // Remove all of the characters from our search criteria up until the last @ symbol.
    let modifiedString = textAreaValue.substring(indexOfLastSymbol + 1, textAreaValue.length)!;

    // Return filter the list of names for only the name that conain the letter
    let filteredArray = new Array;
    // For each character in the string...
    for (let i=0; i < modifiedString.length; i++) {
      //console.log(`Checking ${splicedString[i]}`);
      // Loop through each user...
      listOfUsers.forEach(user => {
        // If there are letters to check
        if (user.name[i]){
          // We compare the letters of both words. If they are the same...
          if (user.name[i].toLowerCase() == modifiedString[i].toLowerCase()) {
            // If the array does not already include the individual...
            if (!filteredArray.includes(user)) {
              // Add them to the array
              filteredArray.push(user);
            }
          }
          // Else, if they are not the same and the filtered array includes them...
          else if (filteredArray.includes(user)) {
            // Remove them from the array...
            let newFilteredArray = filteredArray.filter(function(name: User){ 
              return name != user;
            });
            filteredArray = newFilteredArray;
          }

        }
        
      });
    }

    // Log the new array to the console for testing purposes
    /*
    filteredArray.forEach(user => {
      console.log(user.name);
    });
    */

    // Return the sorted list
    return filteredArray;
  }

  /**
   * Called when the user selects a name to mention.
   * Deletes everything the user typed up until the @ symbol.
   */
  removeUserTypedCharacters(): void {
    // Get the value from the text area
    let textAreaValue  = document.getElementById('new-comment-text-box-div')?.innerHTML as string;

    // Find the index of the last @ symbol
    let indexOfLastSymbol = this.findIndexOfLastMentionSymbol();
    
    // Remove the last characters until the last @ sybmol
    document.getElementById('new-comment-text-box-div')!.innerHTML=textAreaValue.substring(0,indexOfLastSymbol)!;
  }


  /**
   * Finds and returns the index of the last @ symbol 
   * in the text area. This is useful so we know where
   * to look when the user is mentioning someone.
   * @returns The index of the last @ symbol.
   */
  findIndexOfLastMentionSymbol(): number {
    // Get the value from the text area
    let textAreaValue  = document.getElementById('new-comment-text-box-div')?.innerHTML as string;

    // Find the index of the last @ symbol
    let indexOfLastSymbol = 0;
    for (let i=0; i<textAreaValue.length; i++) {
      if (textAreaValue[i] == "@"){
        indexOfLastSymbol = i;
      }
    }
    // Return the index of the last @ symbol
    return indexOfLastSymbol;
  }

  // TODO: Create a function to add punctuation after a mentioned name

}
