import { useState, useEffect } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'default';

export const useBreakpoint = (): Breakpoint => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('default');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= breakpoints.xl) {
                setBreakpoint('xl');
            } else if (width >= breakpoints.lg) {
                setBreakpoint('lg');
            } else if (width >= breakpoints.md) {
                setBreakpoint('md');
            } else if (width >= breakpoints.sm) {
                setBreakpoint('sm');
            } else {
                setBreakpoint('default');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    },[])

    return breakpoint;
}