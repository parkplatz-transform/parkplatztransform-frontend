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
  NO_RESTRICTION: 'no restriction'
}

export const ALTERNATIVE_USAGE_REASON = {
  UNKNOWN: 'unknown',
  BUS_STOP: 'bus_stop',
  BUS_LANE: 'bus_lane',
  MARKET: 'market',
  LANE: 'lane',
  TAXI: 'taxi',
  OTHER: 'other'
}

export const NO_PARKING_REASONS_AND_LABEL = {
  'unknown': 'Unbekannt',
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
  'lane': 'Fahrspur'
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

export function setLengthInMeters (subsegment, length) {
  // due to too much generification we get a `false` here if the string is empty...
  subsegment.length_in_meters = length === false ? null : Number(length)
}

export function setCarCount (subsegment, car_count) {
  // due to too much generification we get a `false` here if the string is empty...
  subsegment.car_count = car_count === false  ? null : Number(car_count)
}

/**
 * TODO: rename to setTimeConstraintDetails
 */
export function setTimeConstraintReason (subsegment, reason) {
  subsegment.time_constraint_reason = reason
}

export function setStreetLocation (subsegment, street_location) {
  subsegment.street_location = street_location
}

export function setUserRestriction (subsegment, userRestriction) {
  subsegment.user_restrictions = userRestriction === USER_RESTRICTIONS.NO_RESTRICTION
    ? null
    : userRestriction
}

export function setAlternativeUsageReason (subsegment, alternativeUsageReason) {
  subsegment.alternative_usage_reason = alternativeUsageReason
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

export function createEmptySubsegment (orderNumber) {
  return {
    parking_allowed: true,
    order_number: orderNumber,
    length_in_meters: null,
    car_count: null,
    quality: 1,
    fee: null,
    street_location: STREET_LOCATION.UNKNOWN,
    marked: null, //null,
    alignment: ALIGNMENT.UNKNOWN,
    duration_constraint: null,
    // TODO: should be singular?
    usage_restrictions: [],
    time_constraint: null,
    time_constraint_reason: null,   // TODO: should be renamed to `time_constraint_details`
    usage_when_no_parking: null,
    no_parking_reasons: [],
  }
}

export function createParkingSubsegment (orderNumber) {
  return Object.assign(createEmptySubsegment(orderNumber), {
    parking_allowed: true,
  })
}

export function createNonParkingSubsegment (orderNumber) {
  return Object.assign(createEmptySubsegment(orderNumber), {
    parking_allowed: false
  })
}
