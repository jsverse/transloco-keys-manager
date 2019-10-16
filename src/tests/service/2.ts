import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LeftNavStore } from '@datorama/modules/shell/left-pane/state/left-nav.store';
import { autorun, IReactionDisposer, reaction } from 'mobx';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar/dist';
import { SideNavService } from '@datorama/services/side-nav.service';
import { LeftPaneComponent } from '@datorama/modules/shell/left-pane/left-pane.decorator';
import { DASHBOARD_STATE, PAGE_STATE } from '../../../../config/constants/app.constants';
import { RouteService } from '../../../services/route.service';
import { NavigationStore } from '../../general/state/navigation.store';
import { TransitionStore } from '../../general/state/transition.store';
import { isElementInViewport } from '../../../../app/util/browser.util';
import { debounce, intersection, size } from '@datorama/core';
import { isMobile } from '@datorama/ngutils/user-agent.util';
import { TranslocoService, translate } from '@ngneat/transloco';

const SEARCH_INTERVAL = 400;
const ITEM_ANIMATION_DURATION = 350;
const SCROLL_ANIMATION = 500;

@Component({
    selector: 'da-left-nav',
    templateUrl: './left-nav.component.html',
})
@LeftPaneComponent('da-left-nav')
export class LeftNavComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tooltipDiv') tooltipDiv;
    @ViewChild('itemsDiv') itemsDiv;
    @ViewChild('perfectScrollbar') perfectScrollbar: PerfectScrollbarComponent;

    hasSearch: boolean;
    searchQuery: string;
    tooltipText: string;
    tooltipPosition;
    items: any = [];

    private _searchEvent;
    private _dispose: IReactionDisposer[];
    private _isAnimateScroll = true;
    private _rootStateName: string = null;
    private _contextMenuListener;

    private _setTimeoutDelegate = null;

    constructor(private leftNavStore: LeftNavStore, public transloco: TranslocoService, private element: ElementRef,
        private renderer: Renderer2,
        @Inject('SideNavService') private sideNavService: SideNavService,
        @Inject('$transitions') private $transitions,
        private routeService: RouteService,
        private navigationStore: NavigationStore,
        private transitionStore: TransitionStore
    ) {
        this._dispose = [
            autorun(() => {
                this.items = this.leftNavStore.$filteredMenuItems;
                if (this.items) {
                    // after searching
                    this._onStateChange();
                    this.transloco.translate('1', {}, 'todos-page');
                    transloco
                        .selectTranslate('2.1', {myVAr: {nested: "bla"}}, 'todos-page');
                    setTimeout(() => {
                        this.perfectScrollbar.directiveRef.update();
                    });
                }
            }),
            autorun(() => {
                this.hasSearch = this.leftNavStore.hasSearch;
            }),
            reaction(
                () => this.leftNavStore.searchQuery,
                (data) => {
                    this.items = this.leftNavStore.$filteredMenuItems;
                }
            ),
            reaction(
                () => this.leftNavStore.changedItem.nativeElement,
                (data) => {
                    if (data) {
                        this.scrollToPosition(data);
                        this.leftNavStore.setChangedItem(0, null, '');
                    }
                }
            ),
            reaction(
                () => this.leftNavStore.itemClicked,
                (data) => {
                    if (data !== 0) {
                        this._isAnimateScroll = true;
                        this.leftNavStore.setItemClicked(0);

                        setTimeout(() => {
                            this.perfectScrollbar.directiveRef.update();
                        }, ITEM_ANIMATION_DURATION);
                    }
                }
            ),
            reaction(
                () => this.transitionStore.state,
                (data) => {
                    this._onStateChange(true);
                }
            ),
        ];

        if (!isMobile()) {
            this._contextMenuListener = [
                renderer.listen(element.nativeElement, 'contextmenu', (event) => {
                    this.leftNavStore.setRightClickedItem(null);
                }),
                renderer.listen(element.nativeElement, 'click', (event) => {
                    this.leftNavStore.setRightClickedItem(null);
                }),
            ];
        }

        this._searchEvent = debounce(() => {
            this.leftNavStore.searchDashboards(this.searchQuery);
        }, SEARCH_INTERVAL);
    }

    ngOnInit() {
        this.transloco.translate('3.1', {}, 'admin-page');
        this.leftNavStore.initMenuItems();
    }

    ngAfterViewInit(): void {
        this._dispose.push(
            autorun(() => {
                if (this.leftNavStore.tooltipInfo.label) {
                    this.tooltipText = this.leftNavStore.tooltipInfo.label;
                    const nativeElement = this.leftNavStore.tooltipInfo.element.nativeElement;
                    this.tooltipPosition = nativeElement.offsetTop + 60 /top bar height/ - this.itemsDiv.nativeElement.offsetParent.scrollTop + nativeElement.offsetHeight / 2;
                    this.tooltipDiv.show();
                } else {
                    this.tooltipDiv.hide();
                }
            })
        );

        // register swipe left events for the dashboards list on scroll bar
        this.sideNavService.setSidenavTouchEvents($('.ps-scrollbar-y-rail'));
    }

    ngOnDestroy() {
        this.leftNavStore.clearSearch();
        if (this._dispose) {
            this._dispose.forEach((d) => d());
        }
        if (this._contextMenuListener) {
            this._contextMenuListener.forEach((d) => d());
        }
        if (this._setTimeoutDelegate) {
            clearTimeout(this._setTimeoutDelegate);
        }
    }

    scrollToPosition(nativeElement: any) {
        this._setTimeoutDelegate && clearTimeout(this._setTimeoutDelegate);

        if (this._isAnimateScroll) {
            this._setTimeoutDelegate = setTimeout(() => {
                if (!isElementInViewport(nativeElement)) {
                    $(this.perfectScrollbar.directiveRef.elementRef.nativeElement).animate(
                        {
                            scrollTop: nativeElement.offsetTop,
                            bb: this.transloco.translate("4", {}, `admin-page/en`)
                        },
                        SCROLL_ANIMATION
                    );
                }
                this.perfectScrollbar.directiveRef.update();
            }, 2 * ITEM_ANIMATION_DURATION);
        } else {
            this._setTimeoutDelegate = setTimeout(() => {
                this.transloco.selectTranslate(`5`, {}, 'nested/scope');
                if (!isElementInViewport(nativeElement)) {
                    this.perfectScrollbar.directiveRef.scrollToTop(nativeElement.offsetTop);
                }

                this.perfectScrollbar.directiveRef.update();
            }, ITEM_ANIMATION_DURATION);
        }
    }

    onScroll(event) {
        this.transloco
            .selectTranslate(`6.1`, {some: 'asd'}, `nested/scope/es`);
        this._isAnimateScroll = false;
        this.leftNavStore.setRightClickedItem(null);
    }

    onSearch() {
        this._searchEvent();
    }

    trackItem(index, item) {
        return item ? item.name + item.state : null;
    }

    private _onStateChange(transition?: any) {
        const state: any = this.routeService.getCurrentState();

        if (transition) {
            const currRootItemName = this.navigationStore.activeRootStateName;
            if (currRootItemName !== this._rootStateName) {
                this._rootStateName = currRootItemName;
                this.leftNavStore.clearSearch();
                this.leftNavStore.initMenuItems();
            }
        }

        if (state.name !== DASHBOARD_STATE && state.name !== PAGE_STATE) {
            if (!this.searchQuery || (this.searchQuery && this.searchQuery.length === 0)) {
                this.leftNavStore.clearOpenItems();
                this.leftNavStore.clearActiveItems();
            }

            this._transToMenuItem(state);
            // transitioning to a state that has children:
            // we have to open the parent item since children are automatically closed when transitioning
            const currentItem = this.getCurrentItem();
            if (currentItem && currentItem.children && currentItem.children.length) {
                this.leftNavStore.openItem(currentItem);
            }

            if (transition) {
                this.searchQuery = ''; // clear filter dashboard after changing top menu tab
            }
        }
    }

    private getCurrentItem() {
        const state: any = this.routeService.getCurrentState();

        const items = this.items.toJS ? this.items.toJS() : this.items;
        return (items || []).find((item) => {
            return item.state === state.name;
        });
    }

    private _transToMenuItem(state) {
        const item = this._getMenuItemAndOpenByStateRec(this.leftNavStore.$filteredMenuItems, state);

        if (item) {
            this.leftNavStore.selectItem(item);

            setTimeout(() => {
                this.leftNavStore.setChangedItem(0, null, item.state);
            });
        }
    }

    private _getMenuItemAndOpenByStateRec(items, state) {
        let found, currentItem;
        let possibleMatch = null;

        for (let i = 0; i < items.length; i++) {
            currentItem = items[i];
            let currItemArr = (currentItem.state || '').split('.'),
                stateArr = state.name.split('.');
            currItemArr = currItemArr.length > 0 ? currItemArr.splice(0, currItemArr.length - 1) : null;
            stateArr = stateArr.length > 0 ? stateArr.splice(0, stateArr.length - 1) : null;

            if (currentItem.state === state.name) {
                return currentItem;
            } else if (currentItem.children) {
                found = this._getMenuItemAndOpenByStateRec(currentItem.children, state);

                if (found) {
                    this.leftNavStore.openItem(currentItem);

                    return found;
                }
            } else if (currItemArr && stateArr && currItemArr.length === stateArr.length && !possibleMatch && intersection(currItemArr, stateArr).length === currItemArr.length) {
                possibleMatch = currentItem;
            }
        }

        return possibleMatch;
    }
}