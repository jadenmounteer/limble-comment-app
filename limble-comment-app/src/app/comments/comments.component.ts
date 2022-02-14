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

  spaceKeyRegEx = /^\s+$/;
  commentsService: CommentsService;
  showListOfUsers: boolean = false; // used to track if we should show the list of users so the user can mention someone
  showFancyText: boolean = false;
  comments: Array<Comment> = [];
  users: Array<User> = []; // This is where the list of users are stored
  newCommentValue: string = "";
  justMentionedSomeone = false; // Used to track if the user just tried to mention someone
  justClickedAName = false;

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
    let value = (<HTMLInputElement>$event.target).innerHTML;

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
    // Or, if they erased everything
    else if (this.spaceKeyRegEx.test(lastCharacterTyped) || (value.length == 0)) {

      // Remove the mentionSomeone menu
      this.hideListOfUsers();   

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
      textArea.innerHTML += "@";

      // Set the property so we know the user just tried to mention someone
      this.justMentionedSomeone = true;

      // Call the mention someone method
      this.mentionSomeone();
    }

    // If they have already tried to mention someone and the menu is visible...
    else if(this.justMentionedSomeone && this.showListOfUsers) {
      this.justMentionedSomeone = false;
      this.hideListOfUsers();
    }
    else {
      this.justMentionedSomeone = true;
      this.mentionSomeone();
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
    //this.commentsService.addComment(this.newCommentValue);
    let textArea = document.getElementById("new-comment-text-box-div")!.innerHTML;
    this.commentsService.addComment(textArea);
    // Clear the text area of text
    //this.newCommentValue = "";
    textArea = "submitted";
  }

  /**
   * Called when the last character the user typed is an @ symbol.
   */
  mentionSomeone() {
    // Gets the list of users from the service
    let listOfUsers = this.commentsService.getUsers();

    // Add the list of users retrieved from the service to the list of users to display
    this.users = listOfUsers;
    
    // TODO: Put a sort function here

    // Now that we have the list of users, display them to the user
    this.showListOfUsers = true;

  }

  hideListOfUsers(): void {
    this.showListOfUsers = false;
  }

  /**
   * Called when the user clicks on a user's name.
   * Adds the username to the new comment text.
   * Updates the properties accordingly. 
   * @param $event 
   */
  chooseIndividualToMention($event: MouseEvent) {
    // TODO: Remove the previous @ symbol
    //this.newCommentValue = this.newCommentValue.substring(0, this.newCommentValue.length - 1);
    //let textAreaValue  = document.getElementById('new-comment-text-box-div')?.textContent as string;
    //document.getElementById('new-comment-text-box-div').textContent=textAreaValue.substring(0,textAreaValue.length -1)!;

    // Grab the user name
    let value = (<HTMLInputElement>$event.target).textContent;
    // Trim the value just in case there is any spacing
    //let trimmedValue = value.trim();

    // Create a new span element for the mention someone name
    const newSpan = document.createElement("span");
    // Add the username to the span element along with the new @ symbol
    //newSpan.innerHTML = "@" + value;
    newSpan.innerHTML = value as string;
    // Create a new attribute
    const newAttribute = document.createAttribute("class");
    // Give the new attribute a value
    newAttribute.value = "mentioned-username";
    // Add the attribute to the new span
    newSpan.setAttributeNode(newAttribute);
    // Add the span element to the text area
    document.getElementById("new-comment-text-box-div")?.appendChild(newSpan);
    document.getElementById("new-comment-text-box-div")!.innerHTML += "&nbsp;";
    // Hide the list of users
    this.hideListOfUsers();

    // Update the new comment value
    //this.newCommentValue

    // Create a new span element for the rest of the text
    //const newSpan2 = document.createElement("span");


   

    


  }

}
