import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { ModalService } from '@mm-modals/mm-modal/mm-modal';
import { GlobalActions } from '@mm-actions/global';
import { ReportsActions } from '@mm-actions/reports';
import { Selectors } from '@mm-selectors/index';

@Component({
  selector: 'mm-actionbar',
  templateUrl: './actionbar.component.html'
})
export class ActionbarComponent implements OnInit, OnDestroy {
  @Input() nonContactForms = []; // ToDo Reports: should be ordered by 'title'
  private subscription: Subscription = new Subscription();
  private globalActions;
  private reportsActions;

  currentTab;
  selectMode;
  selectedReportsDocs = [];
  actionBar;
  isAdmin;
  showActionBar;
  loadingContent;
  loadingSubActionBar;
  selectedContactDoc;

  constructor(
    private store: Store,
    private modalService: ModalService,
  ) {
    this.globalActions = new GlobalActions(store);
    this.reportsActions = new ReportsActions(store);
  }

  ngOnInit(): void {
    const subscription = combineLatest(
      this.store.select(Selectors.getActionBar),
      this.store.select(Selectors.getCurrentTab),
      this.store.select(Selectors.getIsAdmin),
      this.store.select(Selectors.getLoadingContent),
      this.store.select(Selectors.getLoadingSubActionBar),
      this.store.select(Selectors.getSelectMode),
      this.store.select(Selectors.getShowActionBar),
    )
    .subscribe(([
      actionBar,
      currentTab,
      isAdmin,
      loadingContent,
      loadingSubActionBar,
      selectMode,
      showActionBar
    ]) => {
      this.currentTab = currentTab;
      this.selectMode = selectMode;
      this.actionBar = actionBar;
      this.isAdmin = isAdmin;
      this.showActionBar = showActionBar;
      this.loadingContent = loadingContent;
      this.loadingSubActionBar = loadingSubActionBar;
      /* ToDo: enable these once reports and contact features completed.
      this.selectedReportsDocs = selectedReportsDocs;
      this.selectedContactDoc = selectedContactDoc;
       */
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setSelect(selectMode) {
    this.reportsActions.setSelect(selectMode);
  }

  selectAll() {
    this.reportsActions.selectAll();
  }

  deselectAll() {
    this.reportsActions.deselectAll();
  }

  verifyReport(reportIsVerified) {
    this.reportsActions.verifyReport(reportIsVerified);
  }

  toggleVerifyingReport() {
    this.reportsActions.toggleVerifyingReport();
  }

  launchEditFacilityDialog() {
    this.reportsActions.launchEditFacilityDialog();
  }

  deleteDoc(doc) {
    this.globalActions.deleteDocConfirm(doc);
  }

  bulkDelete(docs) {
    if (!docs) {
      console.warn('Trying to delete empty object', docs);
      return;
    }

    if (!docs.length) {
      console.warn('Trying to delete empty array', docs);
      return;
    }

    /* ToDo: Display modal once delete feature is ready in Reports
    this.modalService.show(BulkDeleteConfirmComponent, {
      initialState: { docs }
    });
    */
  }
}