import React, { useEffect, useState } from 'react'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { Checkbox } from '@material-ui/core'

export default function YesNoUnknownCheckbox ({checked, onChange}) {

  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  function internalOnChange (e) {
    let nextValue
    if (isChecked === true) {
      nextValue = false
    }
    // else if (isChecked === false) {
    //   nextValue = null
    // }
    else {
      nextValue = true
    }
    setIsChecked(nextValue)
    onChange(nextValue)
  }

  if (isChecked) {
    return <Checkbox
      checked
      checkedIcon={<CheckCircleIcon />}
      color={'primary'}
      onChange={internalOnChange}
    />
  }

  if (isChecked === false) {
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