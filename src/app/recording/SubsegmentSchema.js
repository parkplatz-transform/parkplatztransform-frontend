import { 
    object,
    boolean,
    number,
    array,
    string,
} from 'yup';
import { registerGermanYupLocale } from "@stephen-r/yup-i18n-de";
import getString from '../../strings'

registerGermanYupLocale();

export default object().shape({
    parking_allowed: boolean().required(),
    order_number: number().required(),
    length_in_meters: number().nullable().test('length_in_meters', getString('helper_text_length'), function (value) {
        const { car_count, parking_allowed } = this.parent;
        if (!parking_allowed) { return true }
        return value || car_count
    }),
    car_count: number().nullable().test('car_count', getString('helper_text_length'), function (value) {
        const { length_in_meters, parking_allowed } = this.parent;
        if (!parking_allowed) { return true }
        return value || length_in_meters
    }),
    quality: number().positive(),
    fee: boolean().nullable(),
    street_location: string().required(),
    marked: boolean().nullable(),
    alignment: string().nullable(),
    duration_constraint: boolean().nullable(),
    usage_restrictions: array().of(string()),
    time_constraint: boolean().nullable(),
}).required();
