import React, { useEffect, useReducer, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import StarIcon from '@material-ui/icons/Star'
import Button from '@material-ui/core/Button'
import SplitButton from './SplitButton'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Paper from '@material-ui/core/Paper'
import red from '@material-ui/core/colors/red'
import {
  ALIGNMENT,
  ALTERNATIVE_USAGE_REASON,
  createEmptySubsegment,
  getToggleNoParkingReasonFn,
  NO_PARKING_REASONS_AND_LABEL,
  setAlignment,
  setAlternativeUsageReason,
  setCarCount,
  setDurationConstraint,
  setDurationConstraintDetails,
  setHasFee,
  setHasTimeConstraint,
  setIsMarked,
  setLengthInMeters,
  setParkingIsAllowed,
  setParkingIsNotAllowed,
  setStreetLocation,
  setTimeConstraintReason,
  setUserRestriction,
  setUserRestrictionReason,
  STREET_LOCATION,
  USER_RESTRICTIONS,
} from '../recording/Subsegments'
import clsx from 'clsx'
import getString from '../../strings'
import subsegmentSchema from '../recording/SubsegmentSchema'
import YesNoUnknownCheckbox from './YesNoUnknownCheckbox'
import DialogContentText from '@material-ui/core/DialogContentText'

const LOCAL_STORAGE_KEY_FAVORITES = 'subsegmentFavorites'

const useStyles = makeStyles((theme) => ({
  formView: {
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'auto'
  },
  list: {
    height: '25vh',
    maxHeight: 'calc(100% - 400px)',
    overflowY: 'auto'
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
  },
  bottomButton: {
    width: 'calc(100% - 30px)',
    margin: '10px 15px 70px'
  }
}))

export default function SegmentForm ({segment, onChanged, onValidationFailed}) {
  const classes = useStyles()
  const [selectedSubsegmentIndex, setSelectedSubsegmentIndex] = React.useState(0)
  const [errors, setErrors] = React.useState({})
  const [favorites, setFavorites] = React.useState([])
  const [subsegmentToAddToFavorites, setSubsegmentToAddToFavorites] = React.useState(null)
  const [subsegmentNameForFavorites, setSubsegmentNameForFavorites] = React.useState(null)
  const [isChanged, setChanged] = useReducer((updateValue, changed = true) => {
    return changed ? updateValue + 1 : 0
  }, 0)

  const prevSegmentRef = useRef(segment)
  const selectedSubsegment = () => {
    return segment.properties.subsegments[selectedSubsegmentIndex]
  }

  const isFormValid = (errs) => {
    return Object.keys(errs).length === 0
  }

  useEffect(() => {
    const favoritesString = localStorage.getItem(LOCAL_STORAGE_KEY_FAVORITES)
    if (favoritesString) {
      setFavorites(JSON.parse(favoritesString))
    }
  }, [])

  useEffect(() => {
    if (prevSegmentRef.current?.id && segment?.id !== prevSegmentRef.current?.id) {
      if (isChanged && isFormValid(errors)) {
        onChanged(prevSegmentRef.current)
      }
      prevSegmentRef.current = segment
      //setChanged(false)
      setSelectedSubsegmentIndex(0)
      setErrors({})
    }
  }, [isChanged, errors, onChanged, segment])

  function addFavorite (name, subsegmentToFavorite) {
    const subsegment = { ...subsegmentToFavorite, id: null, order_number: null }
    const updatedFavorites = favorites.concat({name, subsegment})
    setFavorites(updatedFavorites)
    localStorage.setItem(LOCAL_STORAGE_KEY_FAVORITES, JSON.stringify(updatedFavorites))
  }

  function removeFavorite (name) {
    const updatedFavorites = favorites.filter(favorite => favorite.name !== name)
    setFavorites(updatedFavorites)
    localStorage.setItem(LOCAL_STORAGE_KEY_FAVORITES, JSON.stringify(updatedFavorites))
  }

  function addSubsegment (subsegment) {
    if (!segment.properties) {
      segment.properties = {}
    }
    if (!segment.properties.subsegments) {
      segment.properties.subsegments = []
    }
    subsegment.order_number = segment.properties.subsegments.length
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

    const newSubsegments = [...segment.properties.subsegments]
    // Insert in the right position  --> at end of list
    const newOrderIndex = segment.properties.subsegments.length
    newSubsegments.push(newSubsegment)
    //TODO: probably makes more sense to just set order_number server-side
    segment.properties.subsegments = newSubsegments
      .map((sub, idx) => ({...sub, order_number: idx})) // Normalize the subsegment order
    setChanged()
    setSelectedSubsegmentIndex(newOrderIndex)
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
      subsegmentChangeFunction(selectedSubsegment(), event?.target?.value || event?.target?.checked || event)
      setChanged()
    }
  }

  function updateSubsegmentByCheckbox (subsegmentChangeFunction) {
    return (checked) => {
      subsegmentChangeFunction(selectedSubsegment(), checked)
      setChanged()
    }
  }

  async function save () {
    let errs = {}
    await Promise.all(segment.properties.subsegments.map(async (sub, idx) => {
      try {
        await subsegmentSchema.validate(sub)
      } catch (error) {
        errs = {
          ...errs, [idx]: {
            message: error.message.replace(error.path, ''),
            path: error.path
          }
        }
      }
    }))

    setErrors(errs)

    if (isFormValid(errs)) {
      const success = await onChanged(segment)
      setChanged(!success)
    }
  }

  function getKey () {
    return selectedSubsegment().order_number || 'new_subsegment'
  }

  function renderAddToFavoriteDialog () {

    const closeDialog = () => {
      setSubsegmentToAddToFavorites(null)
      setSubsegmentNameForFavorites(null)
    }

    const onSave = () => {
      addFavorite(subsegmentNameForFavorites, subsegmentToAddToFavorites)
      closeDialog()
    }

    const errorText = subsegmentNameForFavorites && favorites.map(favorite => favorite.name).includes(subsegmentNameForFavorites)
      ? 'Name ist bereits vergeben'
      : null

    const saveable = !errorText && subsegmentNameForFavorites

    return (
      <Dialog open={subsegmentToAddToFavorites !== null} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="dialog-add-subsegment-to-favorites">Neuer Favorit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unter welchem Namen soll dieser Unterabschnitt gespeichert werden?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            defaultValue={''}
            error={errorText}
            helperText={errorText}
            onChange={(event) => setSubsegmentNameForFavorites(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Abbrechen
          </Button>
          <Button onClick={onSave} color="primary" disabled={!saveable}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

    )
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
        let details = ''
        if (subsegment.length_in_meters) {
          details = `${subsegment.length_in_meters} m`
        } else if (subsegment.car_count) {
          details = `${subsegment.car_count} Stellplätze`
        }

        const error = errors && errors[subsegment.order_number]

        return (
          <ListItem
            key={subsegment.order_number}
            button
            style={{backgroundColor: error ? red[100] : null}}
            selected={subsegment?.order_number === selectedSubsegmentIndex}
            onClick={() => setSelectedSubsegmentIndex(subsegment.order_number)}
          >
            <ListItemText
              primary={title}
              secondary={error ? error.message : details}
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
    const subsegment = selectedSubsegment()
    const error = errors && errors[subsegment.order_number]
    if (subsegment.parking_allowed) {
      return (
        <React.Fragment>
          <TableRow key={`${getKey()}_length`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Länge (ca.) <i>und/oder</i> Stellplätze</div>
              {/* Length in meters */}
              <FormControl className={clsx(classes.withoutLabel, classes.fullWidth)}>
                <TextField
                  label="m"
                  required={!!error}
                  error={!!error}
                  type="number"
                  helperText={getString('helper_text_length')}
                  value={subsegment.length_in_meters}
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
                  required={!!error}
                  error={!!error}
                  type="number"
                  value={subsegment.car_count}
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
          <TableRow key={`${getKey()}_time_constraint`}>
            <TableCell align="left">

              <div className={classes.optionTitle}>Temporäres&nbsp;Parkverbot</div>

              <FormControlLabel
                control={
                  <YesNoUnknownCheckbox
                    checked={selectedSubsegment().time_constraint}
                    color={'primary'}
                    onChange={updateSubsegment(setHasTimeConstraint)}
                  />
                }
                label="Parken zeitweise verboten"/>

              {selectedSubsegment().time_constraint
                ? <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.wideTextField)}>
                  <FormLabel component="legend">Wann besteht Parkverbot?</FormLabel>
                  <TextField id={`${getKey()}_time_constraint_reason`}
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
                    value={selectedSubsegment().alternative_usage_reason || ALTERNATIVE_USAGE_REASON.UNKNOWN}
                    onChange={updateSubsegment(setAlternativeUsageReason)}
                    // variant={'outlined'}
                  >
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.UNKNOWN}>Unbekannt</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.BUS_STOP}>Haltestelle</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.BUS_LANE}>Busspur</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.MARKET}>Markt</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.LANE}>Fahrspur</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.TAXI}>Taxi</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.LOADING_ZONE}>Ladezone i.S.v. Lieferzone</MenuItem>
                    <MenuItem value={ALTERNATIVE_USAGE_REASON.OTHER}>Sonstiges</MenuItem>
                  </Select>
                </FormControl>
                : null
              }

            </TableCell>
          </TableRow>

          {/*Alignment*/}
          <TableRow key={`${getKey()}_alignment`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Parkwinkel</div>

              <FormControl className={clsx(classes.formControl, classes.fullWidth)}>
                {/*Parkposition:*/}
                <Select
                  id="select_parking_position"
                  value={selectedSubsegment().alignment || ALIGNMENT.UNKNOWN}
                  onChange={updateSubsegment(setAlignment)}
                  variant={'outlined'}
                >
                  <MenuItem value={ALIGNMENT.UNKNOWN}>unbekannt</MenuItem>
                  <MenuItem value={ALIGNMENT.PARALLEL}>parallel</MenuItem>
                  <MenuItem value={ALIGNMENT.DIAGONAL}>diagonal</MenuItem>
                  <MenuItem value={ALIGNMENT.PERPENDICULAR}>quer</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>

          {/* Other properties*/}
          <TableRow key={`${getKey()}_fee`}>
            <TableCell align="left">

              <div className={classes.optionTitle}>Weitere Eigenschaften</div>

              {/* Parking space marking */}
              <FormControlLabel
                control={
                  <YesNoUnknownCheckbox
                    checked={selectedSubsegment().marked}
                    color={'primary'}
                    onChange={updateSubsegmentByCheckbox(setIsMarked)}
                  />
                }
                label="Parkplätze sind markiert"/>

              {/* Fee */}
              <FormControlLabel
                control={
                  <YesNoUnknownCheckbox
                    checked={selectedSubsegment().fee}
                    color={'primary'}
                    onChange={updateSubsegment(setHasFee)}
                  />
                }
                label="Mit Gebühr"/>

              {/* Duration constraint */}
              <FormControlLabel
                control={
                  <YesNoUnknownCheckbox
                    checked={selectedSubsegment().duration_constraint}
                    color={'primary'}
                    onChange={updateSubsegment(setDurationConstraint)}
                  />
                }
                label="Zeitlich beschränkte Parkdauer"/>

              {selectedSubsegment().duration_constraint
                ? <FormControl className={clsx(classes.margin, classes.withoutLabel, classes.wideTextField)}>
                  <FormLabel component="legend">Details zur zeitlichen Beschränkung</FormLabel>
                  <TextField id={`${getKey()}_time_constraint_reason`}
                             multiline variant={'outlined'} style={{width: '100%'}}
                             InputLabelProps={{shrink: true}}
                             rows={3}
                             rowsMax={5}
                             value={selectedSubsegment().duration_constraint_reason}
                             onChange={updateSubsegment(setDurationConstraintDetails)}
                  />
                </FormControl>
                : null
              }

              {/* Street location */}
              <div>
                <FormControl className={clsx(classes.formControl, classes.fullWidth)}>
                  Parkposition:
                  <Select
                    id="select_parking_position"
                    value={selectedSubsegment().street_location || STREET_LOCATION.UNKNOWN}
                    onChange={updateSubsegment(setStreetLocation)}
                    variant={'outlined'}
                  >
                    <MenuItem value={STREET_LOCATION.UNKNOWN}>unbekannt</MenuItem>
                    <MenuItem value={STREET_LOCATION.STREET}>auf der Fahrbahn</MenuItem>
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
                <FormControlLabel
                  control={
                    <YesNoUnknownCheckbox
                      checked={selectedSubsegment().user_restriction}
                      color={'primary'}
                      onChange={updateSubsegment(setUserRestriction)}
                    />
                  }
                  label="Eingeschränkte Nutzergruppe"/>
                <FormControl className={clsx(classes.formControl, classes.fullWidth)}
                             disabled={!selectedSubsegment().user_restriction}>
                  Nutzergruppe:
                  <Select
                    labelId="demo-simple-select-label"
                    id="select_usage_restriction"
                    value={selectedSubsegment().user_restriction_reason || USER_RESTRICTIONS.UNKNOWN}
                    onChange={updateSubsegment(setUserRestrictionReason)}
                    variant={'outlined'}
                  >
                    {selectedSubsegment().user_restriction === false && <MenuItem value={USER_RESTRICTIONS.NO_RESTRICTION}>Alle Nutzer*innen</MenuItem>}
                    <MenuItem value={USER_RESTRICTIONS.UNKNOWN}>Unbekannte Nutzergruppe</MenuItem>
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
    const subsegment = selectedSubsegment()
    if (subsegment.parking_allowed === false) {
      return (
        <React.Fragment>

          {/*Length*/}
          <TableRow key={`${getKey()}_length`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Länge (ca.)</div>

              <FormControl className={clsx(classes.withoutLabel, classes.fullWidth)}>
                <Input
                  id="standard-adornment-weight"
                  value={subsegment.length_in_meters}
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
          <TableRow key={`${getKey()}_noparking_reason`}>
            <TableCell align="left">
              <div className={classes.optionTitle}>Gründe</div>

              <FormGroup>
                {Object.keys(NO_PARKING_REASONS_AND_LABEL).map(key => {
                  const reason = subsegment?.no_parking_reasons?.find(k => k === key)
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
    const subsegment = selectedSubsegment()
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
          <IconButton onClick={() => setSubsegmentToAddToFavorites(Object.assign({}, subsegment))} edge="end"
                      aria-label="duplicate">
            <StarIcon/>
          </IconButton>
        </div>
        <div className={classes.marginLeftRight}>

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <TableRow key={`${getKey()}_parking_allowed`}>
                  <TableCell align="left">
                    <div className={classes.optionTitle}>Öffentliches Parken</div>


                    <ButtonGroup color="primary" aria-label="outlined primary button group"
                                 className={classes.fullWidth}>
                      <Button variant={getButtonVariant(subsegment.parking_allowed === true)}
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
                <Button variant="contained" color="primary" onClick={save} className={classes.bottomButton}>
                  {getString('save')}
                </Button>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*<pre className={clsx(classes.json, classes.margin)}>{JSON.stringify(segment, null, ' ')}</pre>*/}
      </div>
    )
  }

  return (
    <div className={classes.formView} onMouseLeave={isChanged > 0 ? save : null}>
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
      <SplitButton optionsAndCallbacks={
        [
          {label: 'Unterabschnitt hinzufügen', callback: () => addSubsegment(createEmptySubsegment())},
          ...favorites.map(favorite => {
            return {
              label: favorite.name,
              callback: () => addSubsegment(Object.assign({}, favorite.subsegment)),
              deleteCallback: (name) => removeFavorite(name)
            }
          })
        ]
      }/>
      <form onChange={() => { setErrors({}) }}>
        {renderDetails()}
      </form>
      {renderAddToFavoriteDialog()}
    </div>
  )
}
