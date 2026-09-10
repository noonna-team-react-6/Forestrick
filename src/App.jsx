import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/home/HomePage";
import AssistantPage from "./pages/assistant/AssistantPage";
import OfficialDocumentPage from "./pages/official/OfficialDocumentPage";
import AnalysisPage from "./pages/analysis/AnalysisPage";
import DocumentEditorPage from "./pages/editor/DocumentEditorPage";
import DocumentArchivePage from "./pages/archive/DocumentArchivePage";
import UiGuidePage from "./pages/ui/UiGuidePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* 나중에 */}
        <Route index element={<HomePage />} />
        {/* 동희 */}
        <Route path="assistant" element={<AssistantPage />} />

        {/* 지은 */}
        <Route path="official" element={<OfficialDocumentPage />} />

        {/* 상진 */}
        <Route path="analysis" element={<AnalysisPage />} />

        {/* 하린 */}
        <Route path="editor" element={<DocumentEditorPage />} />

        {/* 혜연 */}
        <Route path="archive" element={<DocumentArchivePage />} />

        {/* UI 가이드 */}
        <Route path="ui" element={<UiGuidePage />} />
      </Route>
    </Routes>
  );
}
