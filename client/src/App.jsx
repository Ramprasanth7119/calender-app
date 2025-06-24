
import { ThemeProvider } from './contexts/ThemeContext';
import Calendar from './components/Calender';

function App() {
  return (
    <ThemeProvider>
      <Calendar />
    </ThemeProvider>
  );
}

export default App;
