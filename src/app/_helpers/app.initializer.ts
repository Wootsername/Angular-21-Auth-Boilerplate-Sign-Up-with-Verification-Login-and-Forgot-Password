import { AccountService } from '@app/_services';

export function appInitializer(accountService: AccountService) {
    return () => new Promise<void>(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        accountService.refreshToken()
            .subscribe({
                next: () => resolve(),
                error: () => resolve() // Resolve anyway on error so the app continues loading instead of crashing
            });
    });
}
