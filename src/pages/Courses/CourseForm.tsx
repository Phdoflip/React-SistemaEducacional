import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Course } from "../../types";
import { ArrowLeft, Save, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getCourse, createCourse, updateCourse } from "../../api/cliente";

export default function CourseForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const editMode = Boolean(id);
  const [form, setForm] = useState<Partial<Course>>({
    name: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      if (!editMode || !id) return;
      try {
        const data = await getCourse(id);
        setForm(data);
      } catch (error) {
        console.error("Erro ao carregar curso:", error);
        toast.error("Erro ao carregar o curso.");
      }
    }
    loadCourse();
  }, [editMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("O nome do curso é obrigatório.");
      return;
    }

    try {
      setSaving(true);
      if (editMode && id) await updateCourse(id, form);
      else await createCourse(form);
      toast.success(`Curso ${editMode ? "atualizado" : "criado"} com sucesso!`);
      nav("/courses");
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      toast.error("Erro ao salvar o curso.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="page-header">
        <h1 className="page-title">{editMode ? "Editar Curso" : "Novo Curso"}</h1>
        <button type="button" onClick={() => nav("/courses")} className="btn btn-secondary">
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nome do Curso</label>
          <input
            id="name"
            type="text"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="form-input"
            placeholder="Ex: Análise e Desenvolvimento de Sistemas"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Descrição</label>
          <textarea
            id="description"
            value={form.description || ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="form-textarea"
            placeholder="Digite a descrição do curso"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => nav("/courses")} className="btn btn-secondary">
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
