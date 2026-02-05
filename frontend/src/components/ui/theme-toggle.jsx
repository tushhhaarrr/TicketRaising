import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute"
                >
                    {theme === "dark" ? (
                        <Moon className="h-5 w-5 text-teal-400" fill="currentColor" />
                    ) : (
                        <Sun className="h-5 w-5 text-orange-500" fill="currentColor" />
                    )}
                </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};
