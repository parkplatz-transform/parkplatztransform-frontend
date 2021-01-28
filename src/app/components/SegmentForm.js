import React, { useEffect, useReducer, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Checkbox,
  FormControl, FormControlLabel, FormGroup, FormLabel, Input, InputAdornment,
  List, ListItem, ListItemSecondaryAction, ListItemText,
  MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Button from '@material-ui/core/Button'
import SplitButton from './SplitButton'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Paper from '@material-ui/core/Paper'
import {
  ALIGNMENT,
  createEmptySubsegment,
  getToggleNoParkingReasonFn,
  NO_PARKING_REASONS_AND_LABEL,
  setAlignmentDiagonal,
  setAlignmentParallel,
  setAlignmentPerpendicular,
  setCarCount,
  setDurationConstraint,
  setHasFee,
  setLengthInMeters,
  setIsMarked,
  setParkingIsAllowed,
  setParkingIsNotAllowed,
  setStreetLocation,
  setHasTimeConstraint,
  setTimeConstraintReason,
  setUserRestriction,
  setAlternativeUsageReason,
  STREET_LOCATION,
  USER_RESTRICTIONS,
  ALTERNATIVE_USAGE_REASON,
} from '../recording/Subsegments'
import clsx from 'clsx'
import getString from '../../strings'

const useStyles = makeStyles((theme) => ({
  formView: {
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'scroll'
  },
  list: {
    height: '25vh',
    maxHeight: 'calc(100% - 400px)',
    overflowY: 'scroll'
  },

  marginTop: {
    marginTop: 10
  },

  marginLeft: {
    marginLeft: 15
  },

  marginLeftRight: {
    marginLeft: 10,
    marginRight: 10
  },
  centered: {
    left: '50%',
    transform: 'translateX(-50%)'
  },
  header: {
    margin: '20px',
    textAlign: 'center',
    fontWeight: 'normal'
  },
  headerContainer: {
    margin: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& h4': {
      fontWeight: 'normal'
    }
  },
  subheader: {
    margin: '0 20px',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 16
  },
  optionTitle: {
    marginBottom: 5,
    fontSize: 15,
    textAlign: 'left',
    fontWeight: 600
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
  halfWidth: {
    width: 'calc(100% / 2)'
  },
  thirdWidth: {
    width: 'calc(100% / 3)'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  json: {
    maxWidth: '100%'
  }
}))

export default function SegmentForm ({segment, onChanged}) {
  const classes = useStyles()
  const [selectedSubsegmentIndex, setSelectedSubsegmentIndex] = React.useState(0)
  const [isChanged, setChanged] = useReducer((updateValue, changed = true) => {
    return changed ? updateValue + 1 : 0
  }, 0)

  const prevSegmentRef = useRef(segment)
  const selectedSubsegment = () => {
    return segment.properties.subsegments[selectedSubsegmentIndex]
  }

  useEffect(() => {
    if (prevSegmentRef.current?.id && segment?.id !== prevSegmentRef.current?.id) {
      if (isChanged) {
        onChanged(prevSegmentRef.current)
      } 
      prevSegmentRef.current = segment
      setChanged(false)
      setSelectedSubsegmentIndex(0)
    }
  }, [isChanged, onChanged, segment])

  /**
   * @param segmentCreationFunction A function with order_number as first parameter.
   */
  function addSubsegment (segmentCreationFunction) {
    if (!segment.properties) {
      segment.properties = {}
    }
    if (!segment.properties.subsegments) {
      segment.properties.subsegments = []
    }
    const subsegment = segmentCreationFunction(segment.properties.subsegments.length)
    segment.properties.subsegments.push(subsegment)
    setSelectedSubsegmentIndex(subsegment.order_number)
    setChanged()
  }

  function deleteSubsegment (subsegment) {
    segment.properties.subsegments = segment.properties.subsegments
      .filter(s => s !== subsegment)
      .map((sub, idx) => ({...sub, order_number: idx}))
    setChanged()
  }

  function duplicateSubsegment (subsegment) {
    const newSubsegment = {...subsegment}
    delete newSubsegment.id
    delete newSubsegment.created_at
    delete newSubsegment.modified_at

    const newSubsegments = [...segment.properties.subsegments]
    // Insert in the right position
    newSubsegments
      .splice(subsegment.order_number + 1, 0, newSubsegment)
    //TODO: probably makes more sense to just set order_number server-side
    segment.properties.subsegments = newSubsegments 
      .map((sub, idx) => ({...sub, order_number: idx})) // Normalize the subsegment order
    setChanged()
    setSelectedSubsegmentIndex(subsegment.order_number + 1)
  }

  function getButtonVariant (highlighted) {
    return highlighted ? 'contained' : 'outlined'
  }

  /**
   *
   * @param subsegmentChangeFunction - A function that takes a subsegment as first argument. A optional second arg
   *   takes the event's value
   */
  function updateSubsegment (subsegmentChangeFunction) {
    return (event) => {
      subsegmentChangeFunction(selectedSubsegment(), event?.target?.value || event?.target?.checked)
      setChanged()
    }
  }

  async function save() {
    const success = await onChanged(segment)
    console.log('success', success)
    setChanged(!success)
  }

  function renderList () {
    if (segment.properties && segment.properties.subsegments) {
      const listItems = segment.properties.subsegments.sort((a, b) => a.order_number > b.order_number).map((subsegment) => {
        let title
        if (subsegment.parking_allowed === true) {
          title = 'Parken'
        } else if (subsegment.parking_allowed === false) {
          title = 'Kein Parken'
        } else {
          title = 'Neuer Unterabschnitt'
        }
        let details = "";
        if (subsegment.length_in_meters) {
          details = `${subsegment.length_in_meters} m`
        }
        else if (subsegment.car_count) {
          details = `${subsegment.car_count} Stellplätze`
        }

        return (
          <ListItem
            key={subsegment.order_number}
            button
            selected={subsegment?.order_number === selectedSubsegmentIndex}
            onClick={() => setSelectedSubsegmentIndex(subsegment.order_number)}
          >
            <ListItemText
              primary={title}
              secondary={details}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => duplicateSubsegment(subsegment)} edge="end" aria-label="duplicate">
                <FileCopyIcon/>
              </IconButton>
              <IconButton onClick={() => deleteSubsegment(subsegment)} edge="end" aria-label="delete">
                <DeleteIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
      })

      return (
        <List>{listItems}</List>
      )
    }
  }

  function renderDetailsForParkingAllowed () {
    if (selectedSubsegment().parking_allowed) {
      return (
        <React.Fragment>

          <TableRow key={`${selectedSubsegment().id}_length`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Länge (ca.) <i>und/oder</i> Stellplätze</div>

              {/* Length in meters */}
              <FormControl className={clsx(classes.withoutLabel, classes.fullWidth)}>
                <TextField
                  label="m"
                  required
                  error={
                    selectedSubsegment().length_in_meters === null
                    && selectedSubsegment().car_count === null
                  }
                  type="number"
                  helperText={getString('helper_text_length')}
                  value={selectedSubsegment().length_in_meters}
                  onChange={updateSubsegment(setLengthInMeters)}
                  aria-describedby="length in meters"
                  inputProps={{
                    'aria-label': 'length',
                  }}
                />
              </FormControl>

              {/* Count */}
              <FormControl className={clsx(classes.withoutLabel, classes.fullWidth)}>
                <TextField
                  label="Stellplätze"
                  required
                  error={
                    selectedSubsegment().length_in_meters === null
                    && selectedSubsegment().car_count === null
                  }
                  type="number"
                  value={selectedSubsegment().car_count}
                  helperText={getString('helper_text_length')}
                  onChange={updateSubsegment(setCarCount)}
                  aria-describedby="car count"
                  inputProps={{
                    'aria-label': 'car count',
                  }}
                />
              </FormControl>
            </TableCell>
          </TableRow>


          {/* Time Constraint*/}
          <TableRow key={`${selectedSubsegment().id}_time_constraint`}>
            <TableCell align="left">

              <div className={classes.optionTitle}>Temporäres&nbsp;Parkverbot</div>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubsegment().time_constraint}
                    color={'primary'}
                    onChange={updateSubsegment(setHasTimeConstraint)}
                  />
                }
                label="Parken zeitweise verboten"/>

              {selectedSubsegment().time_constraint
                ? <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.wideTextField)}>
                  <FormLabel component="legend">Wann besteht Parkverbot?</FormLabel>
                  <TextField id={`${selectedSubsegment().id}_time_constraint_reason`}
                             multiline variant={'outlined'} style={{width: '100%'}}
                             InputLabelProps={{shrink: true}}
                             rows={3}
                             rowsMax={5}
                             value={selectedSubsegment().time_constraint_reason}
                             onChange={updateSubsegment(setTimeConstraintReason)}
                  />
                </FormControl>
                : null
              }

              {selectedSubsegment().time_constraint
                ? <FormControl className={classes.formControl}>
                  <FormLabel component="legend">Nutzung bei Parkverbot</FormLabel>
                  <Select
                    labelId="select_alternative_usage_reason"
                    id="select_alternative_usage_reason"
                    value={selectedSubsegment().alternative_usage_reason}
                    onChange={updateSubsegment(setAlternativeUsageReason)}
                    // variant={'outlined'}
                  >
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.BUS_STOP}>Haltestelle</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.BUS_LANE}>Busspur</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.MARKET}>Markt</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.LANE}>Fahrspur</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.TAXI}>Taxi</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.OTHER}>Sonstiges</MenuItem>
                  </Select>
                </FormControl>
                : null
              }

            </TableCell>
          </TableRow>

          {/*Alignment*/}
          <TableRow key={`${selectedSubsegment().id}_alignment`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Parkwinkel</div>

              <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.fullWidth}>
                <Button variant={getButtonVariant(selectedSubsegment().alignment === ALIGNMENT.PARALLEL)}
                        onClick={updateSubsegment(setAlignmentParallel)} className={classes.thirdWidth}>
                  Parallel
                </Button>
                <Button variant={getButtonVariant(selectedSubsegment().alignment === ALIGNMENT.DIAGONAL)}
                        onClick={updateSubsegment(setAlignmentDiagonal)} className={classes.thirdWidth}>
                  Diagonal
                </Button>
                <Button variant={getButtonVariant(selectedSubsegment().alignment === ALIGNMENT.PERPENDICULAR)}
                        onClick={updateSubsegment(setAlignmentPerpendicular)} className={classes.thirdWidth}>
                  Quer
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>

          {/* Other properties*/}
          <TableRow key={`${selectedSubsegment().id}_fee`}>
            <TableCell align="left">

              <div className={classes.optionTitle}>Weitere Eigenschaften</div>

              {/* Parking space marking */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubsegment().marked}
                    color={'primary'}
                    onChange={updateSubsegment(setIsMarked)}
                  />
                }
                label="Parkplätze sind markiert"/>

              {/* Fee */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubsegment().fee}
                    color={'primary'}
                    onChange={updateSubsegment(setHasFee)}
                  />
                }
                label="Mit Gebühr"/>

              {/* Duration constraint */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedSubsegment().duration_constraint}
                    color={'primary'}
                    onChange={updateSubsegment(setDurationConstraint)}
                  />
                }
                label="Zeitlich beschränkte Parkdauer"/>

              {/* Street location */}
              <div>
                <FormControl className={clsx(classes.formControl, classes.fullWidth)}>
                  Parkposition:
                  <Select
                    id="select_parking_position"
                    value={selectedSubsegment().street_location}
                    onChange={updateSubsegment(setStreetLocation)}
                    variant={'outlined'}
                  >
                    <MenuItem value={STREET_LOCATION.STREET}>auf der Straße</MenuItem>
                    <MenuItem value={STREET_LOCATION.CURB}>auf dem Bordstein (halb auf Straße)</MenuItem>
                    <MenuItem value={STREET_LOCATION.SIDEWALK}>auf dem Gehweg</MenuItem>
                    <MenuItem value={STREET_LOCATION.PARKING_BAY}>in einer Parkbucht</MenuItem>
                    <MenuItem value={STREET_LOCATION.MIDDLE}>auf einer Parkinsel</MenuItem>
                    <MenuItem value={STREET_LOCATION.CAR_PARK}>in einer Sammelanlage</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* usage restriction */}
              <div>
                <FormControl className={clsx(classes.formControl, classes.fullWidth)}>
                  Nutzergruppe:
                  <Select
                    labelId="demo-simple-select-label"
                    id="select_usage_restriction"
                    value={selectedSubsegment().user_restrictions || USER_RESTRICTIONS.NO_RESTRICTION}
                    onChange={updateSubsegment(setUserRestriction)}
                    variant={'outlined'}
                  >
                    <MenuItem value={USER_RESTRICTIONS.NO_RESTRICTION}>Alle Nutzer*innen</MenuItem>
                    <MenuItem value={USER_RESTRICTIONS.HANDICAP}>Behinderung</MenuItem>
                    <MenuItem value={USER_RESTRICTIONS.RESIDENTS}>Anwohner*innen mit Parkausweis</MenuItem>
                    <MenuItem value={USER_RESTRICTIONS.CAR_SHARING}>Car Sharing</MenuItem>
                    <MenuItem value={USER_RESTRICTIONS.GENDER}>nach Geschlecht</MenuItem>
                    <MenuItem value={USER_RESTRICTIONS.ELECTRIC_CARS}>E-Autos</MenuItem>
                    <MenuItem value={USER_RESTRICTIONS.OTHER}>Sonstige</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </TableCell>
          </TableRow>

        </React.Fragment>
      )
    }

    return null

  }

  function renderDetailsForParkingNotAllowed () {
    if (selectedSubsegment().parking_allowed === false) {
      return (
        <React.Fragment>

          {/*Length*/}
          <TableRow key={`${selectedSubsegment().id}_length`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Länge (ca.)</div>

              <FormControl className={clsx(classes.withoutLabel, classes.fullWidth)}>
                <Input
                  id="standard-adornment-weight"
                  value={selectedSubsegment().length_in_meters}
                  onChange={updateSubsegment(setLengthInMeters)}
                  endAdornment={<InputAdornment position="end">m</InputAdornment>}
                  aria-describedby="length in meters"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                />
              </FormControl>
            </TableCell>
          </TableRow>

          {/*No parking reason*/}
          <TableRow key={`${selectedSubsegment().id}_noparking_reason`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Gründe</div>

              <FormGroup>
                {Object.keys(NO_PARKING_REASONS_AND_LABEL).map(key => {
                  const reason = selectedSubsegment()?.no_parking_reasons?.find(k => k === key)
                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          color={'primary'}
                          checked={reason === key}
                          onChange={updateSubsegment(getToggleNoParkingReasonFn(key))}
                        />
                      }
                      label={NO_PARKING_REASONS_AND_LABEL[key]}
                    />
                  )
                })}
              </FormGroup>

            </TableCell>
          </TableRow>
        </React.Fragment>
      )
    }

    return null
  }

  function renderDetails () {
    if (!selectedSubsegment()) {
      return (
        <div>
          <div className={classes.header}>Details</div>
          <div className={classes.subheader}>Wähle oder erstelle einen Unterabschnitt</div>
        </div>
      )
    }
    return (
      <div>
        <div className={classes.headerContainer}>
          <h4>Details</h4>
        </div>
        <div className={classes.marginLeftRight}>

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>

                {/*Parking allowed*/}
                <TableRow key={`${selectedSubsegment().id}_parking_allowed`}>
                  <TableCell align="left">
                    <div className={classes.optionTitle}>Öffentliches Parken</div>


                    <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.fullWidth}>
                      <Button variant={getButtonVariant(selectedSubsegment().parking_allowed === true)}
                              onClick={updateSubsegment(setParkingIsAllowed)} className={classes.halfWidth}>
                        Erlaubt
                      </Button>
                      <Button variant={getButtonVariant(selectedSubsegment().parking_allowed === false)}
                              onClick={updateSubsegment(setParkingIsNotAllowed)} className={classes.halfWidth}>
                        Nie&nbsp;erlaubt
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>

                {renderDetailsForParkingAllowed()}
                {renderDetailsForParkingNotAllowed()}
                <Button variant="contained" color="primary" onClick={save} className={classes.fullWidth}>
                  {getString('save')}
                </Button>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <pre className={clsx(classes.json, classes.margin)}>{JSON.stringify(segment, null, ' ')}</pre>
      </div>
    )
  }

  return (
    <div className={classes.formView} /*onMouseLeave={save}*/>
      <div className={classes.headerContainer}>
        <h4>Unterabschnitt</h4>
          <Button
            onClick={save}
            disabled={isChanged === 0}
            color="primary"
            variant="contained"
            size="small">
            {getString('save')}
          </Button>
      </div>
      <div className={classes.list}>
        {renderList()}
      </div>
      <SplitButton optionsAndCallbacks={[
        {label: 'Unterabschnitt hinzufügen', callback: () => addSubsegment(createEmptySubsegment)},
        {label: 'Haltestelle', disabled: true},
        {label: 'Busspur', disabled: true},
        {label: 'Einfahrt', disabled: true}
      ]}/>
      <form>
        {renderDetails()}
      </form>
    </div>
  )
}
