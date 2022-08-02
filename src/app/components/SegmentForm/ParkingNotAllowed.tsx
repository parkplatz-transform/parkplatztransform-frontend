import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import {
  getToggleNoParkingReasonFn,
  NO_PARKING_REASONS_AND_LABEL,
  setLengthInMeters,
} from '../../recording/Subsegments';

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

const ParkingNotAllowed = observer(({ formState }: { formState: SegmentFormState }) => {
  const classes = useStyles();
  if (formState.subsegment?.parking_allowed === false) {
    return (
      <React.Fragment>
        {/*Length*/}
        <Box px={2} py={1}>
          <FormControl fullWidth>
            <TextField
              label="Länge (ca.) (m)"
              variant="outlined"
              id="standard-adornment-weight"
              value={formState.subsegment?.length_in_meters}
              onChange={formState.updateSubsegment(setLengthInMeters)}
              aria-describedby="length in meters"
              inputProps={{
                'aria-label': 'weight',
              }}
            />
          </FormControl>
        </Box>
        {/*No parking reason*/}
        <Box px={2} py={1}>
          <div className={classes.optionTitle}>Gründe</div>
          <FormGroup>
            {Object.keys(NO_PARKING_REASONS_AND_LABEL).map((key) => {
              const reason = formState.subsegment?.no_parking_reasons?.find(
                (k) => k === key
              );
              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      color={'primary'}
                      checked={reason === key}
                      onChange={formState.updateSubsegment(
                        getToggleNoParkingReasonFn(key)
                      )}
                    />
                  }
                  label={NO_PARKING_REASONS_AND_LABEL[key]}
                />
              );
            })}
          </FormGroup>
        </Box>
      </React.Fragment>
    );
  }
  return null;
});

const connector = () => <ParkingNotAllowed formState={segmentFormState} />;

export default connector;
