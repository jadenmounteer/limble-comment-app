import { Injectable } from '@angular/core';
import { Comment } from '../app-interfaces/comments.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

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

  constructor() { }

  getAllComments(): Array<Comment> {
    // TODO: return a clone of this object.. this object cannot be changed from other places
    return this.comments;
  }

  /**
   * Called when the user selects the Submit button.
   * @param textAreaValue
   */
  addComment(textAreaValue: string): void {
    console.log("Adding comment!");
    console.log(`looks like the value is: ${textAreaValue}`);
    // Create a new comment and add the comment along with the username
    // Add the timestamp
    let newComment = {
      "comment": textAreaValue,
      "userName": "Wanda Maximoff",
      "createdDate": "2022/02/03 12:15 AM" // TODO: Create a timestamp method
    }

    // Add the new comment to the list of new comments
    this.comments.push(newComment);    
  }

}
