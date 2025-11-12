import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Course } from "../../types";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { getCourses, deleteCourse } from "../../api/cliente";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";

export default function CoursesList() {
  const nav = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course['id'] | null>(null);


  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar cursos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDeleteRequest = (id: Course["id"]) => {
    setCourseToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete);
      setCourses((cs) => cs.filter((c) => String(c.id) !== String(id)));
      toast.success("Curso excluído com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir curso.");
    }
  };

  return (
    <>
    <ConfirmModal
      isOpen={isModalOpen}
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita."
      onConfirm={handleConfirmDelete}
      onCancel={() => setIsModalOpen(false)}
    />

    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Cursos</h1>
        <button onClick={() => nav("/courses/new")} className="btn">
          <Plus size={20} />
          Novo Curso
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <BookOpen size={48} color="#9ca3af" />
          <p>Nenhum curso cadastrado</p>
          <a href="#" onClick={() => nav("/courses/new")}>
            Criar primeiro curso
          </a>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.description || "-"}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/courses/${c.id}/edit`} title="Editar">
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDeleteRequest(c.id)}
                        title="Excluir"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}
                      >
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
