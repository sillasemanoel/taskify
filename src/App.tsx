// Dependencies
import { useState, useEffect, useRef } from "react";
// Components
import Header from "./components/header/header";
import Nav from "./components/nav/nav";
import Grid from "./components/grid/grid";
import AddNoteModal from "./components/modals/addNoteModal";
import EditNoteModal from "./components/modals/editNoteModal";
import AddNoteButton from "./components/addNoteButton/addNoteButton";

interface Note {
  id: number;
  title: string;
  message: string;
  status: "note" | "archived";
  condition: "active" | "deleted";
  deletedDate?: string;
}

export default function NoteApp() {
  const [toggle, setToggle] = useState(false);
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [formData, setFormData] = useState<Note>({
    id: 1,
    title: "",
    message: "",
    status: "note",
    condition: "active",
  });
  const [modalData, setModalData] = useState<Note>({
    id: 0,
    title: "",
    message: "",
    status: "note",
    condition: "active",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState("note");

  const newNoteInputRef = useRef<HTMLInputElement>(null);
  const editNoteInputRef = useRef<HTMLInputElement>(null);

  const dateToJSONString = (date: Date): string => {
    return date.toISOString();
  };

  const jsonStringToDate = (jsonString: string): Date => {
    return new Date(jsonString);
  };

  const getNextId = () => {
    return notes.length === 0
      ? 1
      : Math.max(...notes.map((note) => note.id)) + 1;
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, id: getNextId() }));
  }, [notes]);

  const handleSaveNote = () => {
    const newNote = { ...formData };
    setNotes([...notes, newNote]);
    setFormData({ ...formData, title: "", message: "" });
    setIsModalOpen(false);
  };

  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit && noteToEdit.condition !== "deleted") {
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
      status: modalData.status === "note" ? "archived" : "note",
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
      condition: "deleted",
      deletedDate: dateToJSONString(currentDate),
    };
    setModalData(updatedNotes[editingNoteIndex]);
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  const handleDeleteAllPermanently = () => {
    const updatedNotes = notes.filter((note) => note.condition !== "deleted");
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
        condition: "active",
      };
      delete updatedNotes[noteIndex].deletedDate;
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      if (isNoteOlderThan7Days(noteToRestore)) {
        handleDeletePermanently(noteToRestore.id);
      }
    }
  };

  const handleDeletePermanently = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setIsEditingModalOpen(false);
  };

  const isNoteOlderThan7Days = (note: Note) => {
    if (note.condition === "deleted" && note.deletedDate) {
      const currentDate = new Date();
      const deletedDate = jsonStringToDate(note.deletedDate);
      const differenceInDays =
        (currentDate.getTime() - deletedDate.getTime()) / (1000 * 3600 * 24);
      return differenceInDays >= 7;
    }
    return false;
  };

  const handleCloseModal = () => {
    setFormData({ ...formData, title: "", message: "" });
    setIsModalOpen(false);
    setIsEditingModalOpen(false);
  };

  const handleCategoryChange = (category: "note" | "archived" | "bin") => {
    setSelectedCategory(category);
    const navElement = document.querySelector(".nav");
    if (navElement && navElement.classList.contains("openNav")) {
      setToggle(!toggle);
    }
  };

  const shouldRenderArchiveButton = (note: Note) => {
    return selectedCategory !== "bin" && note.condition === "active";
  };

  const shouldRenderDeleteButton = (note: Note) => {
    return note.condition === "active";
  };

  const shouldRenderRestoreButton = (note: Note) => {
    return selectedCategory === "bin" && note.condition === "deleted";
  };

  const filteredNotes = notes.filter((note) => {
    if (selectedCategory === "bin") {
      return note.condition === "deleted";
    }
    return note.status === selectedCategory && note.condition === "active";
  });

  const breakpointColumnsObj = {
    default: 6,
    1830: 5,
    1575: 4,
    1320: 3,
    1080: 2,
    820: 1,
  };

  const checkAndDeleteOldNotes = () => {
    const updatedNotes = notes.filter((note) => {
      if (isNoteOlderThan7Days(note)) {
        handleDeletePermanently(note.id);
        return false;
      }
      return true;
    });
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  useEffect(() => {
    checkAndDeleteOldNotes();
  }, []);

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
    if (selectedCategory === "bin") {
      const notesInBin = notes.filter((note) => note.condition === "deleted");
      if (notesInBin.length > 0) {
        return (
          <div className="deleteWarning">
            <p>As notas na lixeira são excluídas após 7 dias.</p>
            <span onClick={() => handleDeleteAllPermanently()}>
              Esvaziar lixeira
            </span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <>
      <Header toggle={toggle} setToggle={setToggle} />
      <Nav
        toggle={toggle}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />
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
      <AddNoteModal
        isModalOpen={isModalOpen}
        formData={formData}
        setFormData={setFormData}
        newNoteInputRef={newNoteInputRef}
        handleSaveNote={handleSaveNote}
        handleCloseModal={handleCloseModal}
      />
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
      <AddNoteButton setIsModalOpen={setIsModalOpen} />
    </>
  );
}
