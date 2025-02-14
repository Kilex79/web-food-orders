import { useState, useEffect } from "react";

interface WorkSchedule {
  [key: string]: string; // Mapa de días de la semana a lugares
}

export default function WorkSchedule() {
  const [schedule, setSchedule] = useState<WorkSchedule>({});

  useEffect(() => {
    const storedSchedule = localStorage.getItem("schedule");
    if (storedSchedule) {
      setSchedule(JSON.parse(storedSchedule));
    }
  }, []);

  const handleDayChange = (day: string, place: string) => {
    const updatedSchedule = { ...schedule, [day]: place };
    setSchedule(updatedSchedule);
    localStorage.setItem("schedule", JSON.stringify(updatedSchedule)); // Guardamos en localStorage
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4 text-gray-100">
        Selecciona tus días y lugares de trabajo
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day) => (
          <div key={day} className="flex items-center">
            <label className="mr-2 text-gray-100">{day}:</label>
            <input
              type="text"
              placeholder={`Lugar de trabajo para ${day}`}
              value={schedule[day] || ""}
              onChange={(e) => handleDayChange(day, e.target.value)}
              className="p-2 rounded text-gray-900"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
