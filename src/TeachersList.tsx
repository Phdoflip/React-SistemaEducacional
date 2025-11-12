import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Teacher } from "./types";
import { Plus, Edit, Trash2, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { getTeachers, deleteTeacher } from "./api/cliente";
import ConfirmModal from "./components/ConfirmModal";
import Spinner from "./components/Spinner";

export default function TeachersList() {
  const nav = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher['id'] | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getTeachers();
        setTeachers(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar professores.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDeleteRequest = (id: Teacher["id"]) => {
    setTeacherToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    try {
      await deleteTeacher(teacherToDelete);
      setTeachers((t) => t.filter((teacher) => String(teacher.id) !== String(teacherToDelete)));
      toast.success("Professor excluído com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir professor.");
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Professores</h1>
          <button onClick={() => nav("/teachers/new")} className="btn">
            <Plus size={20} />
            Novo Professor
          </button>
        </div>
        {loading ? (
          <Spinner />
        ) : teachers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <UserCheck size={48} color="#9ca3af" />
            <p>Nenhum professor cadastrado</p>
            <a href="#" onClick={() => nav("/teachers/new")}>
              Cadastrar primeiro professor
            </a>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.email || "-"}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/teachers/${teacher.id}/edit`} title="Editar">
                          <Edit size={20} />
                        </Link>
                        <button onClick={() => handleDeleteRequest(teacher.id)} title="Excluir" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}>
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}