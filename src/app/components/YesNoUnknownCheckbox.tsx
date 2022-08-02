import React from 'react'
import PropTypes from 'prop-types'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { Checkbox, Tooltip } from '@material-ui/core'

function YesNoUnknownCheckbox ({checked, onChange}: { checked: boolean; onChange: (value: boolean | null) => void }) {
  function internalOnChange () {
    let nextValue
    if (checked === true) {
      nextValue = false
    } else if (checked === false) {
      nextValue = null
    } else {
      nextValue = true
    }
    return onChange(nextValue)
  }

  if (checked === true) {
    return (
      <Tooltip title={'Aussage trifft zu'}>
        <Checkbox
          checked
          checkedIcon={<CheckCircleIcon/>}
          color={'primary'}
          onChange={internalOnChange}
        />
      </Tooltip>
    )
  }

  if (checked === false) {
    return (
      <Tooltip title={'Aussage trifft nicht zu'}>
        <Checkbox
          checked
          checkedIcon={<CancelIcon/>}
          color={'primary'}
          onChange={internalOnChange}
        />
      </Tooltip>
    )
  }

  return (
    <Tooltip title={"Unsicher, ob Aussage zutrifft"}>
      <Checkbox
        checked={false}
        icon={<HelpOutlineIcon/>}
        color={'primary'}
        onChange={internalOnChange}
      />
    </Tooltip>
  )

}

YesNoUnknownCheckbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default YesNoUnknownCheckbox