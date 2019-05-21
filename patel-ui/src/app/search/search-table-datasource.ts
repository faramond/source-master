import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { log } from '../app';
import { Search } from './search';

export class SearchTableDataSource extends DataSource<Search> {
  private data: BehaviorSubject<Search[]> = new BehaviorSubject<Search[]>(null);

  constructor(public columns?: string[]) {
    super();
    log(this).construct();
  }

  connect(): Observable<Search[]> {
    log(this).info('connect');
    return this.data;
  }

  disconnect() {
    log(this).info('disconnect');
  }

  setItems(items: Search[]) {
    if (!items || items.length < 1) {
      this.data.next(null);
      return;
    }
    this.data.next(items);
  }

  getItems(): Search[] {
    return this.data.value;
  }

  clear() {
    this.data.next(null);
  }

  empty() {
    return this.getItems() == null;
  }
}

