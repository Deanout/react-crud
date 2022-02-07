import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {useAppSelector } from "../../app/hooks";
import Post from './Post';
import PostForm from './PostForm';
import { fetchPostsAsync, selectPosts, selectStatus, Statuses, updatePostAsync } from './postSlice';

function Posts() {
  const posts = useAppSelector(selectPosts);
  const status = useAppSelector(selectStatus)
  const dispatch = useDispatch();

  const [postToEdit, setPostToEdit] = useState(0);

  useEffect(() => {
    dispatch(fetchPostsAsync());
  }, [dispatch])

  function toggleEditForm(post_id?:number) {
      if (postToEdit === post_id) {
          setPostToEdit(0);
      } else {
            setPostToEdit(post_id as number);
      }
  }

  function submitEdit(formData:any) {
      dispatch(updatePostAsync(formData));
      toggleEditForm();
  }

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
                        toggleEditForm={() => toggleEditForm(post.id)}
                        postToEdit={postToEdit}
                        submitEdit={submitEdit}
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
