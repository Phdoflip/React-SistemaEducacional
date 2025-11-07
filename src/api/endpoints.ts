import { api } from "./cliente";
import type { Course, ClassRoom, Student, Grade } from "../types";


/* Courses */
export const getCourses = async (): Promise<Course[]> => (await api.get("/courses")).data;
export const getCourse = async (id: string | number): Promise<Course> => (await api.get(`/courses/${id}`)).data;
export const createCourse = async (payload: Partial<Course>) => (await api.post("/courses", payload)).data;
export const updateCourse = async (id: string | number, payload: Partial<Course>) => (await api.put(`/courses/${id}`, payload)).data;
export const deleteCourse = async (id: string | number) => (await api.delete(`/courses/${id}`)).data;


/* Classes */
export const getClasses = async (): Promise<ClassRoom[]> => (await api.get("/classes")).data;
export const getClassById = async (id: string | number): Promise<ClassRoom> => (await api.get(`/classes/${id}`)).data;
export const createClass = async (payload: Partial<ClassRoom>) => (await api.post("/classes", payload)).data;
export const updateClass = async (id: string | number, payload: Partial<ClassRoom>) => (await api.put(`/classes/${id}`, payload)).data;
export const deleteClass = async (id: string | number) => (await api.delete(`/classes/${id}`)).data;


/* Students */
export const getStudents = async (): Promise<Student[]> => (await api.get("/students")).data;
export const getStudent = async (id: string | number): Promise<Student> => (await api.get(`/students/${id}`)).data;
export const createStudent = async (payload: Partial<Student>) => (await api.post("/students", payload)).data;
export const updateStudent = async (id: string | number, payload: Partial<Student>) => (await api.put(`/students/${id}`, payload)).data;
export const deleteStudent = async (id: string | number) => (await api.delete(`/students/${id}`)).data;


/* Grades */
export const getGrades = async (): Promise<Grade[]> => (await api.get("/grades")).data;
export const getGradesByClass = async (classId: string | number): Promise<Grade[]> => (await api.get(`/grades?classId=${classId}`)).data;


export const createGrade = async (payload: Partial<Grade>) => (await api.post("/grades", payload)).data;
export const updateGrade = async (id: string | number, payload: Partial<Grade>) => (await api.put(`/grades/${id}`, payload)).data;
export const deleteGrade = async (id: string | number) => (await api.delete(`/grades/${id}`)).data;