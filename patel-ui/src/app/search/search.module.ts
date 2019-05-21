import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchService } from './search.service';
import { ShareModule } from '../share/share.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ShareModule, SearchRoutingModule, MatExpansionModule, MatBadgeModule, MatCheckboxModule, FormsModule],
  declarations: [SearchComponent],
  providers: [ShareModule, SearchService],
})
export class SearchModule {

}
