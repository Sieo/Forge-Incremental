import { Component, inject } from '@angular/core';
import { AchievementService } from '../../service/achievement.service';

@Component({
    imports: [],
    selector: 'app-achievement-list',
    standalone: true,
    templateUrl: './achievement-list.component.html',
    styleUrl: './achievement-list.component.scss',
})
export class AchievementListComponent {
    readonly achievementService = inject(AchievementService);
}