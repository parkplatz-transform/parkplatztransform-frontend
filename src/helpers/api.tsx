import * as Sentry from '@sentry/react'
import { ALIGNMENT, ALTERNATIVE_USAGE_REASON, NO_PARKING_REASONS_AND_LABEL, STREET_LOCATION } from '../app/recording/Subsegments';
import { PermissionsError } from './errors'

const baseURL = process.env.REACT_APP_API_URL || ''


export interface SegmentCollection {
  type:     string;
  features: Segment[];
}
export interface Segment {
  type:       string;
  geometry:   Geometry;
  properties: Properties;
  id:         string;
  bbox:       number[];
}

export interface Geometry {
  coordinates: Array<number[]>;
  type:        string;
}

export interface Properties {
  subsegments:      Subsegment[];
  has_subsegments:  boolean;
  owner_id:         string;
  data_source:      string;
  further_comments: string | null;
  modified_at:      Date;
  created_at:       Date;
}

export interface Subsegment {
  id: string | null;
  parking_allowed:            boolean;
  order_number:               number | null;
  length_in_meters:           number | null;
  car_count:                  number | null;
  quality:                    number;
  fee:                        boolean | null;
  street_location:            STREET_LOCATION | null;
  marked:                     boolean | null;
  alignment:                  ALIGNMENT | null;
  duration_constraint:        boolean | null;
  user_restriction:           boolean | null;
  user_restriction_reason:    null | string;
  alternative_usage_reason:   ALTERNATIVE_USAGE_REASON | null;
  time_constraint:            boolean | null;
  time_constraint_reason:     null | string;
  duration_constraint_reason: string | null;
  no_parking_reasons:         NO_PARKING_REASONS_AND_LABEL[];
}

export interface LoginRequest {
  email: string;
  accepted_terms_and_conditions: boolean;
}

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  usersData: `${baseURL}/users/me/`,
  usersLogout: `${baseURL}/users/logout/`,
  segments: `${baseURL}/segments/`,
  querySegment: `${baseURL}/query-segments/`,
  clusters: `${baseURL}/clusters/`,
}

export const headers = () => new Headers({
  'Content-Type': 'application/json',
})

async function withErrorHandling(response: any) {
  const json = await response.json()
  if (response.status === 401) {
    throw new PermissionsError("Unauthorized")
  }
  if (response.status === 403) {
    throw new PermissionsError("Insufficient permissions")
  }
  else if (!response.ok) {
    if (typeof json.detail === "string") {
      console.error(json.detail)
    } else {
      json.detail.forEach((error: Error) => {
        console.error(error)
      })
    }
    Sentry.captureEvent(json.detail)
    throw new Error(json.detail)
  }
  return json
}

export async function postSegment(segment: Segment) {
  const response = await fetch(routes.segments, {
    method: 'POST',
    headers: headers(),
    credentials: 'include',
    body: JSON.stringify(segment),
  })
  return withErrorHandling(response)
}

export async function getUserData() {
  try {
    const response = await fetch(routes.usersData, { credentials: 'include', headers: headers() })
    if (response.ok) {
      return response.json()
    }
    return null
  } catch {
    return null
  }
}

export async function loginUser(payload: LoginRequest) {
  try {
    const response = await fetch(routes.users, { 
      credentials: 'include', 
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload)
    })
    if (response.ok) {
      return response.json()
    }
    return null
  } catch {
    return null
  }
}

export async function logoutUser() {
  try {
    const response = await fetch(routes.usersLogout, { credentials: 'include', method: 'POST', headers: headers() })
    if (response.ok) {
      return response.json()
    }
    return null
  } catch {
    return null
  }
}

export async function getAllSegments() {
  const url = routes.segments
  const response = await fetch(`${url}`, {
    headers: headers()
  })
  return withErrorHandling(response)
}

/*
* details = true means all subsegments are fetched with segments,
* a future optimisation would be to not fetch this and return a count from the server.
*/
export async function getSegments(boundingBox = null, excludedIds: string[], modified_after: Date): Promise<SegmentCollection> {
  const url = routes.querySegment

  const params: { 
    details: boolean;
    bbox: string | null;
    exclude_ids: string[] | null;
    include_if_modified_after: Date | null;
  } = {
    details: false,
    bbox: null,
    exclude_ids: null,
    include_if_modified_after: null
  }
  if (boundingBox) {
    params.bbox = boundingBox
  }
  if (excludedIds) {
    params.exclude_ids = excludedIds
  }
  if (modified_after) {
    params.include_if_modified_after = modified_after
  }
  const response = await fetch(`${url}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(params)
  })
  return withErrorHandling(response)
}

export async function getSegment(segmentId: string): Promise<Segment> {
  const response = await fetch(`${routes.segments}${segmentId}/`, {
    headers: headers(),
  })
  return withErrorHandling(response)
}

export async function deleteSegment(segmentId: string) {
  const response = await fetch(`${routes.segments}${segmentId}/`, {
    method: 'DELETE',
    headers: headers(),
    credentials: 'include',
  })
  return withErrorHandling(response)
}

export async function updateSegment(segment: Segment): Promise<Segment> {
  const response = await fetch(`${routes.segments}${segment.id}/`, {
    method: 'PUT',
    headers: headers(),
    credentials: 'include',
    body: JSON.stringify(segment)
  })
  return withErrorHandling(response)
}

