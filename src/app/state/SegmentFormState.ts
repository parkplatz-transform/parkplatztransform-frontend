import { makeAutoObservable } from 'mobx';

import { getSegment, Segment, Subsegment, updateSegment } from '../../helpers/api';
import { sanitizeSegment } from '../recording/Segment';
import subsegmentSchema from '../recording/SubsegmentSchema';
import mapContext from '../map/MapContext';
import addPredefinedFavorites, { Favorite } from '../components/SegmentForm/Favourites';
import { createEmptySubsegment } from '../recording/Subsegments';
const LOCAL_STORAGE_KEY_FAVORITES = 'subsegmentFavorites';


export class SegmentFormState {
  segment: Segment | null = null;
  isDirty = false;
  selectedSubsegmentIndex: number = 0;
  favorites: Favorite[] = [];
  errors: Record<number, Error> = {};
  subsegmentToFavorite: Subsegment | null = null;
  subsegmentNameToFavorite: string | null = null;

  get subsegment() {
    if (this.segment?.properties?.subsegments && this.selectedSubsegmentIndex) {
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

  setSubsegmentToAddToFavorites(subsegment: Subsegment) {
    this.subsegmentToFavorite = subsegment;
  }

  setSubsegmentNameForFavorites(name: string) {
    this.subsegmentNameToFavorite = name;
  }

  clearAddFavoriteState() {
    this.subsegmentToFavorite = null;
    this.subsegmentNameToFavorite = null;
  }

  setErrors(errors: Record<number, Error>) {
    this.errors = errors;
  }

  async save() {
    await Promise.all(
      this.segment?.properties.subsegments.map(async (sub, idx) => {
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
      if (this.segment?.properties.subsegments.length === 0) {
        this.segment.properties.has_subsegments = false
      } else if (this.segment) {
        this.segment.properties.has_subsegments = true
      }
      mapContext.draw.add(this.segment);
      await this.onSegmentChanged(this.segment);
      mapContext.draw.changeMode('simple_select');
    }
  }

  updateSegment(segmentChangeFunction) {
    return (event: Event) => {
      this.isDirty = true
      segmentChangeFunction(this.segment, event?.target?.value);
    };
  }

  /**
   *
   * @param subsegmentChangeFunction - A function that takes a subsegment as first argument. A optional second arg
   *   takes the event's value
   */
  updateSubsegment(subsegmentChangeFunction) {
    return (event: Event) => {
      this.isDirty = true
      subsegmentChangeFunction(
        this.subsegment,
        event?.target?.value || event?.target?.checked || event
      );
    };
  }

  updateSubsegmentByCheckbox(subsegmentChangeFunction) {
    return (checked) => {
      this.isDirty = true
      subsegmentChangeFunction(this.subsegment, checked);
    };
  }

  setFavorites(favorites: Favorite[]) {
    this.favorites = favorites;
  }

  addFavorite(name: string, subsegmentToFavorite: Subsegment) {
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

  addSubsegment(subsegment: Subsegment) {
    this.isDirty = true
    if (this.segment && !this.segment.properties) {
      this.segment.properties = {};
    }
    if (this.segment && !this.segment.properties.subsegments) {
      this.segment.properties.subsegments = [];
    }
    if (this.segment) {
      subsegment.order_number = this.segment.properties.subsegments.length ?? 0;
      this.segment.properties.subsegments.push(subsegment);
      this.setSelectedSubsegmentIndex(subsegment.order_number);
    }
  }

  duplicateSubsegment(subsegment: Subsegment) {
    this.isDirty = true
    const newSubsegment = { ...subsegment };
    const newSubsegments = [...this.segment.properties.subsegments];
    // Insert in the right position  --> at end of list
    const newOrderIndex = this.segment?.properties.subsegments.length;
    newSubsegments.push(newSubsegment);
    this.segment.properties.subsegments = newSubsegments.map((sub, idx) => ({
      ...sub,
      order_number: idx,
    })); // Normalize the subsegment order
    this.setSelectedSubsegmentIndex(newOrderIndex);
  }

  deleteSubsegment(subsegment: Subsegment) {
    this.isDirty = true
    this.segment.properties.subsegments = this.segment?.properties.subsegments ?? []
      .filter((s) => s !== subsegment)
      .map((sub, idx) => ({ ...sub, order_number: idx }));
    this.selectedSubsegmentIndex = null;
  }

  setSelectedSubsegmentIndex(index: number) {
    this.selectedSubsegmentIndex = index;
  }

  setSegment(segment: Segment) {
    this.segment = segment
    this.segment.properties.subsegments = segment.properties.subsegments
      .sort((a, b) => a.order_number > b.order_number)
  }

  async onSegmentSelect(segment: Segment | null) {
    try {
      if (segment === null) {
        if (this.segment !== null && this.isDirty) {
          const geo = mapContext.draw.get(this.segment.id)?.geometry
          await updateSegment(sanitizeSegment({ ...this.segment, geometry: geo }))
          this.isDirty = false
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
    } catch(error) {
      return null
    }
  }

  async onSegmentChanged(segment: Segment) {
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
