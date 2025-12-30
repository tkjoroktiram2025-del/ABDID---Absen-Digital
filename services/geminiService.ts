import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, Role } from "../types";

// Note: In a real app, API_KEY comes from process.env.API_KEY.
// For this demo, we assume it's available.
const apiKey = process.env.API_KEY || 'YOUR_API_KEY_HERE'; 
const ai = new GoogleGenAI({ apiKey });

export const generateAttendanceReport = async (
  records: AttendanceRecord[],
  role: Role
): Promise<string> => {
  if (apiKey === 'YOUR_API_KEY_HERE') {
    return "API Key not configured. Please configure process.env.API_KEY to use Gemini insights.";
  }

  const today = new Date().toISOString().split('T')[0];
  const roleName = role === Role.GURU ? "Teachers" : "Students";
  
  // Prepare data summary for the prompt
  const presentCount = records.filter(r => r.status === 'Hadir').length;
  const sickCount = records.filter(r => r.status === 'Sakit').length;
  const lateCount = records.filter(r => r.status === 'Terlambat').length;
  const absentCount = records.filter(r => r.status === 'Alpha').length;

  const prompt = `
    Analyze the following attendance data for ${roleName} on ${today}.
    
    Summary:
    - Present: ${presentCount}
    - Late: ${lateCount}
    - Sick: ${sickCount}
    - Alpha (Absent without notice): ${absentCount}
    - Total Records: ${records.length}

    Please provide a professional, concise executive summary (max 100 words) of the attendance situation today. 
    Highlight any alarming trends (like high absence or lateness) and provide a quick recommendation for the school admin.
    Tone: Formal, Insightful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate AI report due to an error.";
  }
};
