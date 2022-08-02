import { Subsegment } from "../../../helpers/api";
import { NO_PARKING_REASONS_AND_LABEL, STREET_LOCATION } from "../../recording/Subsegments";

export interface Favorite {
  name: string;
  color: String;
  subsegment: Subsegment;
}

export default function addPredefinedFavorites(favObj: Favorite[]) {
  var favNames = favObj.map((fav: Favorite) => fav.name);

  if (!favNames.includes('Lila')) {
    favObj.push({
      name: 'Lila',
      color: 'purple',
      subsegment: {
        alignment: null,
        alternative_usage_reason: null,
        car_count: null,
        duration_constraint: true,
        duration_constraint_reason: 'Parkscheibe',
        fee: false,
        id: null,
        length_in_meters: null,
        marked: null,
        no_parking_reasons: [],
        order_number: null,
        parking_allowed: true,
        quality: 1,
        street_location: STREET_LOCATION.UNKNOWN,
        time_constraint: false,
        time_constraint_reason: null,
        user_restriction: null,
        user_restriction_reason: null,
      },
    });
  }
  if (!favNames.includes('Grün')) {
    favObj.push({
      name: 'Grün',
      color: 'green',
      subsegment: {
        alignment: null,
        alternative_usage_reason: null,
        car_count: null,
        duration_constraint: false,
        duration_constraint_reason: null,
        fee: false,
        id: null,
        length_in_meters: null,
        marked: null,
        no_parking_reasons: [],
        order_number: null,
        parking_allowed: true,
        quality: 1,
        street_location: STREET_LOCATION.UNKNOWN,
        time_constraint: false,
        time_constraint_reason: null,
        user_restriction: false,
        user_restriction_reason: 'all_users',
      },
    });
  }
  if (!favNames.includes('Rot')) {
    favObj.push({
      name: 'Rot',
      color: 'red',
      subsegment: {
        alignment: null,
        alternative_usage_reason: null,
        car_count: null,
        duration_constraint: null,
        duration_constraint_reason: null,
        fee: null,
        id: null,
        length_in_meters: null,
        marked: null,
        no_parking_reasons: [NO_PARKING_REASONS_AND_LABEL.no_stopping],
        order_number: null,
        parking_allowed: false,
        quality: 1,
        street_location: null,
        time_constraint: null,
        time_constraint_reason: null,
        user_restriction: null,
        user_restriction_reason: null,
      },
    });
  }
  if (!favNames.includes('Grau')) {
    favObj.push({
      name: 'Grau',
      color: 'grey',
      subsegment: {
        alignment: null,
        alternative_usage_reason: null,
        car_count: null,
        duration_constraint: false,
        duration_constraint_reason: null,
        fee: false,
        id: null,
        length_in_meters: null,
        marked: null,
        no_parking_reasons: [NO_PARKING_REASONS_AND_LABEL.no_stopping],
        order_number: null,
        parking_allowed: true,
        quality: 1,
        street_location: null,
        time_constraint: false,
        time_constraint_reason: null,
        user_restriction: null,
        user_restriction_reason: null,
      },
    });
  }
  if (!favNames.includes('Gelb')) {
    favObj.push({
      name: 'Gelb',
      color: 'yellow',
      subsegment: {
        alignment: null,
        alternative_usage_reason: null,
        car_count: null,
        duration_constraint: false,
        duration_constraint_reason: null,
        fee: false,
        id: null,
        length_in_meters: null,
        marked: null,
        no_parking_reasons: [NO_PARKING_REASONS_AND_LABEL.no_stopping],
        order_number: null,
        parking_allowed: true,
        quality: 1,
        street_location: null,
        time_constraint: true,
        time_constraint_reason: 'Unbekannt',
        user_restriction: false,
        user_restriction_reason: 'unknown',
      },
    });
  }
  if (!favNames.includes('Hellblau')) {
    favObj.push({
      name: 'Hellblau',
      color: 'lightblue',
      subsegment: {
        alignment: null,
        alternative_usage_reason: null,
        car_count: null,
        duration_constraint: false,
        duration_constraint_reason: null,
        fee: true,
        id: null,
        length_in_meters: null,
        marked: null,
        no_parking_reasons: [NO_PARKING_REASONS_AND_LABEL.no_stopping],
        order_number: null,
        parking_allowed: true,
        quality: 1,
        street_location: null,
        time_constraint: false,
        time_constraint_reason: 'Unbekannt',
        user_restriction: false,
        user_restriction_reason: 'all_users',
      },
    });
  }
}
