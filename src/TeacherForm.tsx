import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Teacher } from "./types";
import { ArrowLeft, Save, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { getTeacher, createTeacher, updateTeacher } from "./api/cliente";

export default function TeacherForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const editMode = Boolean(id);
  const [form, setForm] = useState<Partial<Teacher>>({
    name: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTeacher() {
      if (!editMode || !id) return;
      try {
        const data = await getTeacher(id);
        setForm(data);
      } catch (error) {
        console.error("Erro ao carregar professor:", error);
        toast.error("Erro ao carregar os dados do professor.");
      }
    }
    loadTeacher();
  }, [editMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("O nome do professor é obrigatório.");
      return;
    }

    try {
      setSaving(true);
      if (editMode && id) await updateTeacher(id, form);
      else await createTeacher(form);
      toast.success(`Professor ${editMode ? "atualizado" : "criado"} com sucesso!`);
      nav("/teachers");
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
      toast.error("Erro ao salvar o professor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="page-header">
        <h1 className="page-title">{editMode ? "Editar Professor" : "Novo Professor"}</h1>
        <button type="button" onClick={() => nav("/teachers")} className="btn btn-secondary">
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
            placeholder="Digite o nome do professor"
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
            placeholder="email.professor@exemplo.com"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => nav("/teachers")} className="btn btn-secondary">
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