import { useState, useEffect, useRef } from 'react';
import { AiOutlineClose, AiOutlineRollback, AiOutlineDelete } from 'react-icons/ai';
import { FiMenu } from 'react-icons/fi';
import { FaRegStickyNote, FaRegFolderOpen, FaRegTrashAlt } from 'react-icons/fa';
import Masonry from 'react-masonry-css';
import './App.css';
import icon from '../public/icon.png';

interface Note {
  id: number;
  title: string;
  message: string;
  status: 'note' | 'archived';
  condition: 'active' | 'deleted';
  deletedDate?: string; // Data em que a nota foi enviada para a lixeira (formato JSON)
}

export default function NoteApp() {
  const [toggle, setToggle] = useState(false);
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [formData, setFormData] = useState<Note>({
    id: 1,
    title: '',
    message: '',
    status: 'note',
    condition: 'active',
  });

  const [modalData, setModalData] = useState<Note>({
    id: 0,
    title: '',
    message: '',
    status: 'note',
    condition: 'active',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('note');

  const newNoteInputRef = useRef<HTMLInputElement>(null);
  const editNoteInputRef = useRef<HTMLInputElement>(null);

  function dateToJSONString(date: Date): string {
    return date.toISOString();
  }

  function jsonStringToDate(jsonString: string): Date {
    return new Date(jsonString);
  }

  const getNextId = () => {
    return notes.length === 0 ? 1 : Math.max(...notes.map((note) => note.id)) + 1;
  };

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setFormData({ ...formData, id: getNextId() });
  }, [notes]);

  const handleSaveNote = () => {
    const newNote = { ...formData };
    setNotes([...notes, newNote]);
    setFormData({ ...formData, title: '', message: '' });
    setIsModalOpen(false);
  };

  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit && noteToEdit.condition !== 'deleted') {
      setModalData(noteToEdit);
      setEditingNoteIndex(notes.indexOf(noteToEdit));
      setIsEditingModalOpen(true);
    }
  };

  const handleSaveEditedNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editingNoteIndex] = modalData;
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  const handleArchiveNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editingNoteIndex] = {
      ...modalData,
      status: modalData.status === 'note' ? 'archived' : 'note',
    };
    setModalData(updatedNotes[editingNoteIndex]);
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  const handleDeleteNote = () => {
    const updatedNotes = [...notes];
    const currentDate = new Date();
    updatedNotes[editingNoteIndex] = {
      ...modalData,
      condition: 'deleted',
      deletedDate: dateToJSONString(currentDate),
    };
    setModalData(updatedNotes[editingNoteIndex]);
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };


  const handleDeleteAllPermanently = () => {
    const updatedNotes = notes.filter((note) => note.condition !== 'deleted');
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  const handleRestoreNote = (id: number) => {
    const noteToRestore = notes.find((note) => note.id === id);
    if (noteToRestore) {
      const updatedNotes = [...notes];
      const noteIndex = notes.indexOf(noteToRestore);
      updatedNotes[noteIndex] = {
        ...noteToRestore,
        condition: 'active',
      };
      setNotes(updatedNotes);

      // Verificar se a nota está na lixeira há mais de 7 dias
      if (isNoteOlderThan7Days(noteToRestore)) {
        handleDeletePermanently(noteToRestore.id); // Excluir permanentemente se for o caso
      }
    }
  };

  const handleDeletePermanently = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  const isNoteOlderThan7Days = (note: Note) => {
    if (note.condition === 'deleted' && note.deletedDate) {
      const currentDate = new Date();
      const deletedDate = jsonStringToDate(note.deletedDate);
      const differenceInDays = (currentDate.getTime() - deletedDate.getTime()) / (1000 * 3600 * 24);
      return differenceInDays >= 7;
    }
    return false;
  };

  const handleCloseModal = () => {
    setFormData({ ...formData, title: '', message: '' });
    setIsModalOpen(false);
    setIsEditingModalOpen(false);
  };

  const handleCategoryChange = (category: 'note' | 'archived' | 'bin') => {
    setSelectedCategory(category);
  };

  const shouldRenderArchiveButton = (note: Note) => {
    return selectedCategory !== 'bin' && note.condition === 'active';
  };

  const shouldRenderDeleteButton = (note: Note) => {
    return note.condition === 'active';
  };

  const shouldRenderRestoreButton = (note: Note) => {
    return selectedCategory === 'bin' && note.condition === 'deleted';
  };

  const filteredNotes = notes.filter((note) => {
    if (selectedCategory === 'bin') {
      return note.condition === 'deleted';
    }
    return note.status === selectedCategory && note.condition === 'active';
  });

  const breakpointColumnsObj = {
    default: 6,
    1830: 5,
    1575: 4,
    1320: 3,
    1080: 2,
    820: 1,
  };

  useEffect(() => {
    if (isModalOpen && newNoteInputRef.current) {
      newNoteInputRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isEditingModalOpen && editNoteInputRef.current) {
      editNoteInputRef.current.focus();
    }
  }, [isEditingModalOpen]);

  const renderDeleteWarning = () => {
    if (selectedCategory === 'bin') {
      const notesInBin = notes.filter((note) => note.condition === 'deleted');

      if (notesInBin.length > 0) {
        return (
          <div className='deleteWarning'>
            <p>As notas na lixeira são excluídas após sete dias.</p>
            <span onClick={() => handleDeleteAllPermanently()}>Esvaziar lixeira</span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <>
      <div className='header'>
        <div>
          <div onClick={() => setToggle(!toggle)} className='menu'>
            <FiMenu />
          </div>
          <div className='logo'>
            <img src={icon} alt='Taskify Icon' />
            <h1>Taskify</h1>
          </div>
        </div>
      </div>

      <div className={`${toggle ? 'nav openNav' : 'nav closedNav'}`}>
        <button
          onClick={() => handleCategoryChange('note')}
          className={selectedCategory === 'note' ? 'active' : ''}
        >
          <FaRegStickyNote />
          <h1>Notas</h1>
        </button>
        <button
          onClick={() => handleCategoryChange('archived')}
          className={selectedCategory === 'archived' ? 'active' : ''}
        >
          <FaRegFolderOpen />
          <h1>Arquivo</h1>
        </button>
        <button
          onClick={() => handleCategoryChange('bin')}
          className={selectedCategory === 'bin' ? 'active' : ''}
        >
          <FaRegTrashAlt />
          <h1>Lixeira</h1>
        </button>
      </div>

      <button onClick={() => setIsModalOpen(true)} className='toAdd'>
        +
      </button>

      <div className={`${toggle ? 'grid openGrid' : 'grid closedGrid'}`}>
        {renderDeleteWarning()}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='my-masonry-grid'
          columnClassName='my-masonry-grid_column'
        >
          {selectedCategory === 'note' && filteredNotes.length === 0 && (
            <p className='notice'>As notas adicionadas são exibidas aqui</p>
          )}
          {selectedCategory === 'archived' && filteredNotes.length === 0 && (
            <p className='notice'>Suas notas arquivadas são exibidas aqui</p>
          )}
          {selectedCategory === 'bin' && filteredNotes.length === 0 && (
            <p className='notice'>Nenhuma nota na lixeira</p>
          )}

          {filteredNotes.map((note) => (
            <div key={note.id} onClick={() => handleEditNote(note.id)} className='note'>
              <h3>{note.title}</h3>
              <p>{note.message}</p>
              {shouldRenderRestoreButton(note) && (
                <div>
                  <button onClick={() => handleRestoreNote(note.id)}>
                    <AiOutlineRollback />
                  </button>
                  <button onClick={() => handleDeletePermanently(note.id)}>
                    <AiOutlineDelete />
                  </button>
                </div>
              )}
            </div>
          ))}
        </Masonry>
      </div>

      {isModalOpen && (
        <div className='modalOverlay'>
          <div className='modalContent'>
            <div className='modalHeader'>
              <h2>Adicionar Nova Nota</h2>
              <button onClick={handleCloseModal} className='closeModal'>
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
                  ref={newNoteInputRef}
                />
              </div>
              <div>
                <label>Mensagem</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <div className='modalActions'>
                <button type='button' onClick={handleSaveNote}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingModalOpen && (
        <div className='modalOverlay'>
          <div className='modalContent'>
            <div className='modalHeader'>
              <h2>Editar Nota</h2>
              <button onClick={handleCloseModal} className='closeModal'>
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
                  ref={editNoteInputRef}
                />
              </div>
              <div>
                <label>Mensagem</label>
                <textarea
                  value={modalData.message}
                  onChange={(e) => setModalData({ ...modalData, message: e.target.value })}
                />
              </div>
              <div className='modalActions'>
                <button type='button' onClick={handleSaveEditedNote}>
                  Salvar
                </button>
                {shouldRenderArchiveButton(modalData) && (
                  <button type='button' onClick={handleArchiveNote}>
                    {modalData.status === 'note' ? 'Arquivar' : 'Desarquivar'}
                  </button>
                )}
                {shouldRenderDeleteButton(modalData) && (
                  <button type='button' onClick={handleDeleteNote}>
                    Excluir
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
