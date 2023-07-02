
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isSaving: false,
    active: null,
  },
  reducers: {
    setSaving: (state) => {
      state.isSaving = true;
    },
    setActiveUser: (state, action) => {
      state.active = action.payload;
      state.isSaving = false;
    },
    /*          updateNote: ( state, action ) => {
                state.isSaving = false;
                state.notes = state.notes.map( note => {
    
                  if( note.id === action.payload.id ){
                    return action.payload;
                  }
    
                  return note;
                });
    
                state.messageSaved = `${ action.payload.title }, actualizada correctamente`
            },*/
    setPhotos: (state, action) => {
      state.active.images = [...state.active.images, ...action.payload]
      state.isSaving = false;
    },
  }
});

// Action creators are generated for each case reducer function
export const {
  setActiveUser,
  setSaving,
  setPhotos
} = userSlice.actions;