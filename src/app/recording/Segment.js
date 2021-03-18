import { ALIGNMENT, createEmptySubsegment, STREET_LOCATION, USER_RESTRICTIONS } from "./Subsegments"

/**
 * returns a sanitized copy or null if has invalid configurations
 */
export function sanitizeSegment (segment) {
    const copy = JSON.parse(JSON.stringify(segment))
    const emptySubsegment = createEmptySubsegment()

    for (const subsegment of copy.properties.subsegments) {
        if (subsegment.parking_allowed === null) {
            continue
        }
        if (subsegment.parking_allowed === true) {
            subsegment.no_parking_reasons = emptySubsegment.no_parking_reasons
            if (subsegment.alignment === ALIGNMENT.UNKNOWN) {
                subsegment.alignment = null
            }
            if (subsegment.street_location === STREET_LOCATION.UNKNOWN) {
                subsegment.street_location = null
            }
            if (subsegment.user_restriction_reason === USER_RESTRICTIONS.UNKNOWN) {
                subsegment.user_restriction_reason = null
            }
            if (subsegment.duration_constraint !== true) {
                subsegment.duration_constraint_details = emptySubsegment.duration_constraint_details
            }
            if (subsegment.time_constraint !== true) {
                subsegment.time_constraint_reason = emptySubsegment.time_constraint_reason
            }
        } else {
            subsegment.car_count = emptySubsegment.car_count
            subsegment.fee = emptySubsegment.fee
            subsegment.street_location = emptySubsegment.street_location
            subsegment.marked = emptySubsegment.marked
            subsegment.alignment = emptySubsegment.alignment
            subsegment.duration_constraint = emptySubsegment.duration_constraint
            subsegment.duration_constraint_details = emptySubsegment.duration_constraint_details
            subsegment.user_restrictions = emptySubsegment.user_restrictions
            subsegment.alternative_usage_reason = emptySubsegment.alternative_usage_reason
            subsegment.time_constraint = emptySubsegment.time_constraint
            subsegment.time_constraint_reason = emptySubsegment.time_constraint_reason
        }
    }
    return copy
}