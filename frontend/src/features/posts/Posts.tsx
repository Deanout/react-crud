import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {useAppSelector } from "../../app/hooks";
import Post from './Post';
import PostForm from './PostForm';
import { fetchPostsAsync, selectPosts, selectStatus, Statuses } from './postSlice';

function Posts() {
  const posts = useAppSelector(selectPosts);
  const status = useAppSelector(selectStatus)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPostsAsync());
  }, [dispatch])

  let contents;

  if (status !== Statuses.UpToDate) {
    contents = <div>{status}</div>
  } else {
      contents = <div className="card">
        <div className="card-body">
            <h3>{status}</h3>
            <PostForm />
            {posts && posts.length > 0 && posts.map(post => {
                return <div key={post.id} style={{margin:"5em"}}>
                    <Post 
                        dispatch={dispatch}
                        post={post}
                    />
                </div>
            })}
            </div>
      </div>
  }

  return <div><h1>Posts</h1>
        {contents}
  </div>
}

export default Posts;
