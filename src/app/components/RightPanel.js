import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import IconButton from '@material-ui/core/IconButton'
import { Link } from 'react-router-dom'
import SegmentForm from '../components/SegmentForm'
import getString from '../../strings'
import CloseIcon from '@material-ui/icons/Close'

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
})

function RightPanel({
  isLoading,
  segment,
  onSegmentChanged,
  setAlertDisplayed,
  onClose
}) {
  const classes = useStyles()

  function onValidationFailed(message) {
    setAlertDisplayed({ severity: 'error', message })
  }

  if (!segment) {
    return (
      <div className={classes.container}>
        <IconButton aria-label='close' onClick={onClose}>
          <CloseIcon />
        </IconButton>
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
            <IconButton aria-label='delete'>
              <ArrowForwardIcon />
            </IconButton>
          </Link>
          <p className={classes.paddingLeft}>{getString('welcome_to_howto')}</p>
        </div>
      </div>
    )
  }

  return (
    <SegmentForm
      segment={segment}
      onChanged={onSegmentChanged}
      onValidationFailed={onValidationFailed}
      onClose={onClose}
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
