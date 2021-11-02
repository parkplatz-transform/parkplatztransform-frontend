import * as Sentry from '@sentry/react'
import { PermissionsError } from './errors'

const baseURL = process.env.REACT_APP_API_URL || ''

const getWSURL = () => {
  const url = new URL(baseURL || 'https://api.xtransform.org')
  const scheme = url.hostname === 'localhost' ? 'ws' : 'wss'
  return `${scheme}://${url.host}/ws`
}

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  usersData: `${baseURL}/users/me/`,
  usersLogout: `${baseURL}/users/logout/`,
  segments: `${baseURL}/segments/`,
  querySegment: `${baseURL}/query-segments/`
}

export const headers = () => new Headers({
  'Content-Type': 'application/json',
})

export const ws = new WebSocket(getWSURL());

async function withErrorHandling(response) {
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
      json.detail.forEach(error => {
        console.error(error)
      })
    }
    Sentry.captureEvent(json.detail)
    throw new Error(json.detail)
  }
  return json
}

export async function postSegment(segment) {
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
export async function getSegments(boundingBox = null, excludedIds, modified_after) {
  const url = routes.querySegment

  const params = {
    details: false,
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
  ws.send(JSON.stringify(params))
  // const response = await fetch(`${url}`, {
  //   method: 'POST',
  //   headers: headers(),
  //   body: JSON.stringify(params)
  // })
  // return withErrorHandling(null)
}

export async function getSegment(segmentId) {
  const response = await fetch(`${routes.segments}${segmentId}/`, {
    headers: headers(),
  })
  return withErrorHandling(response)
}

export async function deleteSegment(segmentId) {
  const response = await fetch(`${routes.segments}${segmentId}/`, {
    method: 'DELETE',
    headers: headers(),
    credentials: 'include',
  })
  return withErrorHandling(response)
}

export async function updateSegment(segment) {
  const response = await fetch(`${routes.segments}${segment.id}/`, {
    method: 'PUT',
    headers: headers(),
    credentials: 'include',
    body: JSON.stringify(segment)
  })
  return withErrorHandling(response)
}

