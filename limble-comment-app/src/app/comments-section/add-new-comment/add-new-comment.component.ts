import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-comment',
  templateUrl: './add-new-comment.component.html',
  styleUrls: ['./add-new-comment.component.scss']
})
export class AddNewCommentComponent implements OnInit {

  buttonValue: string = "test";  

  constructor() { }

  ngOnInit(): void {}

  /**
   * Listens to the text area input
   * @param $event 
   */
  listenCommentInput($event: KeyboardEvent): void {
    let value = (<HTMLInputElement>$event.target).value;
    console.log("your comment is: " + value);
  }

}
