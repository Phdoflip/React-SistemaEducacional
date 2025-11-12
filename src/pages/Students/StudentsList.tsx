import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Student, ClassRoom } from "../../types";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { getStudents, deleteStudent, getClasses } from "../../api/cliente";

export default function StudentsList() {
  const nav = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [studentsData, classesData] = await Promise.all([
          getStudents(),
          getClasses(),
        ]);
        setStudents(studentsData || []);
        setClasses(classesData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getClassName = (classId: Student["classId"]) => {
    const classRoom = classes.find((c) => String(c.id) === String(classId));
    return classRoom?.name || "N/A";
  };

  const handleDelete = async (id: Student["id"]) => {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;
    try {
      await deleteStudent(id);
      setStudents((s) =>
        s.filter((student) => String(student.id) !== String(id))
      );
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      alert("Erro ao excluir aluno");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Alunos</h1>
        <button onClick={() => nav("/students/new")} className="btn">
          <Plus size={20} />
          Novo Aluno
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : students.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <Users size={48} color="#9ca3af" />
          <p>Nenhum aluno cadastrado</p>
          <a href="#" onClick={() => nav("/students/new")}>
            Cadastrar primeiro aluno
          </a>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Turma</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email || "-"}</td>
                  <td>{getClassName(student.classId)}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/students/${student.id}/edit`} title="Editar">
                        <Edit size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(student.id)}
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
  );
}
