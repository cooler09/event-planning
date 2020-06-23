import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { EventComponent } from "./event/event.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },

  {
    path: ":id",
    component: EventComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
