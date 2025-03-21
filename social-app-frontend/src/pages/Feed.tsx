import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchPosts, likePost, addComment, createPost } from '../api/posts';
import logo from '../assets/logo.png';

const Feed = () => {
  const user = useSelector((state: any) => state.auth.user);
  const userToken = useSelector((state: any) => state.auth.token);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts(userToken);

        // Modify the posts to include like status for the current user
        const postsWithUserLikeStatus = data.map((post: any) => ({
          ...post,
          hasLiked: post.likes.includes(user.id), // Check if user has liked this post
        }));

        setPosts(postsWithUserLikeStatus); // Set the posts with like status
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [userToken, user?._id]); // Re-run whenever userToken or user._id changes

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle new post submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return alert("Post cannot be empty!");

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    setPosting(true);
    try {
      const newPost = await createPost(formData, userToken);

      // ✅ Ensure new post includes the logged-in user's details
      const postWithUser = {
        ...newPost,
        user: {
          _id: user._id,
          username: user.username,
        },
        comments: [], // Ensure it's an empty array initially
        likes: [],
        hasLiked: false, // Initially, the user has not liked the post
      };

      setPosts([postWithUser, ...posts]); // Add new post to top of list
      setText("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  // Handle like button click
  const handleLikeClick = async (postId: string) => {
    try {
      await likePost(postId, userToken);

      // Update local posts state by toggling the like status
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(user._id)
                  ? post.likes.filter((id: string) => id !== user._id) // Remove user ID if already liked
                  : [...post.likes, user._id], // Add user ID if not liked
                hasLiked: !post.hasLiked, // Toggle the like status
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Handle comment input change
  const handleCommentChange = (postId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment({
      ...newComment,
      [postId]: event.target.value
    });
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId: string) => {
    const commentText = newComment[postId];
    if (commentText) {
      try {
        const updatedPost = await addComment(postId, commentText, userToken);

        // ✅ Ensure new comment includes the logged-in user's details
        const lastComment = updatedPost.comments[updatedPost.comments.length - 1];
        const commentWithUser = {
          ...lastComment,
          user: {
            _id: user._id,
            username: user.username,
          },
        };

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, commentWithUser] }
              : post
          )
        );
        setNewComment({ ...newComment, [postId]: '' });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div className="feed-container">
      <header className="header">
        <h1>Welcome  {user?.username}!</h1>
      </header>

      {/* Create Post Form */}
      <div className="create-post-card">
        <form onSubmit={handleSubmit} className="create-post-form">
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          ></textarea>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button type="submit" disabled={posting}>
            {posting ? "Posting..." : "Post"}
          </button>
        </form>
      </div>

      <h3>Recent Posts</h3>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <p><strong>{post.user?.username || "Unknown User"}</strong></p>
                  <p>{post.text}</p>
                </div>
                {post.image && <img src={post.image} alt="Post" className="post-image" />}
                
                {/* Like Button */}
                <div className="post-footer">
                  <button
                    className={`like-button ${post.hasLiked ? 'liked' : ''}`}
                    onClick={() => handleLikeClick(post._id)}
                    disabled={post.hasLiked}
                  >
                    ❤️ <span>{post.likes.length} Likes</span>
                  </button>
                </div>

                {/* Comment Section */}
                <div className="comments-section">
                  <h4>Comments</h4>
                  <div className="comments-list">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment: { _id: React.Key | null | undefined; user: { username: any; }; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; }) => (
                        <div key={comment._id} className="comment">
                          <p><strong>{comment.user?.username || "Unknown User"}</strong>: {comment.text}</p>
                          <p>{new Date(comment.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                  <div className="comment-input">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment[post._id] || ''}
                      onChange={(e) => handleCommentChange(post._id, e)}
                    />
                    <button onClick={() => handleCommentSubmit(post._id)}>Post</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
