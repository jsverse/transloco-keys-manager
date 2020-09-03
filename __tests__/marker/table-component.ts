import { getText } from '@ngneat/transloco-keys-manager';

@Component({
  selector: 'bla-bla',
  template: `
    <table>
      <tr>
        <th *ngFor="let column of displayedColumns">
          {{ column | transloco }}
        </th>
      </tr>
      <tr *ngFor="let row of data">
        <td *ngFor="let column of displayedColumns">
          {{ row[column] }}
        </td>
      </tr>
    </table>
  `
})
export class TableComponent {
  data = [
    { username: 'alex', password: '12345678' },
    { username: 'bob', password: 'password' }
  ];
  displayedColumns = [getText('username'), getText('password')];
}
