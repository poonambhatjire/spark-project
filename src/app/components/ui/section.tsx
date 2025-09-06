import { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

const Section = ({ id, title, children, className = "" }: SectionProps) => {
  return (
    <section 
      id={id} 
      aria-labelledby={`${id}-heading`}
      className={`py-20 ${className}`}
    >
      <div className="container text-center">
        <h2 
          id={`${id}-heading`}
          className="text-2xl font-bold text-slate-900 mb-6"
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
};

export default Section;
