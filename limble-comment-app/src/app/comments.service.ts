import { Injectable } from '@angular/core';
import { Comment } from './app-interfaces/comments.interface';

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

  addComment(): void {

  }

}
