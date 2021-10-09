export interface OverrideTypes {
  matureLanguageFilter: boolean;
  postMustContainSecurity: boolean;
}

export const initialState = {
  matureLanguageFilter: true,
  postMustContainSecurity: false
} as OverrideTypes;
