import { createContext, useContext, useState } from 'react'
import { initialPosts } from '../data/mockData'

const PostsContext = createContext(null)

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts)

  const addPost = (postData) => {
    const newPost = {
      ...postData,
      id: 'post-' + Date.now(),
      time: 'Just now',
      likes: 0,
      comments: 0,
      liked: false,
    }
    setPosts(prev => [newPost, ...prev])
  }

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  return (
    <PostsContext.Provider value={{ posts, addPost, toggleLike }}>
      {children}
    </PostsContext.Provider>
  )
}

export const usePosts = () => useContext(PostsContext)
