import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from "@material-ui/core/styles";

export default function SplitButton ({optionsAndCallbacks}) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)
  const hasBeenHandledRef = React.useRef(false)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClick = (callback) => {
    // deleteCallback gets precedence
    if (!hasBeenHandledRef.current) {
      setOpen(false)
      callback()
    }
  }

  const handleDelete = (callback) => {
    hasBeenHandledRef.current = true
    setOpen(false)
    callback()
    setTimeout(() => {
      hasBeenHandledRef.current = false
    }, 300)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  const firstButton = optionsAndCallbacks[0].callback
    ? <Button onClick={() => handleClick(optionsAndCallbacks[0].callback)}>{optionsAndCallbacks[0].label}</Button>
    : <Button onClick={handleToggle}>{optionsAndCallbacks[0].label}</Button>

  const hasMoreButtons = optionsAndCallbacks.length > 1


  const useStyles = makeStyles((theme) => ({
    color_red: {
      backgroundColor: "#f66"
    },
    color_green: {
      backgroundColor: "lightgreen"
    },
    color_purple: {
      backgroundColor: "#f700f7"
    },
    color_yellow: {
      backgroundColor: "yellow"
    },
    color_grey: {
      backgroundColor: "lightgrey"
    },
    color_lightblue: {
      backgroundColor: "lightblue"
    },
  }));

  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
          {firstButton}
          {hasMoreButtons

            ? (
              < Button
                color='primary'
                size='small'
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='menu'
                onClick={handleToggle}
              >
                <ArrowDropDownIcon/>
              </Button>
            )
            : null
          }
        </ButtonGroup>
        <Popper style={{zIndex: 400}} open={open} anchorEl={anchorRef.current} role={undefined} transition
                disablePortal>
          {({TransitionProps, placement}) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {optionsAndCallbacks.slice(1, optionsAndCallbacks.length + 1).map((option, index) => (
                      <MenuItem
                        key={`option_${index}_${option.label}`}
                        classes={{root: classes[`color_` + option.color]}}
                        onClick={() => handleClick(option.callback)}
                        disabled={option.disabled}
                      >
                        {option.label}
                        {option.deleteCallback
                          ? <IconButton
                            size={'small'}
                            onClick={() => handleDelete(() => option.deleteCallback(option.label))}
                            edge="end"
                          >
                            <ClearIcon/>
                          </IconButton>
                          : null
                        }
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  )
}
