import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { rootReducer } from "./rootReducer";
import { EventStoreModule } from "./event-store";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EventStoreModule,
    StoreModule.forRoot(rootReducer, {}),
    EffectsModule.forRoot([]),
  ],
})
export class RootStoreModule {}
