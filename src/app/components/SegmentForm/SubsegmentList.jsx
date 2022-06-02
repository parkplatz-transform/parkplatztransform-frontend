import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import red from '@material-ui/core/colors/red';
import lightGreen from '@material-ui/core/colors/lightGreen';
import segmentFormState from '../../state/SegmentFormState';

const SubsegmentList = observer(({ formState }) => {
  if (
    formState.segment.properties &&
    formState.segment.properties.subsegments
  ) {
    const listItems = formState.segment.properties.subsegments
      .slice()
      .sort((a, b) => a.order_number > b.order_number)
      .map((subsegment) => {
        let title;
        if (subsegment.parking_allowed === true) {
          title = 'Parken';
        } else if (subsegment.parking_allowed === false) {
          title = 'Kein Parken';
        } else {
          title = 'Neuer Unterabschnitt';
        }
        let details = '';
        if (subsegment.length_in_meters) {
          details = `${subsegment.length_in_meters} m`;
        } else if (subsegment.car_count) {
          details = `${subsegment.car_count} Stellplätze`;
        }

        const error =
          formState.errors && formState.errors[subsegment.order_number];

        return (
          <ListItem
            key={subsegment.order_number}
            button
            style={{ backgroundColor: error ? red[100] : (subsegment?.order_number === formState.selectedSubsegmentIndex ? lightGreen[100] : lightGreen[50]) }}
            selected={
              subsegment?.order_number === formState.selectedSubsegmentIndex
            }
            onClick={() =>
              formState.setSelectedSubsegmentIndex(subsegment.order_number)
            }
          >
            <ListItemText
              primary={title}
              secondary={error ? error.message : details}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => formState.duplicateSubsegment(subsegment)}
                edge="end"
                aria-label="duplicate"
              >
                <FileCopyIcon />
              </IconButton>
              <IconButton
                onClick={() => formState.deleteSubsegment(subsegment)}
                edge="end"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });

    return <List>{listItems}</List>;
  }
  return null;
});

const connector = () => <SubsegmentList formState={segmentFormState} />;

export default connector;
