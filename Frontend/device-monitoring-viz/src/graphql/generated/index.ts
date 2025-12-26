import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type Alarm = {
  __typename?: 'Alarm';
  acknowledgedAt?: Maybe<Scalars['DateTime']['output']>;
  /** User or system that acknowledged the alarm */
  acknowledgedFrom?: Maybe<Scalars['String']['output']>;
  alarmComment?: Maybe<Scalars['String']['output']>;
  alarmState: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  isAcknowledged: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  raisedAt: Scalars['DateTime']['output'];
  severity: Scalars['String']['output'];
  sourceDeviceMacId: Scalars['String']['output'];
};

export type AlarmFilter = {
  /** List of device MAC IDs */
  devices?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Start and end date range */
  filterDateRange?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type AlarmMutations = {
  __typename?: 'AlarmMutations';
  ignoreAlarm: Alarm;
  investigateAlarm: Alarm;
  resolveAlarm: Alarm;
};


export type AlarmMutationsIgnoreAlarmArgs = {
  comment: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
};


export type AlarmMutationsInvestigateAlarmArgs = {
  id: Scalars['UUID']['input'];
};


export type AlarmMutationsResolveAlarmArgs = {
  comment: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
};

export type AlarmQueries = {
  __typename?: 'AlarmQueries';
  alarmStates: Array<AlarmState>;
  alarms: Array<Alarm>;
  alarmsByDeviceId: Array<Alarm>;
  latestAlarmForDevice: LatestAlarmForDevice;
  latestAlarms: LatestAlarms;
};


export type AlarmQueriesAlarmsArgs = {
  filter: AlarmFilter;
};


export type AlarmQueriesAlarmsByDeviceIdArgs = {
  deviceMacId: Scalars['String']['input'];
};


export type AlarmQueriesLatestAlarmForDeviceArgs = {
  deviceMacId: Scalars['String']['input'];
};

export type AlarmState = {
  __typename?: 'AlarmState';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type LatestAlarmForDevice = {
  __typename?: 'LatestAlarmForDevice';
  /** Most recent alarm for the device */
  alarm?: Maybe<Alarm>;
  /** Total alarms raised for the device */
  totalAlarms: Scalars['Int']['output'];
};

export type LatestAlarms = {
  __typename?: 'LatestAlarms';
  /** Most recent alarms */
  alarms: Array<Alarm>;
  /** Total number of alarms in the system */
  totalAlarms: Scalars['Int']['output'];
};

export type GetAlarmsQueryVariables = Exact<{
  filter: AlarmFilter;
}>;


export type GetAlarmsQuery = { __typename?: 'AlarmQueries', alarms: Array<{ __typename?: 'Alarm', id: any, sourceDeviceMacId: string, severity: string, message: string, raisedAt: any, alarmState: string, acknowledgedFrom?: string | null, isAcknowledged: boolean, acknowledgedAt?: any | null, alarmComment?: string | null }> };

export type GetAlarmsV2QueryVariables = Exact<{
  filter: AlarmFilter;
}>;


export type GetAlarmsV2Query = { __typename?: 'AlarmQueries', alarms: Array<{ __typename?: 'Alarm', id: any, sourceDeviceMacId: string, message: string }> };


export const GetAlarmsDocument = gql`
    query GetAlarms($filter: AlarmFilter!) {
  alarms(filter: $filter) {
    id
    sourceDeviceMacId
    severity
    message
    raisedAt
    alarmState
    acknowledgedFrom
    isAcknowledged
    acknowledgedAt
    alarmComment
  }
}
    `;
export const GetAlarmsV2Document = gql`
    query GetAlarmsV2($filter: AlarmFilter!) {
  alarms(filter: $filter) {
    id
    sourceDeviceMacId
    message
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetAlarms(variables: GetAlarmsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAlarmsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAlarmsQuery>({ document: GetAlarmsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAlarms', 'query', variables);
    },
    GetAlarmsV2(variables: GetAlarmsV2QueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAlarmsV2Query> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAlarmsV2Query>({ document: GetAlarmsV2Document, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAlarmsV2', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;