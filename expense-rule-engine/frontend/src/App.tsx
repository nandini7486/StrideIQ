import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { RuleProvider } from '@/context/RuleContext';
import { ThemeProvider } from '@/components/theme-provider';
import RulesPage from '@/pages/RulesPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RuleProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<RulesPage />} />
            <Route path="/rules" element={<RulesPage />} />
          </Routes>
          <Toaster />
        </div>
      </RuleProvider>
    </ThemeProvider>
  )
}

export default App
