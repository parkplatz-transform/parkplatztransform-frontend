import { makeAutoObservable, autorun } from 'mobx';

import { getSegment, updateSegment } from '../../helpers/api';
import { sanitizeSegment } from '../recording/Segment';
import subsegmentSchema from '../recording/SubsegmentSchema';
import mapContext from '../map/MapContext';
import addPredefinedFavorites from '../components/SegmentForm/Favourites';
const LOCAL_STORAGE_KEY_FAVORITES = 'subsegmentFavorites';

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

class SegmentFormState {
  segment = null;
  selectedSubsegmentIndex = null;
  favorites = [];
  errors = {};
  subsegmentToFavorite = null;
  subsegmentNameToFavorite = null;

  get subsegment() {
    if (this.segment?.properties?.subsegments) {
     return this.segment?.properties?.subsegments[this.selectedSubsegmentIndex];  
    }
    return null
  }

  get isFormValid() {
    return Object.keys(this.errors).length === 0;
  }

  constructor() {
    makeAutoObservable(this);

    var favoritesString = localStorage.getItem(LOCAL_STORAGE_KEY_FAVORITES);
    if (!favoritesString) {
      favoritesString = '[]';
    }

    var favObj = JSON.parse(favoritesString);
    if (!favObj) {
      favObj = [];
    }
    addPredefinedFavorites(favObj);
    this.setFavorites(favObj);
  }

  onSaveFavorite() {
    this.addFavorite(this.subsegmentNameToFavorite, this.subsegmentToFavorite);
    this.clearAddFavoriteState();
  }

  setSubsegmentToAddToFavorites(subsegment) {
    this.subsegmentToFavorite = subsegment;
  }

  setSubsegmentNameForFavorites(name) {
    this.subsegmentNameToFavorite = name;
  }

  clearAddFavoriteState() {
    this.subsegmentToFavorite = null;
    this.subsegmentNameToFavorite = null;
  }

  setErrors(errors) {
    this.errors = errors;
  }

  async save() {
    await Promise.all(
      this.segment.properties.subsegments.map(async (sub, idx) => {
        try {
          await subsegmentSchema.validate(sub);
        } catch (error) {
          this.setErrors({
            ...this.errors,
            [idx]: {
              message: error.message.replace(error.path, ''),
              path: error.path,
            },
          });
        }
      })
    );

    if (this.isFormValid) {
      if (this.segment.properties.subsegments.length === 0) {
        this.segment.properties.has_subsegments = false
      } else {
        this.segment.properties.has_subsegments = true
      }
      mapContext.draw.add(this.segment);
      await this.onSegmentChanged(this.segment);
      mapContext.draw.changeMode('simple_select');
    }
  }

  updateSegment(segmentChangeFunction) {
    return (event) => {
      segmentChangeFunction(this.segment, event?.target?.value);
    };
  }

  /**
   *
   * @param subsegmentChangeFunction - A function that takes a subsegment as first argument. A optional second arg
   *   takes the event's value
   */
  updateSubsegment(subsegmentChangeFunction) {
    return (event) => {
      subsegmentChangeFunction(
        this.subsegment,
        event?.target?.value || event?.target?.checked || event
      );
    };
  }

  updateSubsegmentByCheckbox(subsegmentChangeFunction) {
    return (checked) => {
      subsegmentChangeFunction(this.subsegment, checked);
    };
  }

  setFavorites(favorites) {
    this.favorites = favorites;
  }

  addFavorite(name, subsegmentToFavorite) {
    const subsegment = {
      ...subsegmentToFavorite,
      id: null,
      order_number: null,
    };
    const updatedFavorites = this.favorites.concat({ name, subsegment });
    this.setFavorites(updatedFavorites);
    localStorage.setItem(
      LOCAL_STORAGE_KEY_FAVORITES,
      JSON.stringify(updatedFavorites)
    );
  }

  removeFavorite(name) {
    const updatedFavorites = this.favorites.filter(
      (favorite) => favorite.name !== name
    );
    this.setFavorites(updatedFavorites);
    localStorage.setItem(
      LOCAL_STORAGE_KEY_FAVORITES,
      JSON.stringify(updatedFavorites)
    );
  }

  addSubsegment(subsegment) {
    if (!this.segment.properties) {
      this.segment.properties = {};
    }
    if (!this.segment.properties.subsegments) {
      this.segment.properties.subsegments = [];
    }
    subsegment.order_number = this.segment.properties.subsegments.length;
    this.segment.properties.subsegments.push(subsegment);
    this.setSelectedSubsegmentIndex(subsegment.order_number);
  }

  duplicateSubsegment(subsegment) {
    const newSubsegment = { ...subsegment };
    const newSubsegments = [...this.segment.properties.subsegments];
    // Insert in the right position  --> at end of list
    const newOrderIndex = this.segment.properties.subsegments.length;
    newSubsegments.push(newSubsegment);
    this.segment.properties.subsegments = newSubsegments.map((sub, idx) => ({
      ...sub,
      order_number: idx,
    })); // Normalize the subsegment order
    this.setSelectedSubsegmentIndex(newOrderIndex);
  }

  deleteSubsegment(subsegment) {
    this.segment.properties.subsegments = this.segment.properties.subsegments
      .filter((s) => s !== subsegment)
      .map((sub, idx) => ({ ...sub, order_number: idx }));
    this.selectedSubsegmentIndex = null;
  }

  setSelectedSubsegmentIndex(index) {
    this.selectedSubsegmentIndex = index;
  }

  setSegment(segment) {
    this.segment = segment
  }

  async onSegmentSelect(segment) {
    console.log(segment?.geometry)
    if (segment === null) {
      if (this.segment !== null) {
        const geo = mapContext.draw.get(this.segment.id)?.geometry
        await updateSegment(sanitizeSegment({ ...this.segment, geo }))  
      }
      this.segment = null;
      return;
    }
    this.setSegment(segment);
    const segmentWithDetails = await getSegment(segment.id);
    if (segmentWithDetails) {
      this.setSegment(segmentWithDetails)
      if (segmentWithDetails.properties.subsegments.length > 0) {
        this.setSelectedSubsegmentIndex(0)
      }
    }
    
    return segmentWithDetails
  }

  async onSegmentChanged(segment) {
    try {
      const sanitizedSegment = sanitizeSegment(segment);
      const updatedSegment = await updateSegment(sanitizedSegment);
      console.log('Client set:');
      console.table(segment.properties.subsegments);
      console.log('Server returned:');
      console.table(updatedSegment.properties.subsegments);
      this.setSegment(updatedSegment)
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

const segmentFormState = new SegmentFormState();
export default segmentFormState;
