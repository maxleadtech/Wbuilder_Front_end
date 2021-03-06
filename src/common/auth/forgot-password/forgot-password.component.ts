import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@common/auth/auth.service';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {FormBuilder} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form = this.fb.group({
        email: [''],
    });
    public errors$ = new BehaviorSubject<{
        email?: string,
        general?: string,
    }>({});

    constructor(
        public auth: AuthService,
        public settings: Settings,
        private toast: Toast,
        private router: Router,
        private fb: FormBuilder,
    ) {}

    public sendPasswordResetLink() {
        this.loading$.next(true);
        this.auth.sendPasswordResetLink(this.form.value).subscribe(response => {
            this.router.navigate(['/login']).then(() => {
                this.loading$.next(false);
                this.toast.open(response.data);
            });
        }, err => {
            this.errors$.next(err.messages);
            this.loading$.next(false);
        });
    }
}
