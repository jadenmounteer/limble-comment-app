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
  spaceKeyRegEx: RegExp = /^\s+$/; // A regular expression used to track the space key
  commentsService: CommentsService; // // The comments service so we can update our comments
  showListOfUsers: boolean = false; // used to track if we should show the list of users so the user can mention someone
  showAddCommentSection: boolean = false; // Used to show/hide the Add New Comment section
  comments: Array<Comment> = []; // Used to store the comments.
  users: Array<User> = []; // This is where the list of users are stored
  newCommentValue: string = ""; // Here, we keep track of the new comment value so we know what the user last typed
  justMentionedSomeone:boolean = false; // Used to track if the user just tried to mention someone using the mention button

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

    // If the last character typed is a @...
    if (lastCharacterTyped == "@") {
      // Call the mentionSomeone() method
      this.mentionSomeone();
    }

    // Else, if the user typed a space or, if they erased everything
    else if (/^\s+$/.test(lastCharacterTyped) || (value.length == 0)) {
      // Remove the mentionSomeone menu
      this.hideListOfUsers();
      // Refocus on the text area
      this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);
      
    }
    else {
      // Remove the mentionSomeone menu
      this.hideListOfUsers();
      // If there is a <br> in the html
      if (value =="<br>") {
        // Remove the break
        document.getElementById("new-comment-text-box-div")!.innerHTML = "";
        // Refocus on the text are/
        this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);
      }
    }
     
  }


  /**
   * Adds the mention symbol to the text area.
   * Makes the cursor go to the end of the text.
   * Call the mention someone method.
   */
  addMentionSymbol(): void {
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
    // Gets the list of users from the service
    let listOfUsers = this.commentsService.getUsers();

    // Add the list of users retrieved from the service to the list of users to display
    this.users = listOfUsers;
    
    // TODO: Put a sort function here

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
    // Remove the previous @ symbol
    let textAreaValue  = document.getElementById('new-comment-text-box-div')?.innerHTML as string;
    document.getElementById('new-comment-text-box-div')!.innerHTML=textAreaValue.substring(0,textAreaValue.length -1)!;

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

}
