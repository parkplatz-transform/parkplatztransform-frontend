import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControl } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

import {
  setParkingIsAllowed,
  setParkingIsNotAllowed,
} from '../../recording/Subsegments';
import getString from '../../../strings';
import segmentFormState, { SegmentFormState } from '../../state/SegmentFormState';
import appState, { AppState } from '../../state/AppState';
import ParkingAllowed from './ParkingAllowed';
import ParkingNotAllowed from './ParkingNotAllowed';

const useStyles = makeStyles((theme) => ({
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
  textField: {
    width: '25ch',
  },
  wideTextField: {
    width: '35ch',
  },
  fullWidth: {
    width: '100%',
  },
  halfWidth: {
    width: 'calc(100% / 2)',
  },
}));

const SubsegmentDetails = observer(({ appState, formState }: { appState: AppState; formState: SegmentFormState }) => {
  const classes = useStyles();

  function getButtonVariant(highlighted: boolean) {
    return highlighted ? 'contained' : 'outlined';
  }

  function onSave() {
    formState.save()
  }

  if (!formState.subsegment) {
    return (
      <div>
        <div className={classes.header}>Details</div>
        <div className={classes.subheader}>
          Wähle oder erstelle einen Unterabschnitt
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={classes.headerContainer}>
        <h4>Details</h4>
        <IconButton
          onClick={action(() =>
            formState.setSubsegmentToAddToFavorites(
              Object.assign({}, formState.subsegment)
            )
          )}
          edge="end"
          aria-label="duplicate"
        >
          <StarIcon />
        </IconButton>
      </div>
      <div>
        <Box py={1} px={2}>
          <div className={classes.optionTitle}>Öffentliches Parken</div>
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
            className={classes.fullWidth}
          >
            <Button
              variant={getButtonVariant(formState.subsegment.parking_allowed === true)}
              onClick={action(formState.updateSubsegment(setParkingIsAllowed))}
              className={classes.halfWidth}
            >
              Erlaubt
            </Button>
            <Button
              variant={getButtonVariant(
                formState.subsegment.parking_allowed === false
              )}
              onClick={action(
                formState.updateSubsegment(setParkingIsNotAllowed)
              )}
              className={classes.halfWidth}
            >
              Nie&nbsp;erlaubt
            </Button>
          </ButtonGroup>
        </Box>

        <ParkingAllowed />
        <ParkingNotAllowed />
        <Box py={1} px={2}>
          <FormControl fullWidth>
            <Button
              variant="contained"
              color="primary"
              onClick={onSave}
            >
              {getString('save')}
            </Button>
          </FormControl>
        </Box>
      </div>
    </>
  );
});

const connector = () => (
  <SubsegmentDetails appState={appState} formState={segmentFormState} />
);

export default connector;
