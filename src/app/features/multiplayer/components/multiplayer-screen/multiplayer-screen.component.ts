import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameOpenMainScreen } from 'src/app/core/events';
// import { WebSocketService } from 'src/app/features/services/web-socket.service';
import { SharedModule } from 'src/app/features/shared/shared.module';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-multiplayer-screen',
  imports: [SharedModule, FormsModule],
  templateUrl: './multiplayer-screen.component.html',
  styleUrl: './multiplayer-screen.component.scss',
})
export class MultiplayerScreenComponent {
  private readonly events = inject(EventsService);
  // private readonly webSockets = inject(WebSocketService);

  readonly serverIPAddress = signal('');

  toMainScreen(): void {
    this.events.dispatch(GameOpenMainScreen());
    // this.webSockets.messages$.subscribe((messages) => {
    //   console.log(messages);
    // });
  }

  tryConnect(): void {
    // this.webSockets.connect({ url: `ws://${this.serverIPAddress()}` });
    // this.webSockets.connectionStatus$.subscribe((status) => {
    //   if (status === true) {
    //     this.webSockets.sendMessage({ payload: 'I have connected!', type: 'Connected' });
    //   }
    // });
  }
}
