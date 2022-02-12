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
     let value = (<HTMLInputElement>$event.target).value;
     //console.log("your comment is: " + value);
     // Add the new value to the property
     this.newCommentValue = value;
     // TODO: Check if the user typed @
     // If so, call the mention someone method
  }

  /**
   * Adds the mention symbol to the text area.
   * Call the mention someone method.
   */
  addMentionSymbol() {
    // Add the mention symbol to the text area
    //console.log(`The new comment value is: ${this.newCommentValue}`);
    this.newCommentValue += "@";
    // Give the text area focus
    document.getElementById("new-comment-text-area")?.focus();
    
    // TODO: Call the mention someone method

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

}
