import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ClassRoom, Course } from "../../types";
import { ArrowLeft, Save, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  getClass,
  createClass,
  updateClass,
  getCourses,
} from "../../api/cliente";

export default function ClassForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const editMode = Boolean(id);
  const [form, setForm] = useState<Partial<ClassRoom>>({
    name: "",
    courseId: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Carregar cursos
        const coursesData = await getCourses();
        setCourses(coursesData || []);

        // Se for edição, carregar dados da turma
        if (editMode && id) {
          const classData = await getClass(id);
          setForm(classData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar os dados.");
      }
    }
    loadData();
  }, [editMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("O nome da turma é obrigatório.");
      return;
    }
    if (!form.courseId) {
      toast.error("O curso é obrigatório.");
      return;
    }

    try {
      setSaving(true);
      if (editMode && id) await updateClass(id, form);
      else await createClass(form);
      toast.success(`Turma ${editMode ? "atualizada" : "criada"} com sucesso!`);
      nav("/classes");
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      toast.error("Erro ao salvar a turma.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="page-header">
        <h1 className="page-title">{editMode ? "Editar Turma" : "Nova Turma"}</h1>
        <button type="button" onClick={() => nav("/classes")} className="btn btn-secondary">
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nome da Turma</label>
          <input
            id="name"
            type="text"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="form-input"
            placeholder="Ex: 3º Ano - Matutino"
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseId" className="form-label">Curso</label>
          <select
            id="courseId"
            value={form.courseId || ""}
            onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
            className="form-select"
          >
            <option value="">Selecione um curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => nav("/classes")} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn">
            {saving ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={20} />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
