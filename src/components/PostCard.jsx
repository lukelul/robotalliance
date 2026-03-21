import { useNavigate } from 'react-router-dom'
import { usePosts } from '../context/PostsContext'
import { avatarGradients, companies } from '../data/mockData'
import Avatar from './Avatar'

export default function PostCard({ post }) {
  const { toggleLike } = usePosts()
  const navigate = useNavigate()

  const company = post.serverId ? companies.find(c => c.id === post.serverId) : null
  const avatarBg = avatarGradients[post.avatar] || post.color || '#0ea5e9'

  return (
    <div className="rounded-xl border border-blue-500/10 hover:border-blue-500/20 transition-colors overflow-hidden"
      style={{ background: 'var(--surface)' }}>

      {/* Image banner */}
      {post.image && (
        <div className="w-full h-28 flex items-center justify-center text-4xl"
          style={{ background: `linear-gradient(135deg, ${post.image}22, ${post.image}08)`, borderBottom: '1px solid var(--border)' }}>
          <span style={{ opacity: 0.15, fontSize: '64px' }}>🤖</span>
        </div>
      )}

      <div className="p-4">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar photo={post.photo} avatar={post.avatar} color={avatarBg} size={32} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">{post.author}</span>
              {company && (
                <button
                  onClick={() => navigate(`/server/${post.serverId}`)}
                  className="text-xs px-1.5 py-0.5 rounded border border-blue-500/20 text-blue-300/70 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                  style={{ background: 'var(--input-bg)' }}
                >
                  {company.name}
                </button>
              )}
            </div>
            <div className="text-xs text-blue-300/40 truncate">{post.title} · {post.time}</div>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-blue-100/80 leading-relaxed whitespace-pre-line mb-3">{post.content}</p>

        {/* External link */}
        {post.externalUrl && (
          <a href={post.externalUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mb-3 border border-cyan-500/20 rounded-lg px-2.5 py-1.5"
            style={{ background: 'var(--input-bg)' }}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View paper / link
          </a>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full text-cyan-300/60 border border-cyan-500/15"
                style={{ background: 'var(--input-bg)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-blue-500/08">
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${post.liked ? 'text-pink-400' : 'text-blue-300/40 hover:text-pink-400'}`}>
            <svg className="w-3.5 h-3.5" fill={post.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-blue-300/40 hover:text-blue-300 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-blue-300/40 hover:text-blue-300 transition-colors ml-auto">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
