import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import {
  ALIGNMENT,
  ALTERNATIVE_USAGE_REASON,
  setAlignment,
  setAlternativeUsageReason,
  setCarCount,
  setDurationConstraint,
  setDurationConstraintDetails,
  setHasFee,
  setHasTimeConstraint,
  setIsMarked,
  setLengthInMeters,
  setStreetLocation,
  setTimeConstraintReason,
  setUserRestriction,
  setUserRestrictionReason,
  STREET_LOCATION,
  USER_RESTRICTIONS,
} from '../../recording/Subsegments';

import getString from '../../../strings';
import YesNoUnknownCheckbox from '../YesNoUnknownCheckbox';
import segmentFormState, { SegmentFormState } from '../../state/SegmentFormState';

const useStyles = makeStyles((theme) => ({
  formView: {
    overflowY: 'auto',
    marginTop: 64,
  },
  list: {
    height: '25vh',
    maxHeight: 'calc(100% - 400px)',
    overflowY: 'auto',
  },
  centered: {
    left: '50%',
    transform: 'translateX(-50%)',
  },
  header: {
    margin: theme.spacing(1),
    textAlign: 'center',
    fontWeight: 'normal',
  },
  headerLeftAligned: {
    margin: '20px',
    textAlign: 'left',
    fontWeight: 'normal',
  },
  headerContainer: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& h4': {
      fontWeight: 'normal',
    },
  },
  subheader: {
    margin: '0 20px',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 16,
  },
  optionTitle: {
    marginBottom: 5,
    fontSize: 15,
    textAlign: 'left',
    fontWeight: 600,
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  shortTextField: {
    width: '20ch',
  },
  textField: {
    width: '25ch',
  },
  wideTextField: {
    width: '35ch',
  },
  fullWidth: {
    width: '100%',
  },
  twoThirdWidth: {
    width: 'calc(100% * 2 / 3)',
  },
  halfWidth: {
    width: 'calc(100% / 2)',
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
}));

const ParkingAllowed = observer(({ formState }: { formState: SegmentFormState }) => {
  const classes = useStyles();
  const error =
    formState.errors && formState.subsegment?.order_number && formState.errors[formState.subsegment.order_number];

  function getKey() {
    return formState.subsegment?.order_number || 'new_subsegment';
  }
  if (formState.subsegment?.parking_allowed) {
    return (
      <React.Fragment>
        {/* Length in meters */}
        <Box px={2} py={1}>
          <FormControl fullWidth>
            <TextField
              key={`length-${formState.subsegment.order_number}`}
              label={
                <label>
                  Länge (ca.) <i>und/oder</i> Stellplätze
                </label>
              }
              variant={'outlined'}
              required={!!error}
              error={!!error}
              type="number"
              helperText={getString('helper_text_length')}
              value={formState.subsegment.length_in_meters}
              onChange={action(formState.updateSubsegment(setLengthInMeters))}
              aria-describedby="length in meters"
              inputProps={{
                'aria-label': 'length',
              }}
            />
          </FormControl>
        </Box>
        <Box px={2} py={1}>
          {/* Count */}
          <FormControl fullWidth>
            <TextField
              key={`car-count-${formState.subsegment.order_number}`}
              variant={'outlined'}
              label="Stellplätze"
              required={!!error}
              error={!!error}
              type="number"
              value={formState.subsegment.car_count}
              helperText={getString('helper_text_length')}
              onChange={action(formState.updateSubsegment(setCarCount))}
              aria-describedby="car count"
              inputProps={{
                'aria-label': 'car count',
              }}
            />
          </FormControl>
        </Box>

        {/* Time Constraint*/}
        <Box px={2} py={1}>
          <div className={classes.optionTitle}>Temporäres&nbsp;Parkverbot</div>
          <FormControlLabel
            control={
              <YesNoUnknownCheckbox
                checked={formState.subsegment.time_constraint}
                onChange={action(formState.updateSubsegment(setHasTimeConstraint))}
              />
            }
            label="Parken zeitweise verboten"
          />
        </Box>
        {formState.subsegment.time_constraint ? (
          <Box px={2} py={1}>
            <FormControl fullWidth>
              <TextField
                label="Wann besteht Parkverbot?"
                id={`${getKey()}_time_constraint_reason`}
                multiline
                variant={'outlined'}
                InputLabelProps={{ shrink: true }}
                value={formState.subsegment.time_constraint_reason}
                onChange={action(formState.updateSubsegment(setTimeConstraintReason))}
              />
            </FormControl>
          </Box>
        ) : null}

        {formState.subsegment.time_constraint ? (
          <Box px={2} py={1}>
            <FormControl fullWidth>
              <TextField
                select
                label="Nutzung bei Parkverbot"
                id="select_alternative_usage_reason"
                value={
                  formState.subsegment.alternative_usage_reason ||
                  ALTERNATIVE_USAGE_REASON.UNKNOWN
                }
                onChange={action(formState.updateSubsegment(setAlternativeUsageReason))}
                variant={'outlined'}
              >
                <MenuItem value={ALTERNATIVE_USAGE_REASON.UNKNOWN}>
                  Unbekannt
                </MenuItem>
                <MenuItem value={ALTERNATIVE_USAGE_REASON.BUS_STOP}>
                  Haltestelle
                </MenuItem>
                <MenuItem value={ALTERNATIVE_USAGE_REASON.BUS_LANE}>
                  Busspur
                </MenuItem>
                <MenuItem value={ALTERNATIVE_USAGE_REASON.MARKET}>
                  Markt
                </MenuItem>
                <MenuItem value={ALTERNATIVE_USAGE_REASON.LANE}>
                  Fahrspur
                </MenuItem>
                <MenuItem value={ALTERNATIVE_USAGE_REASON.TAXI}>Taxi</MenuItem>
                <MenuItem value={ALTERNATIVE_USAGE_REASON.LOADING_ZONE}>
                  Ladezone i.S.v. Lieferzone
                </MenuItem>
                <MenuItem value={ALTERNATIVE_USAGE_REASON.OTHER}>
                  Sonstiges
                </MenuItem>
              </TextField>
            </FormControl>
          </Box>
        ) : null}

        {/*Alignment*/}
        <Box px={2} py={1}>
          <FormControl fullWidth>
            {/*Parkposition:*/}
            <TextField
              label="Parkwinkel"
              select
              id="select_parking_position"
              value={formState.subsegment.alignment || ALIGNMENT.UNKNOWN}
              onChange={formState.updateSubsegment(setAlignment)}
              variant={'outlined'}
            >
              <MenuItem value={ALIGNMENT.UNKNOWN}>unbekannt</MenuItem>
              <MenuItem value={ALIGNMENT.PARALLEL}>parallel</MenuItem>
              <MenuItem value={ALIGNMENT.DIAGONAL}>diagonal</MenuItem>
              <MenuItem value={ALIGNMENT.PERPENDICULAR}>quer</MenuItem>
            </TextField>
          </FormControl>
        </Box>
        {/* Other properties*/}
        <Box px={2} py={1}>
          <div className={classes.optionTitle}>Weitere Eigenschaften</div>
          {/* Parking space marking */}
          <FormControlLabel
            control={
              <YesNoUnknownCheckbox
                checked={formState.subsegment.marked}
                onChange={formState.updateSubsegmentByCheckbox(setIsMarked)}
              />
            }
            label="Parkplätze sind markiert"
          />

          {/* Fee */}
          <FormControlLabel
            control={
              <YesNoUnknownCheckbox
                checked={formState.subsegment.fee}
                onChange={formState.updateSubsegment(setHasFee)}
              />
            }
            label="Mit Gebühr"
          />

          {/* Duration constraint */}
          <FormControlLabel
            control={
              <YesNoUnknownCheckbox
                checked={formState.subsegment.duration_constraint}
                onChange={formState.updateSubsegment(setDurationConstraint)}
              />
            }
            label="Zeitlich beschränkte Parkdauer"
          />

          {formState.subsegment.duration_constraint ? (
            <FormControl
              className={clsx(
                classes.margin,
                classes.withoutLabel,
                classes.wideTextField
              )}
            >
              <FormLabel component="legend">
                Details zur zeitlichen Beschränkung
              </FormLabel>
              <TextField
                id={`${getKey()}_time_constraint_reason`}
                multiline
                variant={'outlined'}
                style={{ width: '100%' }}
                InputLabelProps={{ shrink: true }}
                rows={3}
                rowsMax={5}
                value={formState.subsegment.duration_constraint_reason}
                onChange={formState.updateSubsegment(
                  setDurationConstraintDetails
                )}
              />
            </FormControl>
          ) : null}
        </Box>
        {/* Street location */}
        <Box px={2} py={1}>
          <FormControl fullWidth>
            <TextField
              select
              label="Parkposition"
              id="select_parking_position"
              value={
                formState.subsegment.street_location || STREET_LOCATION.UNKNOWN
              }
              onChange={formState.updateSubsegment(setStreetLocation)}
              variant={'outlined'}
            >
              <MenuItem value={STREET_LOCATION.UNKNOWN}>unbekannt</MenuItem>
              <MenuItem value={STREET_LOCATION.STREET}>
                auf der Fahrbahn
              </MenuItem>
              <MenuItem value={STREET_LOCATION.CURB}>
                auf dem Bordstein (halb auf Straße)
              </MenuItem>
              <MenuItem value={STREET_LOCATION.SIDEWALK}>
                auf dem Gehweg
              </MenuItem>
              <MenuItem value={STREET_LOCATION.PARKING_BAY}>
                in einer Parkbucht
              </MenuItem>
              <MenuItem value={STREET_LOCATION.MIDDLE}>
                auf einer Parkinsel
              </MenuItem>
              <MenuItem value={STREET_LOCATION.CAR_PARK}>
                in einer Sammelanlage
              </MenuItem>
            </TextField>
          </FormControl>
        </Box>

        {/* usage restriction */}
        <Box px={2} py={1}>
          <FormControlLabel
            control={
              <YesNoUnknownCheckbox
                checked={formState.subsegment.user_restriction}
                onChange={formState.updateSubsegment(setUserRestriction)}
              />
            }
            label="Eingeschränkte Nutzergruppe"
          />
        </Box>
        <Box px={2} py={1}>
          <FormControl
            fullWidth
            disabled={!formState.subsegment.user_restriction}
          >
            <TextField
              select
              label="Nutzergruppe"
              id="select_usage_restriction"
              value={
                formState.subsegment.user_restriction_reason ||
                USER_RESTRICTIONS.UNKNOWN
              }
              onChange={formState.updateSubsegment(setUserRestrictionReason)}
              variant={'outlined'}
            >
              {formState.subsegment.user_restriction === false && (
                <MenuItem value={USER_RESTRICTIONS.NO_RESTRICTION}>
                  Alle Nutzer*innen
                </MenuItem>
              )}
              <MenuItem value={USER_RESTRICTIONS.UNKNOWN}>
                Unbekannte Nutzergruppe
              </MenuItem>
              <MenuItem value={USER_RESTRICTIONS.HANDICAP}>
                Behinderung
              </MenuItem>
              <MenuItem value={USER_RESTRICTIONS.RESIDENTS}>
                Anwohner*innen mit Parkausweis
              </MenuItem>
              <MenuItem value={USER_RESTRICTIONS.CAR_SHARING}>
                Car Sharing
              </MenuItem>
              <MenuItem value={USER_RESTRICTIONS.GENDER}>
                nach Geschlecht
              </MenuItem>
              <MenuItem value={USER_RESTRICTIONS.ELECTRIC_CARS}>
                E-Autos
              </MenuItem>
              <MenuItem value={USER_RESTRICTIONS.OTHER}>Sonstige</MenuItem>
            </TextField>
          </FormControl>
        </Box>
      </React.Fragment>
    );
  }
  return null;
});

const connector = () => <ParkingAllowed formState={segmentFormState} />;

export default connector;
