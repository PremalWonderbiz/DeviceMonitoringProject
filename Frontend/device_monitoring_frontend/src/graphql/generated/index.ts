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

export type InvestigateAlarmMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type InvestigateAlarmMutation = { __typename?: 'AlarmMutations', investigateAlarm: { __typename?: 'Alarm', id: any, sourceDeviceMacId: string, alarmState: string, isAcknowledged: boolean, acknowledgedFrom?: string | null, acknowledgedAt?: any | null, severity: string, message: string, raisedAt: any, alarmComment?: string | null } };

export type ResolveAlarmMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  comment: Scalars['String']['input'];
}>;


export type ResolveAlarmMutation = { __typename?: 'AlarmMutations', resolveAlarm: { __typename?: 'Alarm', id: any, sourceDeviceMacId: string, alarmState: string, isAcknowledged: boolean, acknowledgedFrom?: string | null, acknowledgedAt?: any | null, severity: string, message: string, raisedAt: any, alarmComment?: string | null } };

export type IgnoreAlarmMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
  comment: Scalars['String']['input'];
}>;


export type IgnoreAlarmMutation = { __typename?: 'AlarmMutations', ignoreAlarm: { __typename?: 'Alarm', id: any, sourceDeviceMacId: string, alarmState: string, isAcknowledged: boolean, acknowledgedFrom?: string | null, acknowledgedAt?: any | null, severity: string, message: string, raisedAt: any, alarmComment?: string | null } };

export type GetAlarmsQueryVariables = Exact<{
  filter: AlarmFilter;
}>;


export type GetAlarmsQuery = { __typename?: 'AlarmQueries', alarms: Array<{ __typename?: 'Alarm', id: any, sourceDeviceMacId: string, severity: string, message: string, raisedAt: any, alarmState: string, acknowledgedFrom?: string | null, isAcknowledged: boolean, acknowledgedAt?: any | null, alarmComment?: string | null }> };

export type GetLatestAlarmsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLatestAlarmsQuery = { __typename?: 'AlarmQueries', latestAlarms: { __typename?: 'LatestAlarms', totalAlarms: number, alarms: Array<{ __typename?: 'Alarm', id: any, sourceDeviceMacId: string, severity: string, message: string, raisedAt: any, alarmState: string, acknowledgedFrom?: string | null, isAcknowledged: boolean, acknowledgedAt?: any | null, alarmComment?: string | null }> } };

export type GetLatestAlarmForDeviceQueryVariables = Exact<{
  deviceMacId: Scalars['String']['input'];
}>;


export type GetLatestAlarmForDeviceQuery = { __typename?: 'AlarmQueries', latestAlarmForDevice: { __typename?: 'LatestAlarmForDevice', totalAlarms: number, alarm?: { __typename?: 'Alarm', id: any, sourceDeviceMacId: string, severity: string, message: string, raisedAt: any, alarmState: string, acknowledgedFrom?: string | null, isAcknowledged: boolean, acknowledgedAt?: any | null, alarmComment?: string | null } | null } };

export type GetAlarmStatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAlarmStatesQuery = { __typename?: 'AlarmQueries', alarmStates: Array<{ __typename?: 'AlarmState', id: number, name: string }> };


export const InvestigateAlarmDocument = gql`
    mutation InvestigateAlarm($id: UUID!) {
  investigateAlarm(id: $id) {
    id
    sourceDeviceMacId
    alarmState
    isAcknowledged
    acknowledgedFrom
    acknowledgedAt
    severity
    message
    raisedAt
    alarmComment
  }
}
    `;
export const ResolveAlarmDocument = gql`
    mutation ResolveAlarm($id: UUID!, $comment: String!) {
  resolveAlarm(id: $id, comment: $comment) {
    id
    sourceDeviceMacId
    alarmState
    isAcknowledged
    acknowledgedFrom
    acknowledgedAt
    severity
    message
    raisedAt
    alarmComment
  }
}
    `;
export const IgnoreAlarmDocument = gql`
    mutation IgnoreAlarm($id: UUID!, $comment: String!) {
  ignoreAlarm(id: $id, comment: $comment) {
    id
    sourceDeviceMacId
    alarmState
    isAcknowledged
    acknowledgedFrom
    acknowledgedAt
    severity
    message
    raisedAt
    alarmComment
  }
}
    `;
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
export const GetLatestAlarmsDocument = gql`
    query GetLatestAlarms {
  latestAlarms {
    totalAlarms
    alarms {
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
}
    `;
export const GetLatestAlarmForDeviceDocument = gql`
    query GetLatestAlarmForDevice($deviceMacId: String!) {
  latestAlarmForDevice(deviceMacId: $deviceMacId) {
    totalAlarms
    alarm {
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
}
    `;
export const GetAlarmStatesDocument = gql`
    query GetAlarmStates {
  alarmStates {
    id
    name
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    InvestigateAlarm(variables: InvestigateAlarmMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<InvestigateAlarmMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InvestigateAlarmMutation>({ document: InvestigateAlarmDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'InvestigateAlarm', 'mutation', variables);
    },
    ResolveAlarm(variables: ResolveAlarmMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ResolveAlarmMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResolveAlarmMutation>({ document: ResolveAlarmDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ResolveAlarm', 'mutation', variables);
    },
    IgnoreAlarm(variables: IgnoreAlarmMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<IgnoreAlarmMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<IgnoreAlarmMutation>({ document: IgnoreAlarmDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'IgnoreAlarm', 'mutation', variables);
    },
    GetAlarms(variables: GetAlarmsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAlarmsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAlarmsQuery>({ document: GetAlarmsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAlarms', 'query', variables);
    },
    GetLatestAlarms(variables?: GetLatestAlarmsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetLatestAlarmsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLatestAlarmsQuery>({ document: GetLatestAlarmsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetLatestAlarms', 'query', variables);
    },
    GetLatestAlarmForDevice(variables: GetLatestAlarmForDeviceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetLatestAlarmForDeviceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLatestAlarmForDeviceQuery>({ document: GetLatestAlarmForDeviceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetLatestAlarmForDevice', 'query', variables);
    },
    GetAlarmStates(variables?: GetAlarmStatesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GetAlarmStatesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAlarmStatesQuery>({ document: GetAlarmStatesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAlarmStates', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;