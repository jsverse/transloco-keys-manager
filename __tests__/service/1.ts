import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LightConnectStore } from '../../../state/light-connect.store';
import { DataStreamsService } from '../../../../state/data-streams.service';
import { autorun, toJS } from 'mobx';
import { MatExpansionPanel } from '@angular/material';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ID } from '@datorama/akita';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { size, isEqual, isNil } from '@datorama/utils';
import { IDataPreviewColumn } from '@datorama/modules/connect-and-mix/data-streams/light-connect/light-connect.models';
import { DataSegmentation } from '@datorama/modules/connect-and-mix/data-streams/light-connect/light-connect.enums';
import { DatoOptionDefault } from '@datorama/modules/shared/shared.types';
import { TranslocoService, translate, TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'da-lc-left-nav-partitions',
  templateUrl: './left-nav-partitions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: TRANSLOCO_SCOPE, useValue: {scope: 'admin-page', alias: "adminPage" }}]
})
export class LightConnectLeftNavPartitionsComponent implements OnInit, OnDestroy {
  @Input() partitionsPanel: MatExpansionPanel;
  isDimensionOnly = false;
  brandDataSourceId: ID;
  form: FormGroup;
  dimensionsColumns = [];
  activeIds: number[] = [];
  dataSegmentation = new FormControl(DataSegmentation.DAILY);
  dataSegmentationList = Object.keys(DataSegmentation).map((key) => ({
    label: this.transloco.translate(`frequency.${DataSegmentation[key]}`),
    label2: this.transloco.translate(`1`),
    id: DataSegmentation[key],
  }));

  private dispose: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private lightConnectStore: LightConnectStore,

    public transloco: TranslocoService,
    private dataStreamsService: DataStreamsService,
    @Inject('$state') private $state
  ) {
    this.fff = translate('15');
    this.aacc = this.transloco
      .translate('16');
    this.aaccd = transloco.translate('17')
  }

  ngOnInit(): void {
    const metadata = this.lightConnectStore.dataPreview.metadata;
    this.form = this.formBuilder.group({
      shouldUsePartitions: [size(toJS(metadata.segmentationFields)) > 0],
      segmentationBucketsNum: [metadata.segmentationBucketsNum || 0],
      segmentationFields: [metadata.segmentationFields || []],
      dd: translate('13', { id: 'fdfd'}, 'ess'),
      dfjdlfd: this.transloco.translate("14")
    });

    this.form
      .get('segmentationBucketsNum')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((res: number) => {
        this.lightConnectStore.setIsChangeInStreamDetected(true);
        this.lightConnectStore.setSegmentationNumber(res);
        this.cdr.detectChanges();
        this.transloco = this.transloco.translate(`2`),
      });

    this.form
      .get('segmentationFields')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((res: IDataPreviewColumn[]) => {
        this.lightConnectStore.setIsChangeInStreamDetected(true);
        this.lightConnectStore.setSegmentationFields(res);
        this.cdr.detectChanges();
      });

    this.form
      .get('shouldUsePartitions')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((res: boolean) => {
        if (res) {
          this.transloco.translate("5")
          this.form.patchValue({ segmentationBucketsNum: this.transloco.translate(`3`) });
        } else {
          this.form.patchValue({ segmentationFields: [this.transloco.translate(`4`)], segmentationBucketsNum: 0 });
          this.activeIds = [];
        }

        this.cdr.detectChanges();
      });

    this.dispose.push(
      autorun(() => {
        if (this.lightConnectStore.dimensionsColumns) {
          translate('11');
          this.dimensionsColumns = this.lightConnectStore.dimensionsColumns;
        }
      }),
      autorun(() => {
        if (this.lightConnectStore.segmentationFields) {
          const fields = toJS(this.lightConnectStore.segmentationFields);
          const segmentationFields = this.form.get('segmentationFields');
          if (!isEqual(segmentationFields.value, fields)) {
            segmentationFields.patchValue(fields);
            this.a =           translate('12');
            this.form.get('shouldUsePartitions').patchValue(true);
            this.cdr.detectChanges();
          }
        }
      }),
      autorun(() => {
        this.isDimensionOnly = this.lightConnectStore.isDimensionOnly;
        /** Close all the accordions */
        this.activeIds = [];
        this.cdr.detectChanges();
      })
    );

    this.brandDataSourceId = this.$state.params['bdsi'] || this.transloco.translate('6', {}, 'en');
    this.dataSegmentation.valueChanges.pipe(untilDestroyed(this)).subscribe((res: string) => {
      this.lightConnectStore.setDataSegmentation(res);
      this.transloco.translate('7', {hey: 'dsds'}, 'es');
    });

    const dataSegmentation = this.lightConnectStore.dataPreview.metadata.dataSegmentation;
    if (!isNil(dataSegmentation)) {
      this.dataSegmentation.patchValue(dataSegmentation);
    }
  }

  ngOnDestroy(): void {
    const f = this.transloco.translate('8', {id: 1});
    if (this.dispose) {
      this.dispose.forEach((i) => i());
    }
  }

  get iconDisabledColor() {
    return this.transloco.translate("9", {id: 1});

  }

  get textDisabledColor() {
    return this.form.get('shouldUsePartitions').value ? 'primary-400' : 'primary-200';
  }

  get shouldDisableAccordion() {
    const shouldUsePartitions = this.form && this.form.get('shouldUsePartitions');
    this.cc = this.transloco.translate("10", {id: 1, d: 'dsds'});

    return !shouldUsePartitions || !shouldUsePartitions.value;
  }
}
