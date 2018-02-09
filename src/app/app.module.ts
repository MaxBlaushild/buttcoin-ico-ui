import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ButtcoinService } from './services/buttcoin/buttcoin.service';
import { Web3Service } from './services/web-3/web-3.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    Web3Service,
    ButtcoinService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
