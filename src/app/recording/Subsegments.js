export const STREET_LOCATION = {
  UNKNOWN: 'unknown',
  STREET: 'street',
  CURB: 'curb',
  SIDEWALK: 'sidewalk',
  PARKING_BAY: 'parking_bay',
  MIDDLE: 'middle',
  CAR_PARK: 'car_park'
}

export const ALIGNMENT = {
  UNKNOWN: 'unknown',
  PARALLEL: 'parallel',
  PERPENDICULAR: 'perpendicular',
  DIAGONAL: 'diagonal'
}

export const USER_RESTRICTIONS = {
  UNKNOWN: 'unknown',
  HANDICAP: 'handicap',
  RESIDENTS: 'residents',
  CAR_SHARING: 'car_sharing',
  GENDER: 'gender',
  ELECTRIC_CARS: 'electric_cars',
  OTHER: 'other',
  NO_RESTRICTION: 'all_users'
}

export const ALTERNATIVE_USAGE_REASON = {
  UNKNOWN: 'unknown',
  BUS_STOP: 'bus_stop',
  BUS_LANE: 'bus_lane',
  MARKET: 'market',
  LANE: 'lane',
  TAXI: 'taxi',
  LOADING_ZONE: 'loading',
  OTHER: 'other'
}

export const NO_PARKING_REASONS_AND_LABEL = {
  'private_parking': 'Privatparkplatz',
  'bus_stop': 'Haltestelle',
  'bus_lane': 'Busspur',
  'taxi': 'Taxi',
  'tree': 'Baum',
  'bike_racks': 'Fahrradständer',
  'pedestrian_crossing': 'Zebrastreifen',
  'driveway': 'Einfahrt',
  'loading_zone': 'Ladezone',
  'standing_zone': '"Standing Zone"',
  'emergency_exit': 'Notausgang',
  'lowered_curb_side': 'Abgesenkter Bordstein',
  'lane': 'Fahrspur',
  'no_stopping': 'Halteverbot',
  'pedestrian_zone': 'Fußgängerzone'
}

export function setParkingIsAllowed (subsegment) {
  subsegment.parking_allowed = true
}

export function setParkingIsNotAllowed (subsegment) {
  subsegment.parking_allowed = false
}

export function setIsMarked (subsegment, isMarked) {
  subsegment.marked = isMarked
}

export function setHasTimeConstraint (subsegment, hasTimeConstraint) {
  subsegment.time_constraint = hasTimeConstraint
}

export function setHasFee (subsegment, hasFee) {
  subsegment.fee = hasFee
}

export function setDurationConstraint (subsegment, hasDurationConstraint) {
  subsegment.duration_constraint = hasDurationConstraint
}

export function setDurationConstraintDetails (subsegment, details) {
  if (typeof details === "string") {
    subsegment.duration_constraint_details = details && details.trim().length > 0 ? details.trim() : null
  } else {
    subsegment.duration_constraint_details = null
  }
}

export function setLengthInMeters (subsegment, length) {
  // due to too much generification we get a `false` here if the string is empty...
  if (Number(length)) {
    subsegment.length_in_meters = length
  } else {
    subsegment.length_in_meters = null
  }
}

export function setCarCount (subsegment, car_count) {
  // due to too much generification we get a `false` here if the string is empty...
  if (Number.isInteger(Number(car_count))) {
    subsegment.car_count = car_count
  } else {
    subsegment.car_count = null
  }
}

/**
 * TODO: rename to setTimeConstraintDetails
 */
export function setTimeConstraintReason (subsegment, reason) {
  if (typeof reason === "string") {
    subsegment.time_constraint_reason = reason
  } else {
    subsegment.time_constraint_reason = null
  }
}

export function setStreetLocation (subsegment, street_location) {
  subsegment.street_location = street_location
}

export function setUserRestriction (subsegment, userRestriction) {
  if (userRestriction === false) {
    subsegment.user_restriction_reason = USER_RESTRICTIONS.NO_RESTRICTION
  }
  if (userRestriction === null) {
    subsegment.user_restriction_reason = USER_RESTRICTIONS.UNKNOWN
  }
  subsegment.user_restriction = userRestriction
}

export function setUserRestrictionReason (subsegment, userRestrictionReason) {
  subsegment.user_restriction_reason = userRestrictionReason
}

export function setAlternativeUsageReason (subsegment, alternativeUsageReason) {
  subsegment.alternative_usage_reason = alternativeUsageReason === ALTERNATIVE_USAGE_REASON.UNKNOWN
    ? null
    : alternativeUsageReason
}

export function setAlignment (subsegment, alignment) {
  subsegment.alignment = alignment
}

export function getToggleNoParkingReasonFn (reason) {
  return (subsegment) => {
    if (!subsegment.no_parking_reasons) {
      subsegment.no_parking_reasons = [reason]
    } else if (subsegment.no_parking_reasons.includes(reason)) {
      subsegment.no_parking_reasons = subsegment.no_parking_reasons.filter(r => r !== reason)
    } else {
      subsegment.no_parking_reasons.push(reason)
    }
  }

}

export function createEmptySubsegment () {
  return {
    parking_allowed: true,
    order_number: null,   // to be set by caller
    length_in_meters: null,
    car_count: null,
    quality: 1,
    fee: null,
    street_location: STREET_LOCATION.STREET,
    marked: null, //null,
    alignment: ALIGNMENT.PARALLEL,
    duration_constraint: null,
    duration_constraint_reason: null,
    // TODO: should be singular?
    user_restriction: null,
    user_restriction_reason: USER_RESTRICTIONS.UNKNOWN,
    time_constraint: null,
    time_constraint_reason: null,   // TODO: should be renamed to `time_constraint_details`
    alternative_usage_reason: null,
    no_parking_reasons: [],
  }
}
