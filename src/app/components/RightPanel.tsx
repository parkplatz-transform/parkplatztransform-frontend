import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import SegmentForm from '../components/SegmentForm/SegmentForm';
import getString from '../../strings';
import segmentFormState from '../state/SegmentFormState';

const useStyles = makeStyles({
  header: {
    margin: '20px auto',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subheader: {
    margin: '20px auto',
    textAlign: 'left',
    fontEeight: 'bold',
    fontSize: 16,
  },
  verticalSpace: {
    height: 30,
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  container: {
    padding: '20px',
    textAlign: 'left',
  },
  orderdList: {
    paddingInlineStart: '20px',
  },
  bottom: {
    display: 'flex',
    alignItems: 'center',
  },
  paddingLeft: {
    paddingLeft: '0.25rem',
  },
  formArea: {
    width: 360,
  },
  showFormArea: {
    width: 48,
    marginTop: 30,
  },
});

const WelcomeMessage = React.memo(() => {
  const classes = useStyles();
  return (
    <div className={classes.formArea}>
      <Box p={2} mt={5}>
        <div className={classes.verticalSpace} />
        <div className={classes.header}>
          <p>{getString('welcome_title')}</p>
        </div>
        <div className={classes.subheader}>
          <p>{getString('welcome_subtitle')}</p>
        </div>
        <div className={classes.subheader}>
          <p>{getString('welcome_hints')}</p>
        </div>

        <ol className={classes.orderdList}>
          <li>
            <div className={classes.subheader}>
              <p>{getString('welcome_hint_1')}</p>
            </div>
          </li>
          <li>
            <div className={classes.subheader}>
              <p>{getString('welcome_hint_2')}</p>
            </div>
          </li>
          <li>
            <div className={classes.subheader}>
              <p>{getString('welcome_hint_3')}</p>
            </div>
          </li>
          <li>
            <div className={classes.subheader}>
              <p>{getString('welcome_hint_4')}</p>
            </div>
          </li>
          <li>
            <div className={classes.subheader}>
              <p>{getString('welcome_hint_5')}</p>
            </div>
          </li>
        </ol>
        <div className={classes.bottom}>
          <Link className={classes.link} to={`/howto`}>
            <IconButton aria-label="delete">
              <ArrowForwardIcon />
            </IconButton>
          </Link>
          <p className={classes.paddingLeft}>{getString('welcome_to_howto')}</p>
        </div>
      </Box>
    </div>
  );
});

const RightPanel = observer(({ formState }) => {
  const classes = useStyles();

  if (!formState.segment) {
    return <WelcomeMessage />;
  }

  return (
    <div className={classes.formArea}>
      <SegmentForm />
    </div>
  );
});

const connector = () => <RightPanel formState={segmentFormState} />;
export default connector;
