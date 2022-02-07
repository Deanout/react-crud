import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import produce from "immer";
import { RootState } from "../../app/store"
import { fetchPosts, createPost, destroyPost, updatePost } from './postAPI'

export enum Statuses {
    Initial = "Not Fetched",
    Loading = "Loading...",
    UpToDate = "Up To Date",
    Deleted = "Deleted",
    Error = "Error"
}

export interface PostFormData {
    post: {
        id?: string;
        title: string;
        body: string;
    }
}

export interface PostState {
    id?: number;
    title?: string;
    body?: string;
    created_at?: any;
    updated_at?: any;
}

export interface PostsState {
    posts: PostState[];
    status: string;
}

export interface PostUpdateData {
    post_id: number;
    post: PostState;
}

export interface PostDeleteData {
    post: {
        post_id: number;
    }
}

const initialState: PostsState = {
    posts: [
        {
            id: 0,
            title: "",
            body: "",
            created_at: "",
            updated_at: "",
        }
    ],
    status: Statuses.Initial
}

export const fetchPostsAsync = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await fetchPosts();
        return response;
    }
)

export const createPostAsync = createAsyncThunk(
    'posts/createPost',
    async (payload: PostFormData) => {
        const response = await createPost(payload);

        return response;
    }
)
export const updatePostAsync = createAsyncThunk(
    'posts/updatePost',
    async (payload: PostFormData) => {
        const response = await updatePost(payload);

        return response;
    }
)
export const destroyPostAsync = createAsyncThunk(
    'posts/destroyPost',
    async (payload: PostDeleteData) => {
        const response = await destroyPost(payload);

        return response;
    }
)

export const postSlice = createSlice({
    name: "posts",
    initialState,
    /**
     * Synchronous actions
     */
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(fetchPostsAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })            
            .addCase(fetchPostsAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
            /** Update Section */
            .addCase(createPostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(createPostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts.push(action.payload);
                    draftState.status = Statuses.UpToDate;
                })
            })            
            .addCase(createPostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
            /** Destroy Section */
            .addCase(destroyPostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(destroyPostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    draftState.posts = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })            
            .addCase(destroyPostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
            /** Update Section */
            .addCase(updatePostAsync.pending, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Loading;
                })
            })
            .addCase(updatePostAsync.fulfilled, (state, action) => {
                return produce(state, (draftState) => {
                    const index = draftState.posts.findIndex(
                        post => post.id === action.payload.id
                    );
                    draftState.posts[index] = action.payload;
                    draftState.status = Statuses.UpToDate;
                })
            })            
            .addCase(updatePostAsync.rejected, (state) => {
                return produce(state, (draftState) => {
                    draftState.status = Statuses.Error;
                })
            })
    }
})

export const {} = postSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;

export const selectStatus = (state: RootState) => state.posts.status;

export default postSlice.reducer;