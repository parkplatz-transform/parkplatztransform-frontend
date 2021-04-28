import React from 'react';
import { useMutate } from 'restful-react';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { routes, headers } from '../../helpers/api'

const FORM_STATE = Object.freeze({
  INITIAL: Symbol('INITIAL'),
  FAILURE: Symbol('FAILURE'),
  SUCCESS: Symbol('RECORDING')
})

export default function LoginForm({ open, setOpen }) {
  const [email, setEmail] = React.useState('')
  const [accepted, setAccepted] = React.useState(false)
  const [formState, setFormState] = React.useState(FORM_STATE.INITIAL)
  const { mutate } = useMutate({
    verb: 'POST',
    path: routes.users,
    headers: headers.contentJSON
  });

  function isValid() {
    return (email.length > 0) && accepted
  }

  const requestMagicLink = () => {
    mutate({ email, accepted_terms_and_conditions: accepted }).catch((error) => {
      setFormState(FORM_STATE.FAILURE)
    }).then((response) => {
      if (response?.email) {
        setFormState(FORM_STATE.SUCCESS)
      } else {
        setFormState(FORM_STATE.FAILURE)
      }
    })
  }

  function renderInitial() {
    return (
      <React.Fragment>
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bitte gib deine E-Mail-Adresse ein, um dich bei ParkplatzTransform anzumelden.
            </DialogContentText>
          <TextField
            error={(email.length && !email.includes('@'))}
            autoFocus
            margin="dense"
            id="name"
            label="E-Mail-Adresse"
            type="email"
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <FormControlLabel control={
            <Checkbox
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              color="primary"
            />
          } label={
            <p>Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> gelesen und akzeptiere sie</p>
          } />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Abbrechen
          </Button>
          <Button onClick={requestMagicLink} color="primary" disabled={!isValid()}>
            Anmelden
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }

  function renderSuccess() {
    return (
      <div>
        <DialogTitle id="form-dialog-title">E-Mail versendet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Wir haben dir eine E-Mail an {email} geschickt. Bitte klicke auf den Link in der E-Mail, um die Anmeldung abzuschließen. Du kannst dieses Fenster schließen.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false)
            setFormState(FORM_STATE.INITIAL)
          }} color="primary">
            Fertig
          </Button>
        </DialogActions>
      </div>
    )
  }

  function renderFailure() {
    return (
      <div>
        <DialogTitle id="form-dialog-title">Login fehlgeschlagen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bitte überprüfe die E-Mail-Adresse und probiere es noch einmal. Während der Entwickling müssen E-Mail-Adressen hinterlegt sein, bevor du dich einloggen kannst.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormState(FORM_STATE.INITIAL)} color="primary">
            Erneut versuchen
          </Button>
        </DialogActions>
      </div>
    )
  }

  const views = {
    [FORM_STATE.INITIAL]: renderInitial,
    [FORM_STATE.SUCCESS]: renderSuccess,
    [FORM_STATE.FAILURE]: renderFailure,
  }

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
        {views[formState]()}
      </Dialog>
    </div>
  )
}
