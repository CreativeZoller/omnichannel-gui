import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Constants } from '../constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: HubConnection;
  private channel: string;
  private started = false;
  public data: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {}

  public startListening(channel: string) {
    if (this.started) return;
    this.started = true;
    this.hubConnection = new HubConnectionBuilder().withUrl(`${Constants.root}${channel}`).build();
    this.channel = channel;
    this.hubConnection.onclose((err) => {
      console.log('SignalR hub connection closed.');
      this.stopHubAndunSubscribeToServerEvents();
      this.restartConnection(err);
    });

    this.startConnection();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Hub connection started');
        this.subscribeToServerEvents();
      })
      .catch((err) => {
        this.restartConnection(err);
      });
  }

  public publishMessage(message: string) {
    this.hubConnection.invoke(this.channel, message);
  }

  private restartConnection(err: Error): void {
    console.log(`Error ${err}`);
    console.log('Retrying connection to SignalR Hub ...');
    setTimeout(() => {
      this.startConnection();
    }, 10000);
  }

  private subscribeToServerEvents(): void {
    this.hubConnection.on(this.channel, (data: any) => {
      this.data.next(data);
    });
  }
  private stopHubAndunSubscribeToServerEvents(): void {
    this.hubConnection.off(this.channel);
    this.hubConnection.stop().then(() => console.log('Hub connection stopped'));
  }
}
