export interface Course {
id: number | string;
name: string;
description?: string;
}


export interface ClassRoom {
id: number | string;
name: string;
courseId: number | string;
}


export interface Student {
id: number | string;
name: string;
email?: string;
classId: number | string;
}


export interface Grade {
id?: number | string;
studentId: number | string;
classId: number | string;
prova: number;
trabalho: number;
}