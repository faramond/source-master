import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
private content = new BehaviorSubject<string>('');
public share = this.content.asObservable();

updateData(text) {
  this.content.next(text);
}
}
