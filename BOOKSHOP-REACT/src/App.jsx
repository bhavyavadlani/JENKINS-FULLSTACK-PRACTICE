import React, { useEffect, useState } from 'react'
import './App.css'

const API = 'http://localhost:9090/api/books'

export default function App() {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ title: '', author: '', price: '', stock: '' })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    const res = await fetch(API)
    const data = await res.json()
    setBooks(data)
  }

  async function submit(e) {
    e.preventDefault()
    const payload = { title: form.title, author: form.author, price: parseFloat(form.price), stock: parseInt(form.stock) }
    if (editing) {
      await fetch(`${API}/${editing}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      setEditing(null)
    } else {
      await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    }
    setForm({ title: '', author: '', price: '', stock: '' })
    fetchBooks()
  }

  function startEdit(b) {
    setEditing(b.id)
    setForm({ title: b.title, author: b.author, price: b.price, stock: b.stock })
  }

  async function remove(id) {
    if (!confirm('Delete book?')) return
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    fetchBooks()
  }

  return (
    <div style={{maxWidth:900, margin:'20px auto', fontFamily:'Arial, sans-serif'}}>
      <h1>Bookshop CRUD</h1>

      <form onSubmit={submit} style={{display:'grid', gap:8}}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/>
        <input placeholder="Author" value={form.author} onChange={e=>setForm({...form, author:e.target.value})} required/>
        <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required/>
        <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})} required/>
        <div style={{display:'flex', gap:8}}>
          <button type="submit">{editing ? 'Update' : 'Create'}</button>
          {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({title:'',author:'',price:'',stock:''}) }}>Cancel</button>}
        </div>
      </form>

      <table style={{width:'100%', borderCollapse:'collapse', marginTop:16}}>
        <thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
        <tbody>
          {books.map(b=>(
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.price}</td>
              <td>{b.stock}</td>
              <td>
                <button onClick={()=>startEdit(b)}>Edit</button>
                <button onClick={()=>remove(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
