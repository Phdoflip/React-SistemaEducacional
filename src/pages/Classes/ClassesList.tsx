import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { ClassRoom } from "../../types";
import { Plus, Edit, Trash2, School } from "lucide-react";
import toast from "react-hot-toast";
import { getClasses, deleteClass } from "../../api/cliente";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";

export default function ClassesList() {
  const nav = useNavigate();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassRoom['id'] | null>(
    null
  );

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const data = await getClasses();
        setClasses(data || []);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
        toast.error("Erro ao carregar as turmas.");
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  const handleDeleteRequest = (id: ClassRoom["id"]) => {
    setClassToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;
    try {
      await deleteClass(classToDelete);
      setClasses((cls) =>
        cls.filter((c) => String(c.id) !== String(classToDelete))
      );
      toast.success("Turma excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
      toast.error("Erro ao excluir a turma.");
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Turmas</h1>
        <button onClick={() => nav("/classes/new")} className="btn">
          <Plus size={20} />
          Nova Turma
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : classes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <School size={48} color="#9ca3af" />
          <p>Nenhuma turma cadastrada</p>
          <a href="#" onClick={() => nav("/classes/new")}>
            Criar primeira turma
          </a>
        </div>
      ) : (
        <div className="table-container">
          {classes.map((cls) => (
            <div key={cls.id} className="card">
              <h2>{cls.name}</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <Link to={`/grades/class/${cls.id}`}>
                  Ver Notas
                </Link>
                <div className="table-actions">
                  <Link to={`/classes/${cls.id}/edit`} title="Editar">
                    <Edit size={20} />
                  </Link>
                  <button onClick={() => handleDeleteRequest(cls.id)} title="Excluir" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545'}}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
