import { Injectable } from "@angular/core";
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()

export class ChatService{

    user: BehaviorSubject<string>;

    private socket = io('http://localhost:3000');

    constructor() {
        this.user = new BehaviorSubject("Anonymous");
    }

    userLogin(data) {
        this.socket.emit('userLogin', data);
        this.user = new BehaviorSubject(data.user);
    }

    typing(data) {
        this.socket.emit('typing', data);
    }
    
    receivedTyping() {
        let observable = new Observable<{isTyping: boolean}>(observer => {

            this.socket.on('userTyping', (data) => {
                observer.next(data);
            });

            return () => {this.socket.disconnect();}

        });

        return observable;
    }

    sendMessage(data){
        this.socket.emit('message', data);
    }

    newMessage(){
        let observable = new Observable<{user:String, message:String}>(observer => {

            this.socket.on('newMessage', (data) => {
                observer.next(data);
            });

            return () => {this.socket.disconnect();}

        });

        return observable;
    }

    joinRoom(data) {
        this.socket.emit('joinRoom', data);
    }

    newUserJoin(){
        let observable = new Observable<{user:String, message:String}>(observer => {

            this.socket.on('newUserJoin', (data) => {
                observer.next(data);
            });

            this.socket.on('meJoin', (data) => {
                observer.next(data);
            });

            return () => {this.socket.disconnect();}
        });

        return observable;
    }

    leaveRoom(data){
        this.socket.emit('leaveRoom', data);
    }

    userLeftRoom(){
        let observable = new Observable<{user:String, message:String}>(observer => {

            this.socket.on('leftRoom', (data) => {
                observer.next(data);
            });

            this.socket.on('meLeave', (data) => {
                observer.next(data);
            });

            return () => {this.socket.disconnect();}
        });

        return observable;
    }
}