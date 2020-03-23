import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHandler(event) {
  //   var confirmationMessage = "\o/";

  //   (event || window.event).returnValue = confirmationMessage; //Gecko + IE
  //   return confirmationMessage;     
  // }

  chatForm: FormGroup;
  roomSelection: boolean = true;
  btnLeave: boolean = false;
  room: String;
  user: String;
  message: String;
  btnChat: boolean = false;
  messageArray:Array<{user:String, message: String}> = [];
  isTyping = false;
  chatDiv;

  constructor (
    private _chatService:ChatService, 
    private fb: FormBuilder,
    private router: Router,
    ){
      this._chatService.newUserJoin().subscribe(data => this.messageArray.push(data))

      this._chatService.userLeftRoom().subscribe(data => this.messageArray.push(data))     

      this._chatService.newMessage().subscribe(data => { 
        this.messageArray.push(data);
        this.isTyping = false;
      });     

      this._chatService.receivedTyping().subscribe(bool => {
        this.isTyping = bool.isTyping;
      });
    }

  typing() {
    this._chatService.typing({room: this.room, user: this.user});
  }

  joinRoom() {  
    this._chatService.joinRoom({user:this.user,room:this.room});
    this.roomSelection = true;
    this.btnLeave = false;
    this.chatForm.controls['chatbox'].enable();
  }

  leaveRoom() {
    this._chatService.leaveRoom({user:this.user,room:this.room});
    this.roomSelection = false;
    this.btnLeave = true;
    this.chatForm.controls['chatbox'].disable();
    this.btnChat = true;
  }

  sendMsg() {
    this._chatService.sendMessage({user:this.user,room:this.room, message:this.message});
    this.message = "";
  }

  ngOnInit(){

    this.chatDiv = document.getElementById("chatMessages");

    this.chatForm = this.fb.group({
      chatbox: ['', [Validators.required]]
    })

    this._chatService.user.subscribe(u => {
      this.user = u;
    });

    this.room = "Main Lobby"
    this.joinRoom();
    this.roomSelection = true;
    this.btnChat = true;
  }

  ngAfterViewChecked(){
    this.chatDiv.scrollTop = this.chatDiv.scrollHeight;
  }
}
