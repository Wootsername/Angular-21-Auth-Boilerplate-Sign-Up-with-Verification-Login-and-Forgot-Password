import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private accountService: AccountService) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// add auth header with jwt if account is logged in and request is to the api url
		const account = this.accountService.accountValue;
		const isLoggedIn = account && account.jwtToken;
		const isApiUrl = request.url.startsWith(environment.apiUrl);
		if (isApiUrl) {
			// Always include credentials for API requests (needed for cross-domain cookies)
			const headers: any = {};
			if (isLoggedIn) {
				headers['Authorization'] = `Bearer ${account.jwtToken}`;
			}
			request = request.clone({
				setHeaders: headers,
				withCredentials: true
			});
		}

		return next.handle(request);
	}
}
