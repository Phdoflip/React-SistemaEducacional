import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Student, ClassRoom, Grade } from "../../types";
import {
  getClass,
  getStudents,
  getGrades,
  createGrade,
  updateGrade,
} from "../../api/cliente";

type StudentGrade = Student & { grade?: Grade };

export default function GradesByClass() {
  const nav = useNavigate();
  const { classId } = useParams();
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!classId) {
      nav("/grades");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        const [classData, studentsData, gradesData] = await Promise.all([
          getClass(classId as string),
          getStudents(),
          getGrades(),
        ]);

        setClassRoom(classData);

        // Filtra alunos da turma e combina com suas notas
        const classStudents = studentsData.filter(
          (s) => String(s.classId) === String(classId)
        );
        const studentsWithGrades = classStudents.map((student) => ({
          ...student,
          grade: gradesData.find(
            (g) =>
              String(g.studentId) === String(student.id) &&
              String(g.classId) === String(classId)
          ),
        }));

        setStudents(studentsWithGrades);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId, nav]);

  const handleGradeChange = async (
    studentId: Student["id"],
    field: "prova" | "trabalho",
    value: string
  ) => {
    const numValue = Number(value) || 0;
    if (numValue < 0 || numValue > 10) return;

    try {
      setSaving(true);
      const student = students.find((s) => String(s.id) === String(studentId));
      if (!student) return;

      const currentGrade = student.grade;
      const updatedGrade = {
        ...(currentGrade || {}),
        studentId,
        classId,
        [field]: numValue,
      } as Grade;

      if (currentGrade?.id) {
        await updateGrade(currentGrade.id, updatedGrade);
      } else {
        await createGrade(updatedGrade);
      }

      // Atualiza estado local
      setStudents((current) =>
        current.map((s) =>
          String(s.id) === String(studentId) ? { ...s, grade: updatedGrade } : s
        )
      );
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      alert("Erro ao salvar nota");
    } finally {
      setSaving(false);
    }
  };

  if (!classId) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {classRoom?.name ? (
            <>
              <span className="text-gray-600 text-lg">Notas da Turma:</span>
              <br />
              <span className="text-2xl">{classRoom.name}</span>
            </>
          ) : (
            "Carregando..."
          )}
        </h1>
        <button
          onClick={() => nav("/classes")}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Voltar para Turmas
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-gray-500">Nenhum aluno encontrado nesta turma</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prova
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trabalho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Média
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={student.grade?.prova || ""}
                      onChange={(e) =>
                        handleGradeChange(student.id, "prova", e.target.value)
                      }
                      disabled={saving}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={student.grade?.trabalho || ""}
                      onChange={(e) =>
                        handleGradeChange(
                          student.id,
                          "trabalho",
                          e.target.value
                        )
                      }
                      disabled={saving}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="0.0"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`font-medium text-lg ${
                        student.grade
                          ? (Number(student.grade.prova) +
                              Number(student.grade.trabalho)) /
                              2 >=
                            6
                            ? "text-green-600"
                            : "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {student.grade
                        ? (
                            (Number(student.grade.prova) +
                              Number(student.grade.trabalho)) /
                            2
                          ).toFixed(1)
                        : "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {saving && (
            <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Salvando...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
