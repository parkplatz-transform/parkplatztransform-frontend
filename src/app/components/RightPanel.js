import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import SegmentForm from '../components/SegmentForm'
import getString from '../../strings'

const useStyles = makeStyles({
  header: {
    margin: '20px auto',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 20,
  },
  subheader: {
    margin: '20px auto',
    textAlign: 'center',
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
})

function RightPanel({
  isLoading,
  segment,
  onSegmentChanged,
  setAlertDisplayed,
}) {
  const classes = useStyles()

  function onValidationFailed(message) {
    setAlertDisplayed({ severity: 'error', message })
  }

  if (isLoading && !segment) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    )
  }
  if (!segment) {
    return (
      <div>
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
        <div className={classes.subheader}>
          <p>{getString('welcome_hint_1')}</p>
        </div>
        <div className={classes.subheader}>
          <p>{getString('welcome_hint_2')}</p>
        </div>
        <div className={classes.subheader}>
          <p>{getString('welcome_hint_3')}</p>
        </div>
        <div className={classes.subheader}>
          <p>{getString('welcome_hint_4')}</p>
        </div>
        <div className={classes.subheader}>
          <p>{getString('welcome_hint_5')}</p>
        </div>
        <div className={classes.subheader}>
          <p>{getString('welcome_to_howto')}</p>
        </div>
      </div>
    )
  }
  return (
    <SegmentForm
      segment={segment}
      onChanged={onSegmentChanged}
      onValidationFailed={onValidationFailed}
    />
  )
}

RightPanel.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  selectedSegment: PropTypes.object,
  onSegmentChanged: PropTypes.func.isRequired,
  setAlertDisplayed: PropTypes.func.isRequired,
}

export default RightPanel
