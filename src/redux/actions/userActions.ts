import {Action, Dispatch} from 'redux';
import {ThunkAction} from '@reduxjs/toolkit';
import {updatePreference} from '../../api/userAPI';
import {Holdings, HoldingSummary} from '../../types/transaction';
import {
    DashboardPreferences,
    DEFAULT_COLUMNS,
    DevicePreferences,
    Preferences,
    THEME
} from '../../types/userPreferences';
import {RootState} from '../reducers/rootReducer';
import {UserInformation} from '../../types/user';

export type UserAction =
    | {type: 'UPDATE_USER_INFORMATION'; payload: UserInformation}
    | {type: 'UPDATE_HOLDING_SUMMARY'; payload: HoldingSummary}
    | {type: 'UPDATE_USER_HOLDINGS'; payload: Holdings}
    | {type: 'UPDATE_THEME_PREFERENCES'; payload: THEME}
    | {type: 'UPDATE_USER_PREFERENCES'; payload: Preferences}
    | {type: 'UPDATE_MOBILE_PREFERENCES'; payload: DevicePreferences}
    | {type: 'UPDATE_COMPUTER_PREFERENCES'; payload: DevicePreferences}
    | {type: 'UPDATE_MOBILE_DASHBOARD_PREFERENCES'; payload: DashboardPreferences}
    | {type: 'UPDATE_COMPUTER_DASHBOARD_PREFERENCES'; payload: DashboardPreferences}
    | {type: 'UPDATE_MOBILE_DASHBOARD_VISIBLE_COLUMN_PREFERENCES'; payload: DEFAULT_COLUMNS[]}
    | {type: 'UPDATE_COMPUTER_DASHBOARD_VISIBLE_COLUMN_PREFERENCES'; payload: DEFAULT_COLUMNS[]};

export const updateUserInformation = (payload: UserInformation): UserAction => ({
    type: 'UPDATE_USER_INFORMATION',
    payload
});

export const updateHoldingSummary = (payload: HoldingSummary): UserAction => ({
    type: 'UPDATE_HOLDING_SUMMARY',
    payload
});

export const updateUserHoldings = (payload: Holdings): UserAction => ({
    type: 'UPDATE_USER_HOLDINGS',
    payload
});

export const updateThemePreferences = (payload: THEME): UserAction => ({
    type: 'UPDATE_THEME_PREFERENCES',
    payload
});

export const updateUserPreferences = (payload: Preferences): UserAction => ({
    type: 'UPDATE_USER_PREFERENCES',
    payload
});

export const updateMobilePreferences = (payload: DevicePreferences): UserAction => ({
    type: 'UPDATE_MOBILE_PREFERENCES',
    payload
});

export const updateComputerPreferences = (payload: DevicePreferences): UserAction => ({
    type: 'UPDATE_COMPUTER_PREFERENCES',
    payload
});

export const updateMobileDashboardPreferences = (payload: DashboardPreferences): UserAction => ({
    type: 'UPDATE_MOBILE_DASHBOARD_PREFERENCES',
    payload
});

export const updateComputerDashboardPreferences = (payload: DashboardPreferences): UserAction => ({
    type: 'UPDATE_COMPUTER_DASHBOARD_PREFERENCES',
    payload
});

export const updateComputerDashboardVisibleColumnPreferences = (payload: DEFAULT_COLUMNS[]): UserAction => ({
    type: 'UPDATE_COMPUTER_DASHBOARD_VISIBLE_COLUMN_PREFERENCES',
    payload
});

export const updateMobileDashboardVisibleColumnPreferences = (payload: DEFAULT_COLUMNS[]): UserAction => ({
    type: 'UPDATE_MOBILE_DASHBOARD_VISIBLE_COLUMN_PREFERENCES',
    payload
});

type DeviceType = 'mobile' | 'computer';

const updateDashboardPreferencesThunk = (
    device: DeviceType,
    newDashboardPreference: DashboardPreferences,
    updateAction: (payload: DashboardPreferences) => UserAction
): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
    return async (dispatch: Dispatch<any>, getState: () => RootState) => {
        try {
            const currentPreferences = getState().user.preferences;
            const updatedPreferences = {
                ...currentPreferences,
                [device]: {
                    ...currentPreferences[device],
                    dashboard: newDashboardPreference
                }
            };
            await updatePreference(updatedPreferences);
            dispatch(updateAction(newDashboardPreference));
        } catch (error) {
            console.error(`Failed to update ${device} Dashboard preferences:`, error);
        }
    };
};

export const updateMobileDashboardPreferencesThunk = (
    newDashboardPreference: DashboardPreferences
): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
    return updateDashboardPreferencesThunk('mobile', newDashboardPreference, updateMobileDashboardPreferences);
};

export const updateComputerDashboardPreferencesThunk = (
    newDashboardPreference: DashboardPreferences
): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
    return updateDashboardPreferencesThunk('computer', newDashboardPreference, updateComputerDashboardPreferences);
};

export const updateThemePreferencesThunk = (theme: THEME) => {
    return async (dispatch: Dispatch<any>, getState: () => RootState) => {
        try {
            dispatch(updateThemePreferences(theme));
            const currentPreferences = getState().user.preferences;
            const updatedPreferences = {
                ...currentPreferences,
                theme
            } as Preferences;
            await updatePreference(updatedPreferences);
        } catch (error) {
            console.error('Failed to update theme preferences:', error);
        }
    };
};

export const updatePreferencesOnlineThunk = (): ThunkAction<Promise<void>, RootState, unknown, Action<string>> => {
    return async (dispatch: Dispatch<any>, getState: () => RootState) => {
        try {
            const currentPreferences = getState().user.preferences;
            await updatePreference(currentPreferences);
        } catch (error) {
            console.error('Failed to update preferences:', error);
        }
    };
};
