import { marker as _ } from 'ngx-translate-extract-marker';

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
    { username2: 'alex', password2: '12345678' },
    { username2: 'bob', password2: 'password' }
  ];
  displayedColumns = [_('username2'), _('password2')];
}
