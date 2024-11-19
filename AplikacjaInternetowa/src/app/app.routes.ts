import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/homescreen/homescreen.component';
import { LoginScreenComponent } from './screens/loginscreen/loginscreen.component';
import { RegisterscreenComponent } from './screens/registerscreen/registerscreen.component';
import { AddnewclientscreenComponent } from './screens/addnewclientscreen/addnewclientscreen.component';
import { AddreportscreenComponent } from './screens/addreportscreen/addreportscreen.component';
import { WorkprogressscreenComponent } from './screens/workprogressscreen/workprogressscreen.component';
import { AddnewtaskscreenComponent } from './screens/addnewtaskscreen/addnewtaskscreen.component';
import { AddreportphotosscreenComponent } from './screens/addreportphotosscreen/addreportphotosscreen.component';
import { AllclientscreenComponent } from './screens/allclientscreen/allclientscreen.component';
import { AllemployeescreenComponent } from './screens/allemployeescreen/allemployeescreen.component';
import { EditclientscreenComponent } from './screens/editclientscreen/editclientscreen.component';
import { EditemployeescreenComponent } from './screens/editemployeescreen/editemployeescreen.component';
import { ManagmentscreenComponent } from './screens/managmentscreen/managmentscreen.component';
import { NotificationdonescreenComponent } from './screens/notificationdonescreen/notificationdonescreen.component';
import { NotificationscreenComponent } from './screens/notificationscreen/notificationscreen.component';
import { WorkprogressdetialseescreenComponent } from './screens/workprogressdetialseescreen/workprogressdetialseescreen.component';
import { WorkprogressdetialupdatescreenComponent } from './screens/workprogressdetialupdatescreen/workprogressdetialupdatescreen.component';
import { WorkprogressdetialscreenComponent } from './screens/workprogressdetialscreen/workprogressdetialscreen.component';
import { FirstcomponentComponent } from './screens/firstcomponent/firstcomponent.component';
import { SearchForClientComponent } from './screens/search-for-client/search-for-client.component';
import { ClientFinalScreenComponent } from './screens/client-final-screen/client-final-screen.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', component: FirstcomponentComponent},
  { path: 'ClientFinalScreen', component: ClientFinalScreenComponent},
  { path: 'SearchForClient', component: SearchForClientComponent},
  { path: 'login', component: LoginScreenComponent },
  { path: 'register', component: RegisterscreenComponent}, 
  { path: 'addnewclientscreen', component: AddnewclientscreenComponent, canActivate: [AuthGuard]},
  { path: 'addreportscreen', component: AddreportscreenComponent, canActivate: [AuthGuard]},
  { path: 'workprogressscreen', component: WorkprogressscreenComponent, canActivate: [AuthGuard]},
  { path: 'Addnewtaskscreen', component: AddnewtaskscreenComponent, canActivate: [AuthGuard]},
  { path: 'Addreportphotosscreen', component: AddreportphotosscreenComponent, canActivate: [AuthGuard]},
  { path: 'Allclientscreen', component: AllclientscreenComponent, canActivate: [AuthGuard]},
  { path: 'Allemployeescreen', component: AllemployeescreenComponent, canActivate: [AuthGuard]},
  { path: 'Editclientscreen', component: EditclientscreenComponent, canActivate: [AuthGuard]},
  { path: 'Editemployeescreen', component: EditemployeescreenComponent, canActivate: [AuthGuard]},
  { path: 'Managmentscreen', component: ManagmentscreenComponent, canActivate: [AuthGuard]},
  { path: 'Notificationdonescreen', component: NotificationdonescreenComponent, canActivate: [AuthGuard]},
  { path: 'Notificationscreen', component: NotificationscreenComponent, canActivate: [AuthGuard]},
  { path: 'Workprogressdetialseescreen', component: WorkprogressdetialseescreenComponent, canActivate: [AuthGuard]},
  { path: 'Workprogressdetialupdatescreen', component: WorkprogressdetialupdatescreenComponent, canActivate: [AuthGuard]},
  { path: 'Workprogressdetailscreen', component: WorkprogressdetialscreenComponent, canActivate: [AuthGuard]},
  
  // inne ścieżki
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
