// Accordion.tsx
import React, { useState } from 'react';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border rounded mb-2 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left bg-gray-200 p-2 rounded hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                {title}
            </button>
            {isOpen && <div className="p-2 dark:bg-gray-800 dark:text-gray-200">{children}</div>}
        </div>
    );
};

export default Accordion;