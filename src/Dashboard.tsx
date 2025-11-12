import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, School, Users, ArrowRight } from "lucide-react";
import { getCourses, getClasses, getStudents } from "./api/cliente";
import Spinner from "./components/Spinner";
import toast from "react-hot-toast";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  link: string;
  color: string;
}

function StatCard({ icon, title, value, link, color }: StatCardProps) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-card-icon" style={{ backgroundColor: color }}>{icon}</div>
      <div className="stat-card-info">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
      <Link to={link} className="stat-card-link">
        <ArrowRight size={20} />
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ courses: 0, classes: 0, students: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [coursesData, classesData, studentsData] = await Promise.all([
          getCourses(),
          getClasses(),
          getStudents(),
        ]);
        setStats({
          courses: coursesData?.length || 0,
          classes: classesData?.length || 0,
          students: studentsData?.length || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        toast.error("Não foi possível carregar o dashboard.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '2rem' }}>Dashboard</h1>
      <div className="dashboard-grid">
        <StatCard icon={<BookOpen size={24} color="white" />} title="Cursos" value={stats.courses} link="/courses" color="#007bff" />
        <StatCard icon={<School size={24} color="white" />} title="Turmas" value={stats.classes} link="/classes" color="#28a745" />
        <StatCard icon={<Users size={24} color="white" />} title="Estudantes" value={stats.students} link="/students" color="#ffc107" />
      </div>
    </div>
  );
}