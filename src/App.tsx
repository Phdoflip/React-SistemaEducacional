import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CoursesList from "./pages/Courses/CoursesList";
import CourseForm from "./pages/Courses/CourseForm";
import ClassesList from "./pages/Classes/ClassesList";
import ClassForm from "./pages/Classes/ClassForm";
import StudentsList from "./pages/Students/StudentsList";
import StudentForm from "./pages/Students/StudentForm";
import GradesByClass from "./pages/Grades/GradesByClass";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/courses" replace />} />

        <Route path="courses">
          <Route index element={<CoursesList />} />
          <Route path="new" element={<CourseForm />} />
          <Route path=":id/edit" element={<CourseForm />} />
        </Route>

        <Route path="classes">
          <Route index element={<ClassesList />} />
          <Route path="new" element={<ClassForm />} />
          <Route path=":id/edit" element={<ClassForm />} />
        </Route>

        <Route path="students">
          <Route index element={<StudentsList />} />
          <Route path="new" element={<StudentForm />} />
          <Route path=":id/edit" element={<StudentForm />} />
        </Route>

        <Route path="grades">
          <Route
            index
            element={
              <div className="text-center py-8 text-gray-500">
                Escolha uma turma para lançar notas
              </div>
            }
          />
          <Route path="class/:classId" element={<GradesByClass />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

