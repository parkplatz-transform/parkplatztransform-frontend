import { makeAutoObservable } from 'mobx';

import {
  deleteSegment,
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
  toast = null;

  constructor() {
    makeAutoObservable(this);
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
      return createdSegment;
    } catch (e) {}
  }

  async onSegmentEdited(updatedSegment) {
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

  async onBoundsChanged(bounds, draw) {
    // be less precise with map bounds and load larger chunks, avoid re-fetch on every little map move
    // rounding precision depends on how big the requested area is
    const boundingBox = {
      swLng: Math.floor(bounds._sw.lng * 100) / 100,
      swLat: Math.floor(bounds._sw.lat * 100) / 100,
      neLng: Math.ceil(bounds._ne.lng * 100) / 100,
      neLat: Math.ceil(bounds._ne.lat * 100) / 100,
    };

    if (this.checkIfBoundingBoxWasRequestedBefore(boundingBox)) {
      return;
    }

    const topRight = `${boundingBox.neLng},${boundingBox.neLat}`;
    const bottomRight = `${boundingBox.swLng},${boundingBox.neLat}`;
    const bottomLeft = `${boundingBox.swLng},${boundingBox.swLat}`;
    const topLeft = `${boundingBox.neLng},${boundingBox.swLat}`;

    const segments = draw.getAll().features
    const loadedSegments = this.getLoadedSegmentIdsInBounds(boundingBox, segments);
    const excludedIds = segments.map((segment) => segment.id);
    var startTime = performance.now()

    const latestModificationDate =
      this.getLatestModificationDate(loadedSegments);
      var endTime = performance.now()

    console.log(`Call to update took ${endTime - startTime} milliseconds`)

    const boundingBoxString = `${topRight},${bottomRight},${bottomLeft},${topLeft},${topRight}`;
    this.loadedBoundingBoxes.push(boundingBox);
    try {
      const geoJson = await getSegments(
        boundingBoxString,
        excludedIds,
        latestModificationDate
      );
      if (geoJson.features && geoJson.features.length) {
        draw.set({
          features: geoJson.features,
          type: 'FeatureCollection',
          id: 'ppt-feature-collection',
        })
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

  getLoadedSegmentIdsInBounds(boundingBox, segments) {
    return segments.filter((segment) => {
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
    return segments
      .map((segment) => segment.properties?.modified_at)
      .filter(Boolean)
      .sort()
      .reverse()[0];
  }

  async onSegmentChanged(segment) {
    try {
      const sanitizedSegment = sanitizeSegment(segment);
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
