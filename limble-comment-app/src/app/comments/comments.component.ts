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

  commentsService: CommentsService;
  showListOfUsers: boolean = false; // used to track if we should show the list of users so the user can mention someone
  showFancyText: boolean = false;
  comments: Array<Comment> = [];
  users: Array<User> = []; // This is where the list of users are stored
  newCommentValue: string = "";
  justMentionedSomeone = false; // Used to track if the user just tried to mention someone

  constructor(commentsService: CommentsService) {
    // Create a commentService object so we can retrieve and add comments
    this.commentsService = commentsService;
  }

  ngOnInit(): void {
    this.comments = this.commentsService.getAllComments();
  }

  addComment(): void {
    this.showFancyText = !this.showFancyText;
  }

  getShowFancyText(): boolean {
    return this.showFancyText;
  }

  /**
   * Listens to the text area input.
   * Called every time a user presses a key while in the textarea.
   * @param $event 
   */
   listenCommentInput($event: KeyboardEvent): void {
     // Grab the new comment value
     // typecast it as a string so we can pass it into the property
     let value = (<HTMLInputElement>$event.target).textContent as string;

     // Add the new value to the property
     this.newCommentValue = value;
     
     // Check the last character the user typed...
     let lastCharacterTyped = value[value.length - 1];

     // If the last character typed is a @...
     if (lastCharacterTyped == "@") {
       // Call the mentionSomeone() method
       this.mentionSomeone();
     }

     // Else, if the user typed a space...
     else if (/^\s+$/.test(lastCharacterTyped)) {
       // Remove the mentionSomeone menu
       this.showListOfUsers = false;  
     }

     else {
      if (value.length == 0) {
        this.showListOfUsers = false;  
      }
     }
     
  }

  /**
   * Adds the mention symbol to the text area.
   * Makes the cursor go to the end of the text.
   * Call the mention someone method.
   */
  addMentionSymbol() {
    // Grab the last character typed
    let lastCharacterTyped = this.newCommentValue[this.newCommentValue.length - 1];

    // Select the text area
    const textArea = document.getElementById("new-comment-text-box-div")!;

    // If the user hasn't tried to mention someone yet and the last character of the new comment text is not a @
    if (!this.justMentionedSomeone && lastCharacterTyped != "@") {
      
      // Add the @ symbol to the text content of the text area and to the newCommentValue property
      textArea.textContent += "@";
      this.newCommentValue += "@";

      // Set the property so we know the user just tried to mention someone
      this.justMentionedSomeone = true;

      // Call the mention someone method
      this.mentionSomeone();
    }

    // If they have already tried to mention someone and the menu is visible...
    else if(this.justMentionedSomeone && this.showListOfUsers) {
      this.justMentionedSomeone = false;
      this.showListOfUsers = false;
    }
    else {
      this.justMentionedSomeone = true;
      this.showListOfUsers = true;
    }

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
   * Listens to see if the user clicked on the submit button.
   */
  listenSubmitButton() {
    // Call the addComment method from the comments service
    // Pass the textarea value in as an argument
    this.commentsService.addComment(this.newCommentValue);
    // Clear the text area of text
    this.newCommentValue = "";
  }

  mentionSomeone() {
    // Gets the list of users from the service
    let listOfUsers = this.commentsService.getUsers();
    console.log(listOfUsers);
    // Add the list of users retrieved from the service to the list of users to display
    this.users = listOfUsers;
    
    // TODO: We probably want to put a sort function here

    // Now that we have the list of users, display them to the user
    this.showListOfUsers = true;

  }

  /**
   * Called when the user clicks on a user's name.
   * Adds the username to the new comment text.
   * Updates the properties accordingly. 
   * @param $event 
   */
  chooseIndividualToMention($event: MouseEvent) {
    // Grab the user name
    let value = (<HTMLInputElement>$event.target).textContent as string;
    // Trim the value just in case there is any spacing
    let trimmedValue = value.trim();
    
    // Add the user name to the new comment text
    this.newCommentValue += `<span>${trimmedValue}</span>`; 

  }

}
