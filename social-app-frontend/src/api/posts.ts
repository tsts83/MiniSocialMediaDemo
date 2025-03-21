import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

// Fetch posts
export const fetchPosts = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Like a post
export const likePost = async (postId: string, token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};


// Add a comment to a post
export const addComment = async (postId: string, commentText: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${postId}/comment`,
      { text: commentText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Create a post
export const createPost = async (postData: FormData, token: string) => {
  try {
    const res = await axios.post(`${API_URL}/posts`, postData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    return res.data;
  } catch (error: any) {
    console.error("Error creating post:", error);
    throw error.response?.data?.message || "Failed to create post.";
  }
};
