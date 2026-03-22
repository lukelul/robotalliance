import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useUser } from '../context/UserContext'

const ADMIN_EMAILS = ['lukelupvp@gmail.com']

const TABS = ['People', 'Companies', 'Events', 'News', 'Users', 'Posts']

const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#0069b4] transition-colors bg-white'
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1'

export default function AdminPage() {
  const navigate = useNavigate()
  const { firebaseUser, isLoading } = useUser()
  const [tab, setTab] = useState('People')

  const isAdmin = ADMIN_EMAILS.includes(firebaseUser?.email)

  if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-400 text-sm">Loading…</div>
  if (!firebaseUser || !isAdmin) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-gray-500 text-sm">Access denied.</p>
      <button onClick={() => navigate('/')} className="text-[#0069b4] text-sm underline">Go home</button>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen" style={{ background: '#f8fafc' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-2xl font-bold text-gray-900">Robo Alliance Admin</h1>
          </div>
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Back to site</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-[#0069b4] text-[#0069b4]' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'People' && <PeopleTab />}
        {tab === 'Companies' && <CompaniesTab />}
        {tab === 'Events' && <EventsTab />}
        {tab === 'News' && <NewsTab />}
        {tab === 'Users' && <UsersTab />}
        {tab === 'Posts' && <PostsTab />}
      </div>
    </div>
  )
}

// ── Reusable form panel ──────────────────────────────────────
function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Row({ items }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">{items}</div>
}

function SaveBtn({ loading, label = 'Save' }) {
  return (
    <button type="submit" disabled={loading}
      className="px-6 py-2 rounded-full bg-[#0069b4] text-white text-sm font-semibold hover:bg-[#005a9e] transition-colors disabled:opacity-50">
      {loading ? 'Saving…' : label}
    </button>
  )
}

function DeleteBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded">
      Delete
    </button>
  )
}

// ── People ───────────────────────────────────────────────────
const PERSON_TYPES = ['HS Student', 'College Student', 'Researcher', 'Mentor', 'Robotics Engineer', 'Enthusiast', 'Investor', 'Industry Professional']

function PeopleTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Enthusiast', school: '', title: '', bio: '', photo: '', linkedin: '' })

  const load = async () => {
    const snap = await getDocs(collection(db, 'people'))
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setLoading(true)
    const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const colors = ['#06b6d4','#8b5cf6','#f59e0b','#10b981','#ec4899','#f97316','#0069b4']
    await addDoc(collection(db, 'people'), {
      ...form,
      avatar: initials,
      color: colors[Math.floor(Math.random() * colors.length)],
      followers: 0,
      online: false,
      createdAt: serverTimestamp(),
    })
    setForm({ name: '', type: 'Enthusiast', school: '', title: '', bio: '', photo: '', linkedin: '' })
    setLoading(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this person?')) return
    await deleteDoc(doc(db, 'people', id))
    load()
  }

  return (
    <>
      <Panel title="Add Person">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Row items={[
            <div key="name"><label className={labelCls}>Full Name *</label><input required value={form.name} onChange={set('name')} placeholder="Jane Smith" className={inputCls} /></div>,
            <div key="type"><label className={labelCls}>Type</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                {PERSON_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>,
          ]} />
          <Row items={[
            <div key="school"><label className={labelCls}>School / Organization</label><input value={form.school} onChange={set('school')} placeholder="MIT, Boston Dynamics…" className={inputCls} /></div>,
            <div key="title"><label className={labelCls}>Title / Role</label><input value={form.title} onChange={set('title')} placeholder="Robotics Engineer" className={inputCls} /></div>,
          ]} />
          <Row items={[
            <div key="photo"><label className={labelCls}>Photo URL</label><input value={form.photo} onChange={set('photo')} placeholder="https://…" className={inputCls} /></div>,
            <div key="linkedin"><label className={labelCls}>LinkedIn URL</label><input value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/…" className={inputCls} /></div>,
          ]} />
          <div><label className={labelCls}>Bio</label><textarea value={form.bio} onChange={set('bio')} rows={3} placeholder="Short bio…" className={inputCls + ' resize-none'} /></div>
          <SaveBtn loading={loading} label="Add Person" />
        </form>
      </Panel>

      <Panel title={`People in Firestore (${items.length})`}>
        {items.length === 0 && <p className="text-sm text-gray-400">No people added yet.</p>}
        <div className="space-y-3">
          {items.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                <div className="text-xs text-gray-400">{p.type} · {p.school}</div>
              </div>
              <DeleteBtn onClick={() => remove(p.id)} />
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

// ── Companies ────────────────────────────────────────────────
function CompaniesTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', tagline: '', logo: '', members: '', website: '' })

  const load = async () => {
    const snap = await getDocs(collection(db, 'companies'))
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setLoading(true)
    const avatar = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    await addDoc(collection(db, 'companies'), {
      ...form,
      avatar,
      members: parseInt(form.members) || 0,
      online: 0,
      color: '#0069b4',
      verified: false,
      createdAt: serverTimestamp(),
    })
    setForm({ name: '', category: '', tagline: '', logo: '', members: '', website: '' })
    setLoading(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this company?')) return
    await deleteDoc(doc(db, 'companies', id))
    load()
  }

  return (
    <>
      <Panel title="Add Company">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Row items={[
            <div key="name"><label className={labelCls}>Company Name *</label><input required value={form.name} onChange={set('name')} placeholder="Acme Robotics" className={inputCls} /></div>,
            <div key="cat"><label className={labelCls}>Category</label><input value={form.category} onChange={set('category')} placeholder="Humanoid Robots, Industrial…" className={inputCls} /></div>,
          ]} />
          <div><label className={labelCls}>Tagline</label><input value={form.tagline} onChange={set('tagline')} placeholder="Short company tagline" className={inputCls} /></div>
          <Row items={[
            <div key="logo"><label className={labelCls}>Logo URL</label><input value={form.logo} onChange={set('logo')} placeholder="https://logo.clearbit.com/…" className={inputCls} /></div>,
            <div key="web"><label className={labelCls}>Website</label><input value={form.website} onChange={set('website')} placeholder="https://…" className={inputCls} /></div>,
          ]} />
          <div><label className={labelCls}>Member Count</label><input type="number" value={form.members} onChange={set('members')} placeholder="0" className={inputCls} /></div>
          <SaveBtn loading={loading} label="Add Company" />
        </form>
      </Panel>

      <Panel title={`Companies in Firestore (${items.length})`}>
        {items.length === 0 && <p className="text-sm text-gray-400">No companies added yet.</p>}
        <div className="space-y-3">
          {items.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-400">{c.category} · {c.members} members</div>
              </div>
              <DeleteBtn onClick={() => remove(c.id)} />
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

// ── Events ───────────────────────────────────────────────────
const EVENT_TYPES = ['Conference', 'Partner Event', 'Investor Call', 'Community', 'Academic', 'Workshop']

function EventsTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', organizer: '', location: '', date: '', type: 'Conference', url: '', partner: false, investor: false })

  const load = async () => {
    const snap = await getDocs(collection(db, 'events'))
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setLoading(true)
    await addDoc(collection(db, 'events'), { ...form, createdAt: serverTimestamp() })
    setForm({ name: '', organizer: '', location: '', date: '', type: 'Conference', url: '', partner: false, investor: false })
    setLoading(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this event?')) return
    await deleteDoc(doc(db, 'events', id))
    load()
  }

  return (
    <>
      <Panel title="Add Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className={labelCls}>Event Name *</label><input required value={form.name} onChange={set('name')} placeholder="ICRA 2026" className={inputCls} /></div>
          <Row items={[
            <div key="org"><label className={labelCls}>Organizer</label><input value={form.organizer} onChange={set('organizer')} placeholder="IEEE" className={inputCls} /></div>,
            <div key="loc"><label className={labelCls}>Location</label><input value={form.location} onChange={set('location')} placeholder="Atlanta, GA / Virtual" className={inputCls} /></div>,
          ]} />
          <Row items={[
            <div key="date"><label className={labelCls}>Date</label><input value={form.date} onChange={set('date')} placeholder="Apr 14–18" className={inputCls} /></div>,
            <div key="type"><label className={labelCls}>Type</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>,
          ]} />
          <div><label className={labelCls}>URL</label><input value={form.url} onChange={set('url')} placeholder="https://…" className={inputCls} /></div>
          <SaveBtn loading={loading} label="Add Event" />
        </form>
      </Panel>

      <Panel title={`Events in Firestore (${items.length})`}>
        {items.length === 0 && <p className="text-sm text-gray-400">No events added yet.</p>}
        <div className="space-y-3">
          {items.map(ev => (
            <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <div className="text-sm font-semibold text-gray-900">{ev.name}</div>
                <div className="text-xs text-gray-400">{ev.organizer} · {ev.location} · {ev.date}</div>
              </div>
              <DeleteBtn onClick={() => remove(ev.id)} />
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

// ── News ─────────────────────────────────────────────────────
const NEWS_CATEGORIES = ['AI', 'Industry', 'Funding', 'Standards', 'Software', 'Research', 'Policy']

function NewsTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', source: '', category: 'Industry', url: '', hot: false })

  const load = async () => {
    const snap = await getDocs(collection(db, 'news'))
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    await addDoc(collection(db, 'news'), { ...form, createdAt: serverTimestamp() })
    setForm({ title: '', source: '', category: 'Industry', url: '', hot: false })
    setLoading(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this news item?')) return
    await deleteDoc(doc(db, 'news', id))
    load()
  }

  return (
    <>
      <Panel title="Add News Item">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className={labelCls}>Headline *</label><input required value={form.title} onChange={set('title')} placeholder="NVIDIA Unveils Isaac GROOT…" className={inputCls} /></div>
          <Row items={[
            <div key="src"><label className={labelCls}>Source</label><input value={form.source} onChange={set('source')} placeholder="TechCrunch" className={inputCls} /></div>,
            <div key="cat"><label className={labelCls}>Category</label>
              <select value={form.category} onChange={set('category')} className={inputCls}>
                {NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>,
          ]} />
          <div><label className={labelCls}>URL</label><input value={form.url} onChange={set('url')} placeholder="https://…" className={inputCls} /></div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={form.hot} onChange={e => setForm(f => ({ ...f, hot: e.target.checked }))} className="rounded" />
            Mark as Hot (orange dot)
          </label>
          <SaveBtn loading={loading} label="Add News" />
        </form>
      </Panel>

      <Panel title={`News in Firestore (${items.length})`}>
        {items.length === 0 && <p className="text-sm text-gray-400">No news added yet.</p>}
        <div className="space-y-3">
          {items.map(n => (
            <div key={n.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  {n.hot && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />}
                  {n.title}
                </div>
                <div className="text-xs text-gray-400">{n.source} · {n.category}</div>
              </div>
              <DeleteBtn onClick={() => remove(n.id)} />
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

// ── Users ────────────────────────────────────────────────────
function UsersTab() {
  const [items, setItems] = useState([])

  useEffect(() => {
    getDocs(collection(db, 'users')).then(snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)))
    })
  }, [])

  const toggleAdmin = async (user) => {
    await updateDoc(doc(db, 'users', user.id), { isAdmin: !user.isAdmin })
    setItems(prev => prev.map(u => u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u))
  }

  return (
    <Panel title={`Registered Users (${items.length})`}>
      {items.length === 0 && <p className="text-sm text-gray-400">No users yet.</p>}
      <div className="space-y-2">
        {items.map(u => (
          <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
            <div>
              <div className="text-sm font-semibold text-gray-900">{u.name || '(no name)'}</div>
              <div className="text-xs text-gray-400">{u.type} · {u.school}</div>
            </div>
            <div className="flex items-center gap-3">
              {u.isAdmin && <span className="text-xs px-2 py-0.5 rounded-full bg-[#0069b4]/10 text-[#0069b4] font-semibold">Admin</span>}
              <button onClick={() => toggleAdmin(u)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                {u.isAdmin ? 'Remove admin' : 'Make admin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

// ── Posts ────────────────────────────────────────────────────
function PostsTab() {
  const [items, setItems] = useState([])

  const load = async () => {
    const snap = await getDocs(collection(db, 'posts'))
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)))
  }
  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return
    await deleteDoc(doc(db, 'posts', id))
    load()
  }

  return (
    <Panel title={`Posts in Firestore (${items.length})`}>
      {items.length === 0 && <p className="text-sm text-gray-400">No posts yet.</p>}
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#0069b4] mb-1">{p.author} · {p.likes} likes</div>
              <p className="text-sm text-gray-700 truncate">{p.content}</p>
            </div>
            <DeleteBtn onClick={() => remove(p.id)} />
          </div>
        ))}
      </div>
    </Panel>
  )
}
