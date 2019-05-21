import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './share/auth-guard.service';

const routes: Routes = [
  { path: 'login', loadChildren: 'src/app/login/login.module#LoginModule' },
  //  {path: '', loadChildren: 'src/app/nav/nav.module#NavModule', canLoad: [AuthGuardService]},
  { path: '', loadChildren: 'src/app/search/search.module#SearchModule' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
