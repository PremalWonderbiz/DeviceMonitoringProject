export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  health: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  alarmPanelUpdates: Scalars['String']['output'];
  alarmUpdates: Scalars['String']['output'];
  deviceGroupUpdates: Scalars['String']['output'];
  deviceUpdates: Scalars['String']['output'];
  propertyPanelAlarmUpdates: Scalars['String']['output'];
};


export type SubscriptionDeviceGroupUpdatesArgs = {
  deviceId: Scalars['String']['input'];
};


export type SubscriptionPropertyPanelAlarmUpdatesArgs = {
  deviceId: Scalars['String']['input'];
};

export type AlarmPanelUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AlarmPanelUpdatesSubscription = { __typename?: 'Subscription', alarmPanelUpdates: string };

export type AlarmUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AlarmUpdatesSubscription = { __typename?: 'Subscription', alarmUpdates: string };

export type PropertyPanelAlarmUpdatesSubscriptionVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type PropertyPanelAlarmUpdatesSubscription = { __typename?: 'Subscription', propertyPanelAlarmUpdates: string };

export type DeviceUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type DeviceUpdatesSubscription = { __typename?: 'Subscription', deviceUpdates: string };

export type DeviceDetailUpdatesSubscriptionVariables = Exact<{
  deviceId: Scalars['String']['input'];
}>;


export type DeviceDetailUpdatesSubscription = { __typename?: 'Subscription', deviceGroupUpdates: string };
