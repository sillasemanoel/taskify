import { useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlineRollback, AiOutlineDelete } from 'react-icons/ai'
import Masonry from 'react-masonry-css'
import './App.css'

interface Note {
  id: number
  title: string
  message: string
  status: 'note' | 'archived'
  condition: 'active' | 'deleted'
}

export default function NoteApp() {
  // State para armazenar as notas, inicializado com as notas salvas no localStorage ou um array vazio.
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  // State para armazenar os dados do formulário para adicionar nova nota.
  const [formData, setFormData] = useState<Note>({
    id: 1,
    title: '',
    message: '',
    status: 'note',
    condition: 'active',
  })

  // State para armazenar os dados da nota selecionada para edição.
  const [modalData, setModalData] = useState<Note>({
    id: 0,
    title: '',
    message: '',
    status: 'note',
    condition: 'active',
  })

  // State para controlar a exibição do modal de adição de nova nota.
  const [isModalOpen, setIsModalOpen] = useState(false)

  // State para controlar a exibição do modal de edição de nota.
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false)

  // State para armazenar o índice da nota sendo editada no array de notas.
  const [editingNoteIndex, setEditingNoteIndex] = useState(-1)

  // State para armazenar a categoria selecionada (note, archived ou bin).
  const [selectedCategory, setSelectedCategory] = useState('note')

  // Efeito colateral para salvar as notas no localStorage sempre que houver uma alteração no estado `notes`.
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Efeito colateral para atualizar o ID da próxima nota sempre que houver uma alteração no estado `notes`.
  useEffect(() => {
    setFormData({ ...formData, id: getNextId() })
  }, [notes])

  // Função para obter o próximo ID disponível para uma nova nota.
  const getNextId = () => {
    return notes.length === 0 ? 1 : Math.max(...notes.map((note) => note.id)) + 1
  }

  // Função para salvar uma nova nota no estado `notes`.
  const handleSaveNote = () => {
    const newNote = { ...formData }
    setNotes([...notes, newNote])
    setFormData({ ...formData, title: '', message: '' })
    setIsModalOpen(false)
  }

  // Função para editar uma nota existente.
  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id)
    if (noteToEdit && noteToEdit.condition !== 'deleted') {
      setModalData(noteToEdit)
      setEditingNoteIndex(notes.indexOf(noteToEdit))
      setIsEditingModalOpen(true)
    }
  }

  // Função para salvar as alterações feitas em uma nota editada.
  const handleSaveEditedNote = () => {
    const updatedNotes = [...notes]
    updatedNotes[editingNoteIndex] = modalData
    setNotes(updatedNotes)
    setIsEditingModalOpen(false)
  }

  // Função para arquivar ou desarquivar uma nota.
  const handleArchiveNote = () => {
    const updatedNotes = [...notes]
    updatedNotes[editingNoteIndex] = {
      ...modalData,
      status: modalData.status === 'note' ? 'archived' : 'note',
    }
    setModalData(updatedNotes[editingNoteIndex])
    setNotes(updatedNotes)
    setIsEditingModalOpen(false)
  }

  // Função para enviar uma nota para a lixeira.
  const handleDeleteNote = () => {
    const updatedNotes = [...notes]
    updatedNotes[editingNoteIndex] = {
      ...modalData,
      condition: 'deleted',
    }
    setModalData(updatedNotes[editingNoteIndex])
    setNotes(updatedNotes)
    setIsEditingModalOpen(false)
  }

  // Função para restaurar uma nota da lixeira.
  const handleRestoreNote = (id: number) => {
    const noteToRestore = notes.find((note) => note.id === id)
    if (noteToRestore) {
      const updatedNotes = [...notes]
      const noteIndex = notes.indexOf(noteToRestore)
      updatedNotes[noteIndex] = {
        ...noteToRestore,
        condition: 'active',
      }
      setNotes(updatedNotes)
    }
  }

  // Função para excluir permanentemente uma nota da lixeira.
  const handleDeletePermanently = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    setIsEditingModalOpen(false)
  }

  // Função para fechar o modal de adição de nova nota ou edição de nota.
  const handleCloseModal = () => {
    setFormData({ ...formData, title: '', message: '' })
    setIsModalOpen(false)
    setIsEditingModalOpen(false)
  }

  // Função para alterar a categoria selecionada.
  const handleCategoryChange = (category: 'note' | 'archived' | 'bin') => {
    setSelectedCategory(category)
  }

  // Função para determinar se o botão de arquivar deve ser renderizado para uma nota.
  const shouldRenderArchiveButton = (note: Note) => {
    return selectedCategory !== 'bin' && note.condition === 'active'
  }

  // Função para determinar se o botão de excluir deve ser renderizado para uma nota.
  const shouldRenderDeleteButton = (note: Note) => {
    return note.condition === 'active'
  }

  // Função para determinar se o botão de restaurar deve ser renderizado para uma nota na lixeira.
  const shouldRenderRestoreButton = (note: Note) => {
    return selectedCategory === 'bin' && note.condition === 'deleted'
  }

  // Filtra as notas com base na categoria selecionada.
  const filteredNotes = notes.filter((note) => {
    if (selectedCategory === 'bin') {
      return note.condition === 'deleted'
    }
    return note.status === selectedCategory && note.condition === 'active'
  })

  // Configuração das colunas para o layout Masonry
  const breakpointColumnsObj = {
    default: 5,
    1810: 4,
    1450: 3,
    1100: 2,
    730: 1
  }

  return (
    <div>
      <div className='navbar'>
        <button
          onClick={() => handleCategoryChange('note')}
          className={selectedCategory === 'note' ? 'active' : ''}
        >
          Notas
        </button>
        <button
          onClick={() => handleCategoryChange('archived')}
          className={selectedCategory === 'archived' ? 'active' : ''}
        >
          Arquivadas
        </button>
        <button
          onClick={() => handleCategoryChange('bin')}
          className={selectedCategory === 'bin' ? 'active' : ''}
        >
          Lixeira
        </button>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className='toAdd'
      >
        +
      </button>

      <div className='grid'>
        {selectedCategory === 'note' && filteredNotes.length === 0 && (
          <p>As notas adicionadas são exibidas aqui</p>
        )}
        {selectedCategory === 'archived' && filteredNotes.length === 0 && (
          <p>Suas notas arquivadas são exibidas aqui</p>
        )}
        {selectedCategory === 'bin' && filteredNotes.length === 0 && (
          <p>Nenhuma nota na lixeira</p>
        )}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='my-masonry-grid'
          columnClassName='my-masonry-grid_column'
        >
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleEditNote(note.id)}
              className='note'
            >
              <h3>{note.title}</h3>
              <p>{note.message}</p>
              {/* Botões de restaurar e excluir, aparecem apenas na lixeira */}
              {shouldRenderRestoreButton(note) && (
                <div className='trashCanButtons'>
                  <button
                    onClick={() => handleRestoreNote(note.id)}
                    className='restore'
                  >
                    <AiOutlineRollback />
                  </button>
                  <button
                    onClick={() => handleDeletePermanently(note.id)}
                    className='definitelyDelete'
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              )}
            </div>
          ))}
        </Masonry>
      </div>

      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Adicionar Nova Nota</h2>
              <button onClick={handleCloseModal}>
                <AiOutlineClose />
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Título</label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label>Mensagem</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <div className='buttons'>
                <button
                  type='button'
                  onClick={handleSaveNote}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Editar Nota</h2>
              <button onClick={handleCloseModal}>
                <AiOutlineClose />
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Título</label>
                <input
                  type='text'
                  value={modalData.title}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                />
              </div>
              <div>
                <label>Mensagem</label>
                <textarea
                  value={modalData.message}
                  onChange={(e) => setModalData({ ...modalData, message: e.target.value })}
                />
              </div>
              <div className='buttons'>
                <button
                  type='button'
                  onClick={handleSaveEditedNote}
                >
                  Salvar
                </button>
                {/* Botões de arquivar e excluir, aparecem apenas em notas ativas */}
                {shouldRenderArchiveButton(modalData) && (
                  <button
                    type='button'
                    onClick={handleArchiveNote}
                  >
                    {modalData.status === 'note' ? 'Arquivar' : 'Desarquivar'}
                  </button>
                )}
                {shouldRenderDeleteButton(modalData) && (
                  <button
                    type='button'
                    onClick={handleDeleteNote}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
