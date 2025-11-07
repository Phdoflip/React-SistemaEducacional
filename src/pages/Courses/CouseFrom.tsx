import { useEffect, useState } from "react";
import { api } from "../../api/cliente";

interface Course {
  id: number;
  name: string;
  description: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ name: "", description: "" });

  async function load() {
    const res = await api.get("/courses");
    setCourses(res.data);
  }

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/courses", form);
    setForm({ name: "", description: "" });
    load();
  }

  async function deleteCourse(id: number) {
    await api.delete(`/courses/${id}`);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white shadow-xl p-8 rounded-2xl">
      <h1 className="text-3xl font-serif font-bold text-center mb-8 text-blue-900">
        Cursos
      </h1>

      {/* Formulário */}
      <form onSubmit={createCourse} className="mb-10 space-y-4">
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Nome do curso"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className="w-full border p-3 rounded-lg"
          placeholder="Descrição"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          Criar Curso
        </button>
      </form>

      {/* Tabela */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-3">Nome</th>
            <th className="border p-3">Descrição</th>
            <th className="border p-3">Ações</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border p-3">{c.name}</td>
              <td className="border p-3">{c.description}</td>
              <td className="border p-3">
                <button
                  onClick={() => deleteCourse(c.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
