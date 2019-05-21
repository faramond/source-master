import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav.component';
import { AuthGuardService } from '../share/auth-guard.service';

const routes: Routes = [{
  path: '', component: NavComponent, children: [
    { path: 'search', loadChildren: 'src/app/search/search.module#SearchModule' },
    { path: '', redirectTo: 'search', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRoutingModule {
}
