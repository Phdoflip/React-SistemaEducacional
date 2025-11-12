import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Student, ClassRoom } from "../../types";
import { ArrowLeft, Save, LoaderCircle } from "lucide-react";
import {
  getStudent,
  createStudent,
  updateStudent,
  getClasses,
} from "../../api/cliente";

export default function StudentForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const editMode = Boolean(id);
  const [form, setForm] = useState<Partial<Student>>({
    name: "",
    email: "",
    classId: "",
  });
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Carregar turmas
        const classesData = await getClasses();
        setClasses(classesData || []);

        // Se for edição, carregar dados do aluno
        if (editMode && id) {
          const studentData = await getStudent(id);
          setForm(studentData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados");
      }
    }
    loadData();
  }, [editMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert("Nome é obrigatório");
    if (!form.classId) return alert("Turma é obrigatória");

    try {
      setSaving(true);
      if (editMode && id) await updateStudent(id, form);
      else await createStudent(form);
      nav("/students");
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert("Erro ao salvar aluno");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="page-header">
        <h1 className="page-title">{editMode ? "Editar Aluno" : "Novo Aluno"}</h1>
        <button type="button" onClick={() => nav("/students")} className="btn btn-secondary">
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nome Completo</label>
          <input
            id="name"
            type="text"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="form-input"
            placeholder="Digite o nome do aluno"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="form-input"
            placeholder="email@exemplo.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="classId" className="form-label">Turma</label>
          <select
            id="classId"
            value={form.classId || ""}
            onChange={(e) => setForm((f) => ({ ...f, classId: e.target.value }))}
            className="form-select"
          >
            <option value="">Selecione uma turma</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => nav("/students")} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="btn">
            {saving ? <><LoaderCircle size={20} className="animate-spin" /> Salvando...</> : <><Save size={20} /> Salvar</>}
          </button>
        </div>
      </form>
    </div>
  );
}
