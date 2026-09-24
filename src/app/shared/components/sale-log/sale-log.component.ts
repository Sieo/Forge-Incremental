import { Component, inject } from '@angular/core';
import { EconomyService } from '../../service/economy.service';

@Component({
    selector: 'app-sale-log',
    standalone: true,
    templateUrl: './sale-log.component.html',
    styleUrl: './sale-log.component.scss',
})
export class SaleLogComponent {
    readonly economy = inject(EconomyService);
}