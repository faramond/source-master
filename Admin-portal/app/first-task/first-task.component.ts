import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-task',
  templateUrl: './first-task.component.html',
  styleUrls: ['./first-task.component.css']
})
export class FirstTaskComponent implements OnInit {

  username = 'anu';
  constructor() { }

  ngOnInit(): void {
  }
}
