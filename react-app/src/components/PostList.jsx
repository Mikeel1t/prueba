import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  return (
    <div>
      <h3>Publicaciones</h3>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;