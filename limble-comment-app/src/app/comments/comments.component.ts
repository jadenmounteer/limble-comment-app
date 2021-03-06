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
  commentsService: CommentsService; // // The comments service so we can update our comments
  showListOfUsers: boolean = false; // used to track if we should show the list of users so the user can mention someone
  showAddCommentSection: boolean = false; // Used to show/hide the Add New Comment section
  comments: Array<Comment> = []; // Used to store the comments.
  users: Array<User> = []; // This is where the list of users are stored
  newCommentValue: string = ""; // Here, we keep track of the new comment value so we know what the user last typed
  justMentionedSomeone:boolean = false; // Used to track if the user just tried to mention someone using the mention button
  currentlyCheckingForUser:boolean = false; // Used to track if we are currently checking for a user and should keep the menu open.

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
    
    // Check the user input 
    switch ($event.key) {

      // If the user typed a @
      case "@":
          // Set currentlyCheckingForUser to false so we grab a new list of individuals
          this.currentlyCheckingForUser = false;
          // Call the mentionSomeone() method
          this.mentionSomeone();
          break;

      // Or, if the user typed a space
      case " ":
        // Remove the mentionSomeone menu
        this.hideListOfUsers();
        // Refocus on the text area
        this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);
        // Set currentlyCheckingForUser to false
        this.currentlyCheckingForUser = false;
        break; 

      // If the user pressed enter
      case "Enter":
        break;

      case "ArrowUp":
        break;
      
      case "ArrowDown":
        break;
        
      // If the user pressed Shift
      case "Shift":

        // Check if the last character in the value is @
        // Or if the user is typing in a div (as is the case when starting a new line)
        if (value[value.length -1] == "@" || (value[value.length -2] == "v" && value[value.length -5] == "@")){
          // Set currentlyCheckingForUser to false so we grab a new list of individuals
          this.currentlyCheckingForUser = false;
          // Call the mentionSomeone() method
          this.mentionSomeone();
        }
        break;


      default:
        console.log("in default");
        // Check if there are no characters in the text area
        if (value.length == 0 || value == "<br>") {
          console.log("logged");
          // Remove the mentionSomeone menu
          this.hideListOfUsers();
          // Refocus on the text area
          this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!);
          // Set currentlyCheckingForUser to false
          this.currentlyCheckingForUser = false;
        }

        // If we are currently checking for a user
        else if (this.currentlyCheckingForUser) {
          // Call the mentionSomeone() method if the user did not press the up or down arrow keys
          if (value.includes("@")){     
            // Set currentlyCheckingForUser to false so we grab a new list of individuals
            this.currentlyCheckingForUser = false;
            this.mentionSomeone();
          }
          // if the user has erased all @ symbols...
          else{
            this.currentlyCheckingForUser = false;
            this.hideListOfUsers();
          }
        }
        // If nothing else matches...
        else {
          // Check if the user is deleting a mentioned username
          if (value[value.length - 2] == "n" && value[value.length - 1] == ">" && value[value.length - 3] == "a" ) {
            // Remove the mentioned username from the string
            let indexOfLastSymbol = this.findIndexOfLastMentionSymbol();
            let modifiedString = value.substring(0, indexOfLastSymbol - 33)!;
            document.getElementById("new-comment-text-box-div")!.innerHTML = modifiedString;
            // Refocus on the text area
            this.focusOnTextArea(document.getElementById("new-comment-text-box-div")!); 
          }
        }

        break;

    } // End of swtich statement
    
  }


  /**
   * Adds the mention symbol to the text area.
   * Makes the cursor go to the end of the text.
   * Call the mention someone method.
   */
  addMentionSymbol(): void {
    // Set currentlyCheckingForUser to false so we grab a new list of individuals
    this.currentlyCheckingForUser = false;

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
    // If we haven't started checking for a user...
    if (!this.currentlyCheckingForUser) {
      // Gets a new list of users from the service
      this.users = this.commentsService.getUsers();
    }
    
    // Set currentlyCheckingForUser to true
    this.currentlyCheckingForUser = true;

    // Check to see if we should sort the users by checking if the user typed anything after the @
    const textAreaValue = document.getElementById("new-comment-text-box-div")!.innerHTML;

    console.log(textAreaValue);
    if (textAreaValue[textAreaValue.length - 1] != "@"){
      console.log("Looks like we're sorting");
      let shouldWeSort = true;
      // Now, let's check if we are on a new line and haven't started to type yet
      console.log(textAreaValue[-2]);
      if (textAreaValue[textAreaValue.length - 2] == "v" && textAreaValue[textAreaValue.length - 7] == "@") {
        // Since we are on a new line and haven't typed yet, we don't want to sort quite yet
        shouldWeSort = false;
      }
      
      // If we should sort...
      if(shouldWeSort) {
        // Call the sorting function.
        // Update the list of users accordingly.
        this.users = this.sortListOfusers(this.users, textAreaValue);
      }
    }

    // Now that we have the list of users, display them to the user
    this.showListOfUsers = true;

    // By default, add the .selected class to the first user in the list
    window.setTimeout(() => {
      let userList = document.getElementsByClassName("user-item");
      if (userList[0]){
        userList[0].classList.add("selected");
      }    
    }, 100);
    
  }


  /**
   * Hides the list of users.
   */
  hideListOfUsers(): void {
    //alert("hiding")
    this.showListOfUsers = false;
  }


  /**
   * Called when the user clicks on a user's name.
   * Adds the username to the new comment text.
   * Updates the properties accordingly. 
   * @param $event 
   */
  clickIndividualToMention($event: MouseEvent): void {
    // Grab the user name
    let value = (<HTMLInputElement>$event.target).textContent;

    // Add them to the comment area
    this.addUserToTextArea(value!);
  }

  /**
   * Called when the user selects a user to mention from the list.
   * Creates a new span element and adds it to the HTML page.
   */
  addUserToTextArea(value: string): void {
    // Remove the previous typed characters
    this.removeUserTypedCharacters();

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

    // Set currentlyCheckingFor User to false 
    this.currentlyCheckingForUser = false;
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


  /**
   * Sorts the list of user according to the user input.
   * @param listOfUsers 
   * @param textAreaValue 
   * @returns The filtered array of users.
   */
  sortListOfusers(listOfUsers: Array<User>, textAreaValue: string): Array<User> {
    // Find the index of the last @ symbol
    let indexOfLastSymbol = this.findIndexOfLastMentionSymbol();

    // Remove all of the characters from our search criteria up until the last @ symbol.
    let modifiedString = textAreaValue.substring(indexOfLastSymbol + 1, textAreaValue.length)!;
    
    // If the modified string includes a div (meaning we are on a new line)...
    if (modifiedString.includes("</div>")) {
      // Remove the div from the modified string...
      modifiedString = modifiedString.substring(0, modifiedString.length - 6);
    }

    // Return filter the list of names for only the name that conain the letter
    let filteredArray = new Array;
    // For each character in the string...
    for (let i=0; i < modifiedString.length; i++) {
      // Loop through each user...
      listOfUsers.forEach(user => {
        // If there are letters to check
        if (user.name[i]){
          // We compare the letters of both words. If they are the same...
          if (user.name[i].toLowerCase() == modifiedString[i].toLowerCase()) {
            // If the array does not already include the individual...
            if (!filteredArray.includes(user)) {
              // Add them to the array
              filteredArray.push(user);
            }
          }
          // Else, if they are not the same and the filtered array includes them...
          else if (filteredArray.includes(user)) {
            // Remove them from the array...
            let newFilteredArray = filteredArray.filter(function(name: User){ 
              return name != user;
            });
            filteredArray = newFilteredArray;
          }

        }
        
      });
    }

    // Return the sorted list
    return filteredArray;
  }


  /**
   * Called when the user selects a name to mention.
   * Deletes everything the user typed up until the @ symbol.
   */
  removeUserTypedCharacters(): void {
    // Get the value from the text area
    let textAreaValue  = document.getElementById('new-comment-text-box-div')?.innerHTML as string;

    // Find the index of the last @ symbol
    let indexOfLastSymbol = this.findIndexOfLastMentionSymbol();
    
    // Remove the last characters until the last @ sybmol
    document.getElementById('new-comment-text-box-div')!.innerHTML=textAreaValue.substring(0,indexOfLastSymbol)!;
  }


  /**
   * Finds and returns the index of the last @ symbol 
   * in the text area. This is useful so we know where
   * to look when the user is mentioning someone.
   * @returns The index of the last @ symbol.
   */
  findIndexOfLastMentionSymbol(): number {
    // Get the value from the text area
    let textAreaValue  = document.getElementById('new-comment-text-box-div')?.innerHTML as string;

    // Find the index of the last @ symbol
    let indexOfLastSymbol = 0;
    for (let i=0; i<textAreaValue.length; i++) {
      if (textAreaValue[i] == "@"){
        indexOfLastSymbol = i;
      }
    }
    // Return the index of the last @ symbol
    return indexOfLastSymbol;
  }

  /**
   * Called when the user presses a a key and
   * we are currently looking for someone to mention.
   */
  navigateSubMenu($event: KeyboardEvent): void{
    // Check if the user typed Enter, ArrowUp, or ArrowDown and if we are currently checking for a user to mention.
    if (this.currentlyCheckingForUser && ($event.key == "Enter" || $event.key == "ArrowUp" || $event.key == "ArrowDown")) {
      // Grab the list of users
      let userList = document.getElementsByClassName("user-item");

      // Loop through the list of users.
      // Find the index of the user with a class of selected
      let indexOfSelectedUser = 0;
      for (let i=0; i<userList.length; i++) {
        if (userList[i].classList.contains("selected")){
          indexOfSelectedUser = i;
          break;
        }
      }

      // Grab the selected user
      let selectedUser = userList[indexOfSelectedUser];
      // Declare a variable to house the index of the next user
      let indexOfNextUser;

      // Check the user input...
      switch($event.key){
        // If the user presses enter...
        case "Enter":      
          // Add the selected user to the text area
          this.addUserToTextArea(selectedUser.textContent!);
          break;
        
        // If the user pressed the down arrow
        case "ArrowDown":
          // Remove the selected class from the selected user
          selectedUser.classList.remove("selected");
          // Grab the index of the next user
          indexOfNextUser = indexOfSelectedUser + 1;
          // If the next user does not exist...
          if (indexOfNextUser >= userList.length) {
            // Make the original item in the list selected
            indexOfNextUser = 0;
          }
          // Add the selected class to the next user in the list
          userList[indexOfNextUser].classList.add("selected");
          // Update the index of the selected user
          indexOfSelectedUser = indexOfNextUser;
          break;

        // If the user pressed the up arrow
        case "ArrowUp":
          // Remove the selected class from the selected user
          selectedUser.classList.remove("selected");
          // Grab the index of the next user
          indexOfNextUser = indexOfSelectedUser - 1;
          // If the next user does not exist...
          if (indexOfNextUser < 0) {
            // Make the original item in the list selected
            indexOfNextUser = userList.length - 1;
          }
          // Add the selected class to the previous user in the list
          userList[indexOfNextUser].classList.add("selected");
          // Update the index of the selected user
          indexOfSelectedUser = indexOfNextUser;
          break;

      }

      // Scroll the user div accordingly
      let coordinate = 0;
      switch(indexOfSelectedUser) {
        case userList.length - 1:
          coordinate = 100;
      }
      document.getElementById("user-list-div")!.scrollTo({
        top: coordinate,
        behavior: "smooth"
      });

      // Make the key not do anything. This is so the user doesn't inadvertantly navigate the text area
      $event.preventDefault();
      
    }

  }

  // TODO: Create a function to add punctuation after a mentioned name

}
