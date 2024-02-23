import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {PokeerbaseService} from "../_services/pokeerbase.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const pb = inject(PokeerbaseService);
  const isLoggedIn = pb.isLoggedIn();

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  if (route.params['tableId']) {
    if (!(await pb.hasAccessToTable(route.params['tableId']))) {
      router.navigate(['/tables']);
      return false
    }
  }
  return true;
};
