import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="pager" aria-label="Pagination" *ngIf="total > pageSize">
      <button class="btn" [disabled]="page<=1" (click)="go(page-1)" id="qa-page-prev">Prev</button>
      <button
        *ngFor="let p of pages"
        class="btn num"
        [class.active]="p===page"
        (click)="go(p)"
        [attr.aria-current]="p===page ? 'page' : null"
        id="qa-page-{{p}}"
      >{{ p }}</button>
      <button class="btn" [disabled]="page>=lastPage" (click)="go(page+1)" id="qa-page-next">Next</button>
    </nav>
  `,
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pageSize = 12;
  @Input() total = 0;
  @Output() pageChange = new EventEmitter<number>();

  get lastPage(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  get pages(): number[] {
    const lp = this.lastPage;
    const arr: number[] = [];
    for (let i = 1; i <= lp; i++) arr.push(i);
    return arr.slice(0, 10); // cap to 10 for simplicity
  }

  go(p: number) {
    if (p < 1 || p > this.lastPage) return;
    this.pageChange.emit(p);
  }
}
