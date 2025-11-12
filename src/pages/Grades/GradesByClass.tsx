import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Student, ClassRoom, Grade } from "../../types";
import { ArrowLeft, BookUser, LoaderCircle, Save } from "lucide-react";
import toast from "react-hot-toast";
import {
  getClass,
  getStudents,
  getGrades,
  createGrade,
  updateGrade,
} from "../../api/cliente";
import Spinner from "../../components/Spinner";

type StudentGrade = Student & { grade?: Grade };

export default function GradesByClass() {
  const nav = useNavigate();
  const { classId } = useParams();
  const [classRoom, setClassRoom] = useState<ClassRoom | null>(null);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialStudents, setInitialStudents] = useState<StudentGrade[]>([]); // Para comparar mudanças
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
        setInitialStudents(JSON.parse(JSON.stringify(studentsWithGrades))); // Cópia profunda para estado inicial
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar os dados da turma.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId, nav]);

  const handleGradeChange = (
    studentId: Student["id"],
    field: "prova" | "trabalho",
    value: string
  ) => {
    const numValue = Number(value) || 0;
    if (numValue < 0 || numValue > 10) {
      toast.error("A nota deve ser entre 0 e 10.");
      return;
    }

    setStudents((current) =>
      current.map((s) => {
        if (String(s.id) !== String(studentId)) return s;

        const updatedGrade = {
          ...(s.grade || {}),
          studentId,
          classId,
          [field]: value, // Armazena como string para o input
        } as Grade;

        return { ...s, grade: updatedGrade };
      })
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const promises: Promise<unknown>[] = [];

    students.forEach((student, index) => {
      const initialStudent = initialStudents[index];
      const currentGrade = student.grade;
      const initialGrade = initialStudent.grade;

      // Salva apenas se a nota mudou
      if (JSON.stringify(currentGrade) !== JSON.stringify(initialGrade)) {
        if (currentGrade?.id) {
          promises.push(updateGrade(currentGrade.id, currentGrade));
        } else if (currentGrade) {
          promises.push(createGrade(currentGrade));
        }
      }
    });

    try {
      await Promise.all(promises);
      if (promises.length > 0) {
        toast.success("Notas salvas com sucesso!");
        setInitialStudents(JSON.parse(JSON.stringify(students))); // Atualiza o estado inicial
      } else {
        toast.success("Nenhuma alteração para salvar.");
      }
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
      toast.error("Ocorreu um erro ao salvar as notas.");
    } finally {
      setSaving(false);
    }
  };

  if (!classId) return null;

  const getAverage = (grade?: Grade) => {
    if (!grade || typeof grade.prova === 'undefined' || typeof grade.trabalho === 'undefined') return null;
    return ((Number(grade.prova) || 0) + (Number(grade.trabalho) || 0)) / 2;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {classRoom?.name ? (
            <>
              <span style={{ fontWeight: 400, color: 'var(--color-muted)' }}>Notas da Turma:</span>
              {classRoom.name}
            </>
          ) : (
            "Carregando..."
          )}
        </h1>
        <button onClick={() => nav("/classes")} className="btn btn-secondary">
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : students.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <BookUser size={48} color="#9ca3af" />
          <p>Nenhum aluno encontrado nesta turma</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Prova</th>
                <th>Trabalho</th>
                <th>Média</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const average = getAverage(student.grade);
                const averageClass = average === null ? '' : average >= 6 ? 'grade-pass' : 'grade-fail';

                return (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={student.grade?.prova || ""}
                      onChange={(e) => handleGradeChange(student.id, "prova", e.target.value)}
                      // disabled={saving} // Permite edição enquanto salva
                      className="form-input"
                      style={{ width: '80px' }}
                      placeholder="0.0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={student.grade?.trabalho || ""}
                      onChange={(e) => handleGradeChange(student.id, "trabalho", e.target.value)}
                      // disabled={saving}
                      className="form-input"
                      style={{ width: '80px' }}
                      placeholder="0.0"
                    />
                  </td>
                  <td>
                    <div className={`grade-average ${averageClass}`}>
                      {average !== null ? average.toFixed(1) : "-"}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button onClick={handleSaveAll} disabled={saving} className="btn">
              {saving ? <><LoaderCircle size={20} className="animate-spin" /> Salvando...</> : <><Save size={20} /> Salvar Alterações</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
