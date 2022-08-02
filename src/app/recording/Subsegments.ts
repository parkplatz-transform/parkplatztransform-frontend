import { Subsegment } from "../../helpers/api"

export enum STREET_LOCATION {
  UNKNOWN = 'unknown',
  STREET = 'street',
  CURB = 'curb',
  SIDEWALK = 'sidewalk',
  PARKING_BAY = 'parking_bay',
  MIDDLE = 'middle',
  CAR_PARK = 'car_park'
}

export enum ALIGNMENT {
  UNKNOWN = 'unknown',
  PARALLEL = 'parallel',
  PERPENDICULAR = 'perpendicular',
  DIAGONAL = 'diagonal'
}

export enum USER_RESTRICTIONS {
  UNKNOWN = 'unknown',
  HANDICAP = 'handicap',
  RESIDENTS = 'residents',
  CAR_SHARING = 'car_sharing',
  GENDER = 'gender',
  ELECTRIC_CARS = 'electric_cars',
  OTHER = 'other',
  NO_RESTRICTION = 'all_users'
}

export enum ALTERNATIVE_USAGE_REASON {
  UNKNOWN = 'unknown',
  BUS_STOP = 'bus_stop',
  BUS_LANE = 'bus_lane',
  MARKET = 'market',
  LANE = 'lane',
  TAXI = 'taxi',
  LOADING_ZONE = 'loading',
  OTHER = 'other'
}

export enum NO_PARKING_REASONS_AND_LABEL {
  'private_parking' = 'Privatparkplatz',
  'bus_stop' = 'Haltestelle',
  'bus_lane' = 'Busspur',
  'taxi' = 'Taxi',
  'bike_racks' = 'Fahrradständer',
  'driveway' = 'Einfahrt',
  'loading_zone' = 'Ladezone',
  'standing_zone' = '"Standing Zone"',
  'emergency_exit' = 'Notausgang',
  'lowered_curb_side' = 'Abgesenkter Bordstein',
  'no_stopping' = 'Halteverbot',
  'pedestrian_zone' = 'Fußgängerzone',
  'tree' = 'Baum',
  'pedestrian_crossing' = 'Zebrastreifen',
  'lane' = 'Fahrspur'
}

export function setParkingIsAllowed(subsegment: Subsegment) {
  subsegment.parking_allowed = true
}

export function setParkingIsNotAllowed(subsegment: Subsegment) {
  subsegment.parking_allowed = false
}

export function setIsMarked(subsegment: Subsegment, isMarked: boolean | null) {
  subsegment.marked = isMarked
}

export function setHasTimeConstraint(subsegment: Subsegment, hasTimeConstraint: boolean | null) {
  subsegment.time_constraint = hasTimeConstraint
}

export function setHasFee(subsegment: Subsegment, hasFee: boolean | null) {
  subsegment.fee = hasFee
}

export function setDurationConstraint(subsegment: Subsegment, hasDurationConstraint: boolean | null) {
  subsegment.duration_constraint = hasDurationConstraint
}

export function setDurationConstraintDetails(subsegment: Subsegment, details: string) {
  if (typeof details === "string") {
    subsegment.duration_constraint_reason = details && details.trim().length > 0 ? details.trim() : null
  } else {
    subsegment.duration_constraint_reason = null
  }
}

export function setLengthInMeters(subsegment: Subsegment, length: number) {
  // due to too much generification we get a `false` here if the string is empty...
  if (Number(length)) {
    subsegment.length_in_meters = length
  } else {
    subsegment.length_in_meters = null
  }
}

export function setCarCount(subsegment: Subsegment, car_count: number) {
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
export function setTimeConstraintReason(subsegment: Subsegment, reason: string) {
  if (typeof reason === "string") {
    subsegment.time_constraint_reason = reason
  } else {
    subsegment.time_constraint_reason = null
  }
}

export function setStreetLocation(subsegment: Subsegment, street_location: STREET_LOCATION) {
  subsegment.street_location = street_location
}

export function setUserRestriction(subsegment: Subsegment, userRestriction: boolean | null) {
  if (userRestriction === false) {
    subsegment.user_restriction_reason = USER_RESTRICTIONS.NO_RESTRICTION
  }
  if (userRestriction === null) {
    subsegment.user_restriction_reason = USER_RESTRICTIONS.UNKNOWN
  }
  subsegment.user_restriction = userRestriction
}

export function setUserRestrictionReason(subsegment: Subsegment, userRestrictionReason: string) {
  subsegment.user_restriction_reason = userRestrictionReason
}

export function setAlternativeUsageReason(subsegment: Subsegment, alternativeUsageReason: ALTERNATIVE_USAGE_REASON) {
  subsegment.alternative_usage_reason = alternativeUsageReason === ALTERNATIVE_USAGE_REASON.UNKNOWN
    ? null
    : alternativeUsageReason
}

export function setAlignment(subsegment: Subsegment, alignment: ALIGNMENT) {
  subsegment.alignment = alignment
}

export function getToggleNoParkingReasonFn(reason: NO_PARKING_REASONS_AND_LABEL) {
  return (subsegment: Subsegment) => {
    if (!subsegment.no_parking_reasons) {
      subsegment.no_parking_reasons = [reason]
    } else if (subsegment.no_parking_reasons.includes(reason)) {
      subsegment.no_parking_reasons = subsegment.no_parking_reasons.filter((r: NO_PARKING_REASONS_AND_LABEL) => r !== reason)
    } else {
      subsegment.no_parking_reasons.push(reason)
    }
  }

}

export function createEmptySubsegment(): Subsegment {
  return {
    id: null,
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
