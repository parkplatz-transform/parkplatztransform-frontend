import * as Sentry from '@sentry/react';

const baseURL = process.env.REACT_APP_API_URL || ''

export const routes = {
  users: `${baseURL}/users/`,
  usersVerify: `${baseURL}/users/verify/`,
  usersData: `${baseURL}/users/me/`,
  segments: `${baseURL}/segments/`
}

export const headers = () => new Headers({
  'Content-Type': 'application/json',
})

async function withErrorHandling(response) {
  const json = await response.json()
  if (!response.ok) {
    json.detail.forEach(error => {
      console.error(error)
    })
    Sentry.captureException(json.detail)
    throw new Error(json.detail)
  }
  return json
}

export async function postSegment(segment) {
  const response = await fetch(routes.segments, {
    method: 'POST',
    credentials: "include",
    body: JSON.stringify(segment),
  })
  return withErrorHandling(response)
}

export async function getUserData() {
  try {
    const response = await fetch(routes.usersData, { credentials: "include" })
    if (response.ok) {
      return response.json()
    }
    return null
  } catch {
    return null
  }
}

export async function getSegments(boundingBox = null, excludedSegmentIds = [], details = false) {
  const url = routes.segments
  const params = {
    details: details ? 1 : 0
  }
  if (boundingBox) {
    params.bbox = boundingBox
  }
  if (excludedSegmentIds.length > 0) {
    params.exclude = excludedSegmentIds.join(',')
  }
  const searchParams = new URLSearchParams(params)
  const response = await fetch(`${url}?${searchParams.toString()}`)
  return withErrorHandling(response)
}

export async function getSegment(segmentId) {
  const response = await fetch(`${routes.segments}${segmentId}`)
  return withErrorHandling(response)
}

export async function deleteSegment(segmentId) {
  const response = await fetch(`${routes.segments}${segmentId}`, {
    method: 'DELETE',
    credentials: "include",
  })
  return withErrorHandling(response)
}

export async function updateSegment(segment) {
  const response = await fetch(`${routes.segments}${segment.id}`, {
    method: 'PUT',
    credentials: "include",
    body: JSON.stringify(segment)
  })
  return withErrorHandling(response)
}

