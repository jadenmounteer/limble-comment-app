import { Component, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { CommentsService } from 'src/app/services/comments.service';
import { Comment } from 'src/app/app-interfaces/comments.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
  
})
export class CommentsComponent implements OnInit {

  commentsService: CommentsService;
  showFancyText: boolean = false;
  comments: Array<Comment> = [];
  newCommentValue: string = "";

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
     //console.log(`User is typing ${value} into text area`);
     // Add the new value to the property
     this.newCommentValue = value;
     // TODO: Check if the user typed @
     // If so, call the mention someone method
  }

  /**
   * Adds the mention symbol to the text area.
   * Makes the cursor go to the end of the text.
   * Call the mention someone method.
   */
  addMentionSymbol() {
    // Select the text area
    const textArea = document.getElementById("new-comment-text-box-div")!;

    // Add the @ symbol to the text content of the text area and to the newCommentValue property
    textArea.textContent += "@";
    this.newCommentValue += "@";

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
    
    // Call the mention someone method
    this.mentionSomeone();
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

    // Now that we have the list of users, do something with it
  }

}
