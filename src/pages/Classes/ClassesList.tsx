import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { ClassRoom } from "../../types";
import { Plus, Edit, Trash2, School } from "lucide-react";
import { getClasses, deleteClass } from "../../api/cliente";

export default function ClassesList() {
  const nav = useNavigate();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        const data = await getClasses();
        setClasses(data || []);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  const handleDelete = async (id: ClassRoom["id"]) => {
    if (!window.confirm("Tem certeza que deseja excluir esta turma?")) return;
    try {
      await deleteClass(id);
      setClasses((cls) => cls.filter((c) => String(c.id) !== String(id)));
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Turmas</h1>
        <button onClick={() => nav("/classes/new")} className="btn">
          <Plus size={20} />
          Nova Turma
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
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
                  <button onClick={() => handleDelete(cls.id)} title="Excluir" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545'}}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
