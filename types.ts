
export interface DropdownOption {
  t: string; // label
  d: number; // days for calculation
}

export interface ListItem {
  n: string; // name
  s?: string[]; // sub-tags
  l?: string[]; // list options
  t?: (DropdownOption | string)[]; // time options
  q?: string; // qualification
  type?: 'info' | 'res' | 'default';
  tag?: string;
  isDateRelevant?: boolean; // Flag for date inputs
}

export interface GatewayConfig {
  question: string;
  posLabel: string;
  negLabel: string;
}

export interface GroupData {
  title: string;
  tag?: string;
  risk?: string;
  requiresPrescription?: boolean; // Controls prescription toggle visibility
  gateway?: GatewayConfig; 
  r?: ListItem[]; 
  s?: ListItem[]; 
  res?: ListItem[]; 
  m?: ListItem[]; 
  aid?: ListItem[]; // Hilfs- und Heilmittel
}

export interface TopicFieldData {
  title: string;
  groups: GroupData[];
}

export interface DbSchema {
  [key: string]: TopicFieldData;
}

export interface ItemSelection {
  checked: boolean;
  isAutoSelected?: boolean; 
  subTags: string[]; 
  originVals: string[]; 
  detailVal: string; 
  timeVal: string; 
  timeDays: number; 
  roleVal: string; 
  gatewayVal?: boolean; 
  lastChangeDate?: string; 
  nextChangeDate?: string; // Calculated date for next change
  hasPrescription?: boolean; 
}

export type SelectionState = Record<string, ItemSelection>;

export interface NbaData {
    m1: number[]; 
    m2: number[]; 
    m3: number[]; 
    m4: number[]; 
    m5: number;   
    m6: number[]; 
}

export interface ClientData {
  name: string;
  dob: string;
  fieldB: string;
  pg: string; 
  repName: string; 
  repType: string;
  repScope: string;
  proxyStatus: string; 
  proxyScope: string;
  proxyStorage: string;
  livingWill: string; 
  livingWillStorage: string;
  evalDate: string;
  allergies: string[];
  allergyFood: string;
  cave: string[];
  diagnoses: string[]; 
  diagnosisSymptomSelection: Record<string, string[]>; 
  diagnosisMeasureSelection: Record<string, string[]>; 
  diagnosisConceptSelection: Record<string, string[]>; 
  nba?: NbaData; 
  // Modul 1: Gesprächssituation
  convPartner: string;
  convAtmosphere: string;
  convBarriers: string;
  convBarrierDetail: string;
}
