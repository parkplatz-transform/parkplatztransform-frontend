import { makeAutoObservable } from 'mobx';

import {
  deleteSegment,
  getSegment,
  getSegments,
  postSegment,
  updateSegment,
} from '../../helpers/api';
import { sanitizeSegment } from '../recording/Segment';
import { bboxContainsBBox, bboxIntersectsBBox } from '../../helpers/geocalc';
import getString from '../../strings';
import { PermissionsError } from '../../helpers/errors';

class MapState {
  loadedBoundingBoxes = [];
  allSegmentsById = {};

  segment = null;

  toast = null;

  constructor() {
    makeAutoObservable(this);
  }

  get segments() {
    return Object.values(this.allSegmentsById);
  }

  setAlertDisplayed(content) {
    this.toast = content;
  }

  async onSegmentCreated(segment) {
    try {
      const createdSegment = await postSegment({
        ...segment,
        properties: { subsegments: [] },
      });
      this.addSegment(createdSegment);
      this.segment = createdSegment;
      return createdSegment;
    } catch (e) {}
  }

  async onSegmentEdited(updatedSegment) {
    this.selectedSegmentId = null;
    this.addSegments([updatedSegment]);
    try {
      this.setAlertDisplayed({
        severity: 'success',
        message: getString('segment_update_success'),
      });
      await updateSegment(updatedSegment);
    } catch (e) {
      if (e instanceof PermissionsError) {
        this.setAlertDisplayed({
          severity: 'error',
          message: getString('permissions_failure'),
        });
      } else {
        this.setAlertDisplayed({
          severity: 'error',
          message: getString('segment_update_failure'),
        });
      }
    }
  }

  async onSegmentSelect(id) {
    if (id === null) {
      this.segment = null;
      return;
    }
    if (id === this.selectedSegmentId) {
      return;
    }
    const segmentWithDetails = await getSegment(id);
    if (segmentWithDetails) {
      this.segment = segmentWithDetails;
    }
  }

  async onBoundsChanged(bounds) {
    // be less precise with map bounds and load larger chunks, avoid re-fetch on every little map move
    // rounding precision depends on how big the requested area is
    const boundingBox = {
      swLng: Math.floor(bounds._sw.lng * 100) / 100,
      swLat: Math.floor(bounds._sw.lat * 100) / 100,
      neLng: Math.ceil(bounds._ne.lng * 100) / 100,
      neLat: Math.ceil(bounds._ne.lat * 100) / 100,
    };

    console.log();

    if (this.checkIfBoundingBoxWasRequestedBefore(boundingBox)) {
      return;
    }

    const topRight = `${boundingBox.neLng},${boundingBox.neLat}`;
    const bottomRight = `${boundingBox.swLng},${boundingBox.neLat}`;
    const bottomLeft = `${boundingBox.swLng},${boundingBox.swLat}`;
    const topLeft = `${boundingBox.neLng},${boundingBox.swLat}`;

    const loadedSegments = this.getLoadedSegmentIdsInBounds(boundingBox);
    const excludedIds = loadedSegments.map((segment) => segment.id);
    const latestModificationDate =
      this.getLatestModificationDate(loadedSegments);
    const boundingBoxString = `${topRight},${bottomRight},${bottomLeft},${topLeft},${topRight}`;
    this.loadedBoundingBoxes.push(boundingBox);
    try {
      const geoJson = await getSegments(
        boundingBoxString,
        excludedIds,
        latestModificationDate
      );
      if (geoJson.features && geoJson.features.length) {
        this.addSegments(geoJson.features);
      }
    } catch (e) {
      console.log(e);
      this.setAlertDisplayed({
        severity: 'error',
        message: getString('segment_loaded_failure'),
      });
      this.loadedBoundingBoxes = this.loadedBoundingBoxes.filter(
        (bbox) => bbox !== boundingBox
      );
    }
  }

  checkIfBoundingBoxWasRequestedBefore(boundingBox) {
    return this.loadedBoundingBoxes.some((bbox) =>
      bboxContainsBBox(bbox, boundingBox)
    );
  }

  getLoadedSegmentIdsInBounds(boundingBox) {
    return Object.values(this.allSegmentsById).filter((segment) => {
      if (segment.bbox) {
        const swLng = segment.bbox[0];
        const swLat = segment.bbox[1];
        const neLng = segment.bbox[2];
        const neLat = segment.bbox[3];
        return bboxIntersectsBBox(boundingBox, { swLng, swLat, neLng, neLat });
      }
      return false;
    });
  }

  getLatestModificationDate(segments) {
    return this.segments
      .map((segment) => segment.properties?.modified_at)
      .filter(Boolean)
      .sort()
      .reverse()[0];
  }

  addSegment(newOrUpdatedSegment) {
    this.addSegments([newOrUpdatedSegment]);
  }

  addSegments(newOrUpdatedSegments) {
    if (!newOrUpdatedSegments) {
      return;
    }
    const keyedSegments = {}
    for (var i = newOrUpdatedSegments.length - 1; i >= 0; i--) {
      keyedSegments[newOrUpdatedSegments[i].id] = newOrUpdatedSegments[i]
    }
    this.allSegmentsById = keyedSegments;
  }

  async onSegmentChanged(segment) {
    try {
      const sanitizedSegment = sanitizeSegment(segment);
      console.log(this);

      if (!sanitizedSegment) {
        this.setAlertDisplayed({
          severity: 'error',
          message: getString('subsegment_invalid'),
        });
      }

      const updatedSegment = await updateSegment(sanitizedSegment);
      this.addSegment(updatedSegment);
      console.log('Client set:');
      console.table(segment.properties.subsegments);
      console.log('Server returned:');
      console.table(updatedSegment.properties.subsegments);
      this.setAlertDisplayed({
        severity: 'success',
        message: getString('segment_update_success', sanitizedSegment.id),
      });
      return true;
    } catch (e) {
      console.log(e);
      // this.setAlertDisplayed({severity: 'error', message: getString('segment_update_failure')})
      return false;
    }
  }

  async onSegmentDeleted(id) {
    try {
      this.setAlertDisplayed({
        severity: 'success',
        message: getString('segment_delete_success', 1),
      });
      this.segment = null;
      delete this.allSegmentsById[id];
      await deleteSegment(id);
    } catch (e) {
      this.setAlertDisplayed({
        severity: 'error',
        message: getString('segment_delete_failure', 1),
      });
      return Promise.reject(e);
    }
  }
}

const mapState = new MapState();
export default mapState;
