import { createSlice } from '@reduxjs/toolkit'

export const postsSlice = createSlice({
    name: 'posts',
    initialState: {
      postList: [],
    },
    reducers: {
      updatePostsState: (state, action) => {
        state = {
          ...state,
          ...action
        }
      }
    }
})

export const { updatePostsState } = postsSlice.actions

export default postsSlice.reducer