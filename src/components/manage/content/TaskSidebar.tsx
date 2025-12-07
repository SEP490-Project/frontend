import { Calendar } from "./Calendar";

interface TaskSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export function TaskSidebar({ currentDate, setCurrentDate }: TaskSidebarProps) {
  return (
    <div className="space-y-6">
      <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
    </div>
  );
}
