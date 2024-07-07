import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./components/navigation/Nav"
import HomePage from "./pages/HomePage"
import Dashboard from "./pages/Dashboard"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import ResetPasswordPageConfirm from "./pages/ResetPasswordPageConfirm";
import ActivatePage from "./pages/ActivatePage";
import NotFoundPage from "./pages/NotFoundPage";
import ExamViewer from "./pages/ExamViewer";
import initCornerstone from "./initCornerstone";
import Loading from "./pages/loading";
// import { PDFViewer } from '@react-pdf/renderer';
// import ReportPDF from "./pages/ReportPDF";
import PDF from "./pages/Report"

initCornerstone();

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivatePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewer" element={<ExamViewer />} />
          <Route path="/report" element={<PDF />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
