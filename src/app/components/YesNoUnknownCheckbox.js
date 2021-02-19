import React from 'react'
import PropTypes from 'prop-types'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { Checkbox } from '@material-ui/core'

function YesNoUnknownCheckbox ({checked, onChange}) {
  function internalOnChange (e) {
    let nextValue
    if (checked === true) {
      nextValue = false
    }
    else if (checked === false) {
      nextValue = null
    }
    else {
      nextValue = true
    }
    return onChange(nextValue)
  }

  if (checked === true) {
    return <Checkbox
      checked
      checkedIcon={<CheckCircleIcon />}
      color={'primary'}
      onChange={internalOnChange}
    />
  }

  if (checked === false) {
    return <Checkbox
      checked
      checkedIcon={<CancelIcon/>}
      color={'primary'}
      onChange={internalOnChange}
    />
  }

  return <Checkbox
    checked={false}
    icon={<HelpOutlineIcon />}
    color={'primary'}
    onChange={internalOnChange}
  />

}

YesNoUnknownCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default YesNoUnknownCheckbox