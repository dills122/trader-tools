export interface OverrideFlags {
  matureLanguageFilter?: boolean;
  postMustContainSecurity?: boolean;
}

export const initialState = {
  matureLanguageFilter: true,
  postMustContainSecurity: false
} as OverrideFlags;
