import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

import { createEmptySubsegment } from '../../recording/Subsegments';
import getString from '../../../strings';
import SplitButton from '../SplitButton';
import { userCanEditSegment } from '../../../helpers/permissions';
import { UserContext } from '../../context/UserContext';
import {
  DATA_SOURCES,
  setDataSource,
  setFurtherComments,
} from '../../recording/Segment';
import SubsegmentList from './SubsegmentList';
import SubsegmentDetails from './SubsegmentDetails';
import AddToFavoriteDialog from './AddToFavoriteDialog';
import segmentFormState from '../../state/SegmentFormState';
import appState from '../../state/AppState';

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

const SegmentForm = observer(({ appState, formState }) => {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  const disabled = !userCanEditSegment(
    user,
    formState.segment?.properties?.owner_id
  );

  const disabledMessage = user
    ? 'Du hast leider keine Berechtigung, Abschnitte, die von anderen Nutzer*innen hinzugefügt wurden zu bearbeiten.'
    : 'Bitte einloggen zum ändern';

  function getSegmentKey() {
    return formState.segment.id || 'new segment';
  }

  function renderSegmentProperties() {
    return (
      <React.Fragment>
        {/* data source */}
        <Box px={2} py={1}>
          <FormControl key={`${getSegmentKey()}_data_source`} fullWidth>
            <TextField
              labelId="select_data_source"
              id="select_data_source"
              value={formState.segment.properties?.data_source || null}
              onChange={formState.updateSegment(setDataSource)}
              variant={'outlined'}
              label="Datenquelle"
              select
            >
              <MenuItem value={null}>&nbsp;</MenuItem>
              <MenuItem value={DATA_SOURCES.OWN_COUNTING}>
                Eigene Zählung
              </MenuItem>
              <MenuItem value={DATA_SOURCES.PARKPLATZ_TRANSFORM}>
                Parkplatz Transform
              </MenuItem>
              <MenuItem value={DATA_SOURCES.HOFFMANN_LEICHTER}>
                Hoffmann leichter
              </MenuItem>
              <MenuItem value={DATA_SOURCES.LK_ARGUS}>LK Argus</MenuItem>
              <MenuItem value={DATA_SOURCES.OTHER}>Sonstiges</MenuItem>
            </TextField>
          </FormControl>
        </Box>

        {/* further comments */}
        <Box px={2} py={1}>
          <FormControl key={`${getSegmentKey()}_comment`} fullWidth>
            <TextField
              label="Kommentar"
              variant={'outlined'}
              multiline
              type="text"
              value={formState.segment.properties?.further_comments}
              onChange={formState.updateSegment(setFurtherComments)}
            />
          </FormControl>
        </Box>
      </React.Fragment>
    );
  }

  function closeDrawer() {
    formState.onSegmentSelect(null);
    appState.setRightDrawerOpen(false);
  }

  function onSave() {
    formState.save().then(() => {
      if (formState.isFormValid) {
        appState.setRightDrawerOpen(false);
      }
    });
  }

  return (
    <div className={classes.formView}>
      <div className={classes.headerContainer}>
        <Button variant="contained" color="primary" onClick={closeDrawer}>
          Close
        </Button>
        <Button
          onClick={onSave}
          disabled={formState.isChanged === 0}
          color="primary"
          variant="contained"
          size="small"
        >
          {getString('save')}
        </Button>
      </div>
      {disabled && (
        <div className={classes.headerContainer}>
          <Alert style={{ width: '100%' }} severity="warning">
            {disabledMessage}
          </Alert>
        </div>
      )}
      <div className={disabled ? classes.disabled : null}>
        <div
          className={clsx(
            classes.marginTop,
            disabled ? classes.disabled : null
          )}
        >
          {renderSegmentProperties()}
        </div>
        <Box pt={2}>
          <Divider />
        </Box>
        <h4 className={clsx(classes.headerLeftAligned)}>Unterabschnitte</h4>
        <div className={classes.list}>
          <SubsegmentList />
        </div>
        <SplitButton
          optionsAndCallbacks={[
            {
              label: 'Unterabschnitt hinzufügen',
              callback: action(() => formState.addSubsegment(createEmptySubsegment())),
            },
            ...formState.favorites.map((favorite) => {
              return {
                label: favorite.name,
                color: favorite.color,
                callback: () =>
                  formState.addSubsegment(
                    Object.assign({}, favorite.subsegment)
                  ),
                deleteCallback: (name) => formState.removeFavorite(name),
              };
            }),
          ]}
        />
        <Box pt={2}>
          <Divider />
        </Box>
        <form
          onChange={() => {
            formState.setErrors({});
          }}
        >
          <SubsegmentDetails />
        </form>
        <AddToFavoriteDialog />
      </div>
    </div>
  );
});

const connector = () => (
  <SegmentForm appState={appState} formState={segmentFormState} />
);

export default connector;