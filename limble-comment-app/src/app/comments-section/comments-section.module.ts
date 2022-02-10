import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments/comments.component';
import { AddNewCommentComponent } from './add-new-comment/add-new-comment.component';


@NgModule({
  declarations: [
    CommentsComponent,
    AddNewCommentComponent
  ],
  exports: [
    CommentsComponent,
    AddNewCommentComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CommentsSectionModule { }
