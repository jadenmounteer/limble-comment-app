import { Component, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { CommentsService } from 'src/app/comments.service';
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

  constructor(commentsService: CommentsService) {
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

}
