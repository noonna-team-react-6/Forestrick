import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AssistantPage from "./pages/assistant/AssistantPage";
import OfficialDocumentPage from "./pages/official/OfficialDocumentPage";
import AnalysisPage from "./pages/analysis/AnalysisPage";
import DocumentEditorPage from "./pages/editor/DocumentEditorPage";
import DocumentArchivePage from "./pages/archive/DocumentArchivePage";

export default function App() {
  return (
    <>
      <Routes>
        {/* 하린 */}
        <Route index element={<HomePage />} />
        {/* 상진 */}
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/official" element={<OfficialDocumentPage />} />

        {/* 혜연 */}
        <Route path="/analysis" element={<AnalysisPage />} />

        {/* 하린 */}
        <Route path="/editor" element={<DocumentEditorPage />} />

        {/* 혜연 */}
        <Route path="/archive" element={<DocumentArchivePage />} />
      </Routes>
    </>
  );
}
