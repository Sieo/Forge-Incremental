import { Component, inject, signal } from '@angular/core';
import { ForgeComponent } from './shared/components/forge/forge.component';
import { HeaderComponent } from './core/components/header/header.component';
import { ItemListComponent } from './shared/components/item-list/item-list.component';
import { ObjectivesComponent } from './shared/components/objectives/objectives.component';
import { SaleLogComponent } from './shared/components/sale-log/sale-log.component';
import { StatsComponent } from './shared/components/stats/stats.component';
import { UpgradeListComponent } from './shared/components/upgrade-list/upgrade-list.component';
import { PersistenceService } from './shared/service/persistence.service';

@Component({
  imports: [
    ForgeComponent,
    HeaderComponent,
    ItemListComponent,
    ObjectivesComponent,
    UpgradeListComponent,
    StatsComponent,
    SaleLogComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('forge_incremental');
  private readonly persistence = inject(PersistenceService);
}
