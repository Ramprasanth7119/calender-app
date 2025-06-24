export const initializeTheme = () => {
  if (localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    return true;
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    return false;
  }
};