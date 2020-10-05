import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { rootReducer } from "./rootReducer";
import { EventStoreModule } from "./event-store";
import { UserStoreModule } from "./user-store";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EventStoreModule,
    UserStoreModule,
    StoreModule.forRoot(rootReducer, {}),
    EffectsModule.forRoot([]),
  ],
})
export class RootStoreModule {}
