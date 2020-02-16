import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  user: String;
  name: String;

  constructor (
    private _chatService:ChatService, 
    private fb: FormBuilder,
    private router: Router){}

  userLogin() {
    this.name = this.user;
    this._chatService.userLogin({user:this.user});
  }

  ngOnInit(){
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]]
    })
  }
}
