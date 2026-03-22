import { createContext, useContext, useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, doc, updateDoc,
  arrayUnion, arrayRemove, increment, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'
import { initialPosts } from '../data/mockData'

const PostsContext = createContext(null)

export function PostsProvider({ children }) {
  const [firestorePosts, setFirestorePosts] = useState([])
  const [localPosts, setLocalPosts] = useState(initialPosts)

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => {
      setFirestorePosts(snap.docs.map(d => ({ id: d.id, _firestore: true, ...d.data() })))
    })
  }, [])

  // Merge: Firestore posts first, then mockData posts not duplicated
  const posts = [...firestorePosts, ...localPosts]

  const addPost = async (postData) => {
    if (postData._firestore !== false) {
      // Write to Firestore
      await addDoc(collection(db, 'posts'), {
        ...postData,
        likes: 0,
        likedBy: [],
        comments: 0,
        createdAt: serverTimestamp(),
      })
    } else {
      // Fallback local (shouldn't happen normally)
      setLocalPosts(prev => [{
        ...postData,
        id: 'post-' + Date.now(),
        time: 'Just now',
        likes: 0,
        comments: 0,
        liked: false,
      }, ...prev])
    }
  }

  const toggleLike = async (postId, userId) => {
    const fsPost = firestorePosts.find(p => p.id === postId)
    if (fsPost && userId) {
      const ref = doc(db, 'posts', postId)
      const alreadyLiked = fsPost.likedBy?.includes(userId)
      await updateDoc(ref, {
        likes: increment(alreadyLiked ? -1 : 1),
        likedBy: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
      })
    } else {
      setLocalPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ))
    }
  }

  return (
    <PostsContext.Provider value={{ posts, firestorePosts, addPost, toggleLike }}>
      {children}
    </PostsContext.Provider>
  )
}

export const usePosts = () => useContext(PostsContext)
