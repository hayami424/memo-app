import { useEffect, useState } from 'react'

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const CATEGORIES = [
  { id: 'work', label: '仕事' },
  { id: 'personal', label: '個人' },
  { id: 'idea', label: 'アイデア' },
]

const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label

const STORAGE_KEY = 'memo-app:memos'

// createdAt は JSON では文字列になるため、読み込み時に Date へ戻す
const loadMemos = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((memo) => ({ ...memo, createdAt: new Date(memo.createdAt) }))
      .filter((memo) => !Number.isNaN(memo.createdAt.getTime()))
  } catch {
    return []
  }
}

const saveMemos = (memos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  } catch (err) {
    console.error('メモの保存に失敗しました', err)
  }
}

function App() {
  const [text, setText] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [filter, setFilter] = useState('all')
  const [memos, setMemos] = useState(loadMemos)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    saveMemos(memos)
  }, [memos])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const memo = {
      id: crypto.randomUUID(),
      text: trimmed,
      category,
      createdAt: new Date(),
    }
    setMemos((prev) => [memo, ...prev])
    setText('')
  }

  const startEdit = (memo) => {
    setEditingId(memo.id)
    setEditText(memo.text)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const trimmed = editText.trim()
    if (!trimmed) return
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === editingId ? { ...memo, text: trimmed } : memo,
      ),
    )
    cancelEdit()
  }

  const handleDelete = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id))
    if (id === editingId) cancelEdit()
  }

  const visibleMemos =
    filter === 'all' ? memos : memos.filter((memo) => memo.category === filter)

  return (
    <div className="app">
      <h1>メモアプリ</h1>
      <form className="memo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メモを入力"
          aria-label="メモ"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="カテゴリ"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>
      <div className="filter-bar" role="group" aria-label="カテゴリで絞り込み">
        {[{ id: 'all', label: 'すべて' }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            className={`filter-btn${filter === c.id ? ' is-active' : ''}`}
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      {memos.length === 0 ? (
        <p className="empty">メモはまだありません</p>
      ) : visibleMemos.length === 0 ? (
        <p className="empty">このカテゴリのメモはありません</p>
      ) : (
        <ul className="memo-list">
          {visibleMemos.map((memo) => (
            <li key={memo.id} className="memo-item">
              {memo.id === editingId ? (
                <form className="memo-edit-form" onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    aria-label="メモを編集"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!editText.trim()}
                  >
                    保存
                  </button>
                  <button type="button" className="btn" onClick={cancelEdit}>
                    キャンセル
                  </button>
                </form>
              ) : (
                <p className="memo-text">{memo.text}</p>
              )}
              <div className="memo-footer">
                <div className="memo-meta">
                  <span
                    className={`category-badge category-${memo.category}`}
                  >
                    {categoryLabel(memo.category)}
                  </span>
                  <time
                    className="memo-date"
                    dateTime={memo.createdAt.toISOString()}
                  >
                    {dateFormatter.format(memo.createdAt)}
                  </time>
                </div>
                {memo.id !== editingId && (
                  <div className="memo-actions">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => startEdit(memo)}
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(memo.id)}
                    >
                      削除
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
