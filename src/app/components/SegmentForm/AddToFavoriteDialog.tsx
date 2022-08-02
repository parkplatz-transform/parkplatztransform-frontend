import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import segmentFormState from '../../state/SegmentFormState';

const AddToFavoriteDialog = observer(({ formState }) => {
  const errorText =
    formState.subsegmentNameForFavorites &&
    formState.favorites
      .map((favorite) => favorite.name)
      .includes(formState.subsegmentNameForFavorites)
      ? 'Name ist bereits vergeben'
      : null;

  const saveable = !errorText && formState.subsegmentNameToFavorite;

  return (
    <Dialog
      open={formState.subsegmentToFavorite !== null}
      onClose={action(() => formState.onSaveFavorite())}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="dialog-add-subsegment-to-favorites">
        Neuer Favorit
      </DialogTitle>
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
          onChange={(event) =>
            formState.setSubsegmentNameForFavorites(event.target.value)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={action(() => formState.clearAddFavoriteState())}
          color="primary"
        >
          Abbrechen
        </Button>
        <Button
          onClick={action(() => formState.onSaveFavorite())}
          color="primary"
          disabled={!saveable}
        >
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const connector = () => <AddToFavoriteDialog formState={segmentFormState} />;

export default connector;
