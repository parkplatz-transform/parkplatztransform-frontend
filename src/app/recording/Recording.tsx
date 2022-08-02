import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import PTMap from '../map/PTMap';
import RightPanel from '../components/RightPanel';
import { Drawer } from '@material-ui/core';
import { UserContext } from '../context/UserContext';
import isEmbedded from '../../helpers/isEmbedded';
import appState, { AppState } from '../state/AppState';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

const useStyles = makeStyles({
  buttonGroup: {
    marginTop: 10,
    textAlign: 'center',
  },
  bottomButton: {
    marginLeft: 5,
    marginRight: 5,
  },
  container: {
    height: `calc(100vh - ${isEmbedded ? '0px' : '64px'})`,
    width: '100%',
    display: 'flex',
    overflow: 'hidden',
  },
  verticalSpace: {
    height: 30,
  },
  mapArea: {
    width: '100%',
  },
  drawer: {
    top: '70px!important',
  },
});

const Recording = observer(({ appState }: { appState: AppState }) => {
  const { user } = useContext(UserContext);
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div className={clsx(classes.mapArea, user ? null : 'logged-out')}>
          <PTMap key="map" />
        </div>
        {!isEmbedded && (
          <Drawer
            variant="persistent"
            anchor="right"
            open={appState.rightDrawerOpen}
            onClose={action(() => appState.setRightDrawerOpen(false))}
          >
            <RightPanel />
          </Drawer>
        )}
      </div>
    </>
  );
});

const connector = () => <Recording appState={appState} />;

export default connector;
