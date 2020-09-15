import { Injectable } from "@angular/core";
import {
  Store,
  MemoizedSelector,
  DefaultProjectorFn,
  State,
} from "@ngrx/store";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import { RootStoreState } from "../../root-store";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  constructor(private readonly store: Store<RootStoreState.State>) {}

  public getCurrentState<T>(
    mSelector: MemoizedSelector<RootStoreState.State, {}, DefaultProjectorFn<T>>
  ) {
    let selectedState: T;
    this.store
      .select(mSelector)
      .pipe(take(1))
      .subscribe((s) => (selectedState = s as T));
    return selectedState;
  }

  public select<K>(mapFn: (state: RootStoreState.State) => K): Observable<K> {
    return this.store.select(mapFn);
  }

  public dispatch(action): void {
    this.store.dispatch(action);
  }

  public getFullState(): RootStoreState.State {
    let fullState;
    this.store.pipe(take(1)).subscribe((state) => (fullState = state));
    return fullState;
  }

  public getStore(): Store<RootStoreState.State> {
    return this.store;
  }
}
