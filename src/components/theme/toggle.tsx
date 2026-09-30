import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from "@/hooks/theme";

// Theme Toggle Option
function Toggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Light' : 'Dark';
  const Icon = isDark ? FiSun : FiMoon;

  return (
    <button
      onClick={toggleTheme}
      className="hover:border-gray-400 cursor-pointer flex items-center justify-between rounded-md border border-theme bg-transparent px-3 py-2"
      aria-label="Toggle theme"
    >
      <Icon />
      <span className='pl-2'>{label}</span>
    </button>
  );
}

export default Toggle
