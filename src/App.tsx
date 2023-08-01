// Dependencies
import { useState, useEffect, useRef } from 'react';
// Components
import Header from './components/header/header';
import Nav from './components/nav/nav';
import Grid from './components/grid/grid';
import AddNoteModal from './components/modals/addNoteModal';
import EditNoteModal from './components/modals/editNoteModal';
import AddNoteButton from './components/addNoteButton/addNoteButton';

// Interface para definir a estrutura de um objeto Nota
interface Note {
  id: number;
  title: string;
  message: string;
  status: 'note' | 'archived';
  condition: 'active' | 'deleted';
  deletedDate?: string; // Data em que a nota foi enviada para a lixeira (formato JSON)
}

// O componente principal para o NoteApp
export default function NoteApp() {
  // Variáveis de estado para gerenciar diferentes aspectos do aplicativo
  const [toggle, setToggle] = useState(false); // Para gerenciar a exibição do menu de navegação lateral
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  }); // Para armazenar o array de notas
  const [formData, setFormData] = useState<Note>({
    id: 1,
    title: '',
    message: '',
    status: 'note',
    condition: 'active',
  }); // Para armazenar os dados do formulário para adicionar uma nova nota
  const [modalData, setModalData] = useState<Note>({
    id: 0,
    title: '',
    message: '',
    status: 'note',
    condition: 'active',
  }); // Para armazenar os dados da nota sendo editada no modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Para gerenciar a visibilidade do modal de adicionar nota
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false); // Para gerenciar a visibilidade do modal de editar nota
  const [editingNoteIndex, setEditingNoteIndex] = useState(-1); // Para armazenar o índice da nota sendo editada
  const [selectedCategory, setSelectedCategory] = useState('note'); // Para armazenar a categoria selecionada (Nota, Arquivada ou Lixeira)

  // Refs para focar nos campos de input nos modals
  const newNoteInputRef = useRef<HTMLInputElement>(null);
  const editNoteInputRef = useRef<HTMLInputElement>(null);

  // Função para converter uma data em formato JSON para string
  const dateToJSONString = (date: Date): string => {
    return date.toISOString();
  };

  // Função para converter uma string em formato JSON para data
  const jsonStringToDate = (jsonString: string): Date => {
    return new Date(jsonString);
  };

  // Função para obter o próximo ID disponível para uma nova nota
  const getNextId = () => {
    return notes.length === 0 ? 1 : Math.max(...notes.map((note) => note.id)) + 1;
  };

  // Salvar as notas no localStorage sempre que a lista de notas for atualizada
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Atualizar o ID da nova nota sempre que a lista de notas for atualizada
  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, id: getNextId() }));
  }, [notes]);

  // Função para salvar uma nova nota
  const handleSaveNote = () => {
    const newNote = { ...formData };
    setNotes([...notes, newNote]);
    setFormData({ ...formData, title: '', message: '' });
    setIsModalOpen(false);
  };

  // Função para editar uma nota existente
  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit && noteToEdit.condition !== 'deleted') {
      setModalData(noteToEdit);
      setEditingNoteIndex(notes.indexOf(noteToEdit));
      setIsEditingModalOpen(true);
    }
  };

  // Função para salvar a nota editada
  const handleSaveEditedNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editingNoteIndex] = modalData;
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  // Função para arquivar/desarquivar uma nota
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

  // Função para enviar uma nota para a lixeira
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

  // Função para esvaziar permanentemente a lixeira
  const handleDeleteAllPermanently = () => {
    const updatedNotes = notes.filter((note) => note.condition !== 'deleted');
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  // Função para restaurar uma nota da lixeira
  const handleRestoreNote = (id: number) => {
    const noteToRestore = notes.find((note) => note.id === id);
    if (noteToRestore) {
      const updatedNotes = [...notes];
      const noteIndex = notes.indexOf(noteToRestore);
      updatedNotes[noteIndex] = {
        ...noteToRestore,
        condition: 'active',
      };
      delete updatedNotes[noteIndex].deletedDate; // Remover a propriedade deletedDate
      setNotes(updatedNotes);

      // Remover a propriedade deletedDate do localStorage ao restaurar a nota
      localStorage.setItem('notes', JSON.stringify(updatedNotes));

      // Verificar se a nota está na lixeira há mais de 7 dias
      if (isNoteOlderThan7Days(noteToRestore)) {
        handleDeletePermanently(noteToRestore.id); // Excluir permanentemente se for o caso
      }
    }
  };

  // Função para excluir permanentemente uma nota
  const handleDeletePermanently = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  // Verificar se uma nota está na lixeira há mais de 7 dias
  const isNoteOlderThan7Days = (note: Note) => {
    if (note.condition === 'deleted' && note.deletedDate) {
      const currentDate = new Date();
      const deletedDate = jsonStringToDate(note.deletedDate);
      const differenceInDays = (currentDate.getTime() - deletedDate.getTime()) / (1000 * 3600 * 24);
      return differenceInDays >= 7;
    }
    return false;
  };

  // Fechar o modal de adição/edição de nota
  const handleCloseModal = () => {
    setFormData({ ...formData, title: '', message: '' });
    setIsModalOpen(false);
    setIsEditingModalOpen(false);
  };

  // Alterar a categoria selecionada (Notas, Arquivo ou Lixeira)
  const handleCategoryChange = (category: 'note' | 'archived' | 'bin') => {
    setSelectedCategory(category);

    // Verificar se a classe 'nav' tem a classe 'openNav' antes de chamar setToggle(!toggle)
    const navElement = document.querySelector('.nav');
    if (navElement && navElement.classList.contains('openNav')) {
      setToggle(!toggle);
    }
  };

  // Verificar se deve renderizar o botão de arquivar/desarquivar nota
  const shouldRenderArchiveButton = (note: Note) => {
    return selectedCategory !== 'bin' && note.condition === 'active';
  };

  // Verificar se deve renderizar o botão de excluir nota
  const shouldRenderDeleteButton = (note: Note) => {
    return note.condition === 'active';
  };

  // Verificar se deve renderizar o botão de restaurar nota (na lixeira)
  const shouldRenderRestoreButton = (note: Note) => {
    return selectedCategory === 'bin' && note.condition === 'deleted';
  };

  // Filtrar as notas de acordo com a categoria selecionada
  const filteredNotes = notes.filter((note) => {
    if (selectedCategory === 'bin') {
      return note.condition === 'deleted';
    }
    return note.status === selectedCategory && note.condition === 'active';
  });

  // Configuração das colunas responsivas para o layout Masonry
  const breakpointColumnsObj = {
    default: 6,
    1830: 5,
    1575: 4,
    1320: 3,
    1080: 2,
    820: 1,
  };

  // Focar no campo de adição de nota quando o modal é aberto
  useEffect(() => {
    if (isModalOpen && newNoteInputRef.current) {
      newNoteInputRef.current.focus();
    }
  }, [isModalOpen]);

  // Focar no campo de edição de nota quando o modal é aberto
  useEffect(() => {
    if (isEditingModalOpen && editNoteInputRef.current) {
      editNoteInputRef.current.focus();
    }
  }, [isEditingModalOpen]);

  // Renderizar a mensagem de aviso de exclusão permanente na lixeira
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
      {/* Componente Header */}
      <Header toggle={toggle} setToggle={setToggle} />

      {/* Componente Nav */}
      <Nav
        toggle={toggle}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />

      {/* Componente Grid */}
      <Grid
        toggle={toggle}
        selectedCategory={selectedCategory}
        filteredNotes={filteredNotes}
        breakpointColumnsObj={breakpointColumnsObj}
        renderDeleteWarning={renderDeleteWarning}
        handleEditNote={handleEditNote}
        shouldRenderRestoreButton={shouldRenderRestoreButton}
        handleRestoreNote={handleRestoreNote}
        handleDeletePermanently={handleDeletePermanently}
      />

      {/* Componente AddNoteModal */}
      <AddNoteModal
        isModalOpen={isModalOpen}
        formData={formData}
        setFormData={setFormData}
        newNoteInputRef={newNoteInputRef}
        handleSaveNote={handleSaveNote}
        handleCloseModal={handleCloseModal}
      />

      {/* Componente EditNoteModal */}
      <EditNoteModal
        isEditingModalOpen={isEditingModalOpen}
        modalData={modalData}
        setModalData={setModalData}
        editNoteInputRef={editNoteInputRef}
        handleCloseModal={handleCloseModal}
        handleSaveEditedNote={handleSaveEditedNote}
        handleArchiveNote={handleArchiveNote}
        handleDeleteNote={handleDeleteNote}
        shouldRenderArchiveButton={shouldRenderArchiveButton}
        shouldRenderDeleteButton={shouldRenderDeleteButton}
      />

      {/* Componente AddNoteButton */}
      <AddNoteButton setIsModalOpen={setIsModalOpen} />
    </>
  );
}
