// @flow
//-----------------------------------------------------------------------------
// Types for Dashboard code
// Last updated 20.5.2024 for v2.0.0 by @jgclark
//-----------------------------------------------------------------------------

export type TSectionCode = 'DT' | 'DY' | 'DO' | 'W' | 'M' | 'Q' | 'OVERDUE' | 'TAG' | 'PROJ' // | 'COUNT' // where DT = today, DY = yesterday, TAG = Tag, PROJ = Projects section

export type TSectionDetails = { sectionCode: TSectionCode, sectionName: string, showSettingName: string }

// details for a section
export type TSection = {
  ID: number,
  name: string, // display name 'Today', 'This Week', 'This Month' ... 'Projects', 'Done'
  showSettingName: string, // setting for whether to hide this section
  sectionCode: TSectionCode,
  description: string,
  sectionItems: Array<TSectionItem>,
  FAIconClass?: string, // CSS class to show FA Icons
  sectionTitleClass: string, // CSS class
  sectionFilename?: string, // filename for relevant calendar (or not given if a non-calendar section)
  actionButtons?: Array<TActionButton>,
  generatedDate?: Date, // note different from lastFullRefresh on whole project
  totalCount?: number, // for when not all possible items are passed in pluginData
}

export type TItemType = 'open' | 'checklist' | 'congrats' | 'project' | 'filterIndicator'

// an item within a section, with optional TParagraphForDashboard
export type TSectionItem = {
  ID: string,
  itemType: TItemType,
  para?: TParagraphForDashboard /* where it is a paragraph-type item (not 'project') */,
  project?: TProjectForDashboard,
  // itemFilename: string /* of the note the task originally comes from (not the Calendar it might be referenced to) */,
  // itemNoteTitle?: string /* of the note the task originally comes from (not the Calendar it might be referenced to) */,
  // noteType: NoteType /* Notes | Calendar */,
}

// reduced paragraph definition
export type TParagraphForDashboard = {
  filename: string,
  noteType: NoteType /* Notes | Calendar */,
  title?: string, // not present for Calendar notes
  type: ParagraphType, // paragraph type
  prefix?: string,
  content: string,
  rawContent: string,
  priority: number,
  blockId?: string,
  timeStr?: string, // = timeblock
  startTime?: string,
  endTime?: string,
  changedDate?: Date, // required for sorting items in display
}

// a project item within a section
export type TProjectForDashboard = {
  // ID: string,
  // itemType: string /* open | checklist | congrats | review -- not paragraphType */,
  filename: string /* of the note the task originally comes from (not the Calendar it might be referenced to) */,
  title: string /* of the note the task originally comes from (not the Calendar it might be referenced to) */,
}

// details for a UI button
export type TActionButton = {
  display: string,
  actionPluginID: string,
  actionName: string,
  actionParam: string /* NB: all have to be passed as a string for simplicity */,
  postActionRefresh?: Array<TSectionCode>,
  tooltip: string,
}

export type TActionType =
  | 'addChecklist'
  | 'addTask'
  | 'completeTask'
  | 'completeTaskThen'
  | 'cancelTask'
  | 'completeChecklist'
  | 'cancelChecklist'
  | 'cyclePriorityStateUp'
  | 'cyclePriorityStateDown'
  | 'setNextReviewDate'
  | 'reviewFinished'
  | 'showNoteInEditorFromFilename'
  | 'showNoteInEditorFromTitle'
  | 'showLineInEditorFromFilename'
  | 'showLineInEditorFromTitle'
  | 'moveAllTodayToTomorrow'
  | 'moveAllYesterdayToToday'
  | 'moveFromCalToCal'
  | 'moveToNote'
  | 'onClickDashboardItem'
  | 'reactSettingsChanged'
  | 'refresh'
  | 'refreshSomeSections'
  | 'scheduleAllOverdueToday'
  | 'sharedSettingsChanged'
  | 'setSpecificDate'
  | '(not yet set)'
  | 'toggleType'
  | 'unknown'
  | 'unscheduleItem'
  | 'updateItemContent'
  | 'updateTaskDate'
// 'windowResized'

export type TControlString =
  | 't'
  | '+1d'
  | '+1b'
  | '+2d'
  | '+0w'
  | '+1w'
  | '+2w'
  | '+0m'
  | '+0q'
  | 'canceltask'
  | 'movetonote'
  | 'priup'
  | 'pridown'
  | 'tog'
  | 'ct'
  | 'unsched'
  | 'finish'
  | 'nr+1w'
  | 'nr+2w'
  | 'nr+1m'
  | 'nr+1q'

// for passing messages from React Window to plugin
export type MessageDataObject = {
  item?: TSectionItem, // optional because REFRESH doesn't need anything else
  // itemID?: string, // we think this isn't needed
  actionType: TActionType, // main verb (was .type)
  controlStr?: TControlString, // further detail on actionType
  updatedContent?: string, // where we have made an update in React window
  newSettings?: string, /* either reactSettings or sharedSettings depending on actionType */
  metaModifier?: any, /* probably not used */
  sectionCodes?: Array<TSectionCode>, // needed for processActionOnReturn to be able to refresh some but not all sections
  toFilename?: string, 
  // filename: string, // now in item
  // encodedFilename?: string, // now in item
  // content: string, // now in item
  // encodedContent?: string, // now in item
  // itemType?: string, // now in item
  // encodedUpdatedContent?: string,
}

/**
 * Each called function should use this standard return object
 */

export type TActionOnReturn = 'UPDATE_LINE_IN_JSON' | 'REMOVE_LINE_FROM_JSON' | 'REFRESH_SECTION_IN_JSON' | 'REFRESH_ALL_SECTIONS' | 'REFRESH_ALL_CALENDAR_SECTIONS'

export type TBridgeClickHandlerResult = {
  success: boolean,
  updatedParagraph?: TParagraph,
  actionsOnSuccess?: Array<TActionOnReturn>, // actions to perform after return
  sectionCodes?: Array<TSectionCode>, // needed for processActionOnReturn to be able to refresh some but not all sections
  errorMsg?: string,
}

export type TClickPosition = {
  clientX: number,
  clientY: number,
}

export type TDialogData = {
  isOpen: boolean,
  isTask?: boolean,
  clickPosition?: TClickPosition,
  details?: MessageDataObject
}

export type TReactSettings = {
  filterPriorityItems?: boolean,
  timeblockMustContainString?: string,
  ignoreChecklistItems?: boolean,
  hideDuplicates?: boolean,
  rescheduleNotMove: boolean, // TODO: finish wiring me up
  lastChange?: string /* settings will be sent to plugin for saving unless lastChange starts with underscore */,
  dialogData?: TDialogData,
  refreshing?: boolean,
  [key: string]: any,
}

export type TPluginData = {
  settings: any, /* plugin settings, includes stringified sharedSettings */
  refreshing?: Array<TSectionCode> | boolean, /* true if all, or array of sectionCodes if some */
  sections: Array<TSection>,
  lastFullRefresh: Date, /* localized date string new Date().toLocaleString() */
  themeName: string, /* the theme name used when generating the dashboard */
  platform: string, /* the platform used when generating the dashboard */
  demoMode: boolean, /* generate fake content */
  doneCount?: number,
}

export type TSharedSettings = {
  //TODO: jgclark: add the specific shared settings
  [key: string]: any,
}

// Feature flags for trying out features without other users seeing them
// FeatureFlags are stored in the DataStore.settings.featureFlags JSON string
export type FeatureFlags = {
  autoRefresh: boolean,
  overdueProcessing: boolean,
  metaTooltips: boolean
}