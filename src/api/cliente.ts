import axios from "axios";
import type { Course, ClassRoom, Student, Grade } from "../types";

const API_BASE = "https://api-estudo-educacao-1.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Simple error interceptor (adjust as needed)
api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(err?.response ?? err)
);

// Cursos
export const getCourses = () =>
  api.get<Course[]>("/courses").then((r) => r.data);
export const getCourse = (id: Course["id"]) =>
  api.get<Course>(`/courses/${id}`).then((r) => r.data);
export const createCourse = (course: Partial<Course>) =>
  api.post<Course>("/courses", course).then((r) => r.data);
export const updateCourse = (id: Course["id"], course: Partial<Course>) =>
  api.put<Course>(`/courses/${id}`, course).then((r) => r.data);
export const deleteCourse = (id: Course["id"]) =>
  api.delete(`/courses/${id}`).then((r) => r.data);

// Turmas
export const getClasses = () =>
  api.get<ClassRoom[]>("/classes").then((r) => r.data);
export const getClass = (id: ClassRoom["id"]) =>
  api.get<ClassRoom>(`/classes/${id}`).then((r) => r.data);
export const createClass = (classRoom: Partial<ClassRoom>) =>
  api.post<ClassRoom>("/classes", classRoom).then((r) => r.data);
export const updateClass = (
  id: ClassRoom["id"],
  classRoom: Partial<ClassRoom>
) => api.put<ClassRoom>(`/classes/${id}`, classRoom).then((r) => r.data);
export const deleteClass = (id: ClassRoom["id"]) =>
  api.delete(`/classes/${id}`).then((r) => r.data);

// Alunos
export const getStudents = () =>
  api.get<Student[]>("/students").then((r) => r.data);
export const getStudent = (id: Student["id"]) =>
  api.get<Student>(`/students/${id}`).then((r) => r.data);
export const createStudent = (student: Partial<Student>) =>
  api.post<Student>("/students", student).then((r) => r.data);
export const updateStudent = (id: Student["id"], student: Partial<Student>) =>
  api.put<Student>(`/students/${id}`, student).then((r) => r.data);
export const deleteStudent = (id: Student["id"]) =>
  api.delete(`/students/${id}`).then((r) => r.data);

// Notas
export const getGrades = () => api.get<Grade[]>("/grades").then((r) => r.data);
export const getGrade = (id: Grade["id"]) =>
  api.get<Grade>(`/grades/${id}`).then((r) => r.data);
export const createGrade = (grade: Partial<Grade>) =>
  api.post<Grade>("/grades", grade).then((r) => r.data);
export const updateGrade = (id: Grade["id"], grade: Partial<Grade>) =>
  api.put<Grade>(`/grades/${id}`, grade).then((r) => r.data);
export const deleteGrade = (id: Grade["id"]) =>
  api.delete(`/grades/${id}`).then((r) => r.data);
