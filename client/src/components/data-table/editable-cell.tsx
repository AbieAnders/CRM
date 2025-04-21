import React from 'react';
import { z, ZodNumber } from 'zod';

type EditableCellProps<T extends string | number | string[] | Date | null> = {
    value: T;
    onSave: (newValue: T) => void;
    schema?: z.ZodType<T>;
    allValues?: T[];
    uniqueError?: string;
    className?: string;
    placeholder?: string;
};

function EditableCell<T extends string | number | string[] | Date | null>({ value, onSave, schema, allValues = [], uniqueError = "Uniqueness error message", className = "", placeholder = "N/A" }: EditableCellProps<T>) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [newValue, setNewValue] = React.useState(value?.toString() ?? "");
    const [error, setError] = React.useState<string | null>(null);

    const handleBlur = () => {
        let parsedValue: any = newValue;

        if (schema instanceof ZodNumber) {
            parsedValue = Number(newValue);
            if (isNaN(parsedValue)) {
                setError("Must be a number");
                return;
            }
        }
        if (schema) {
            const result = schema.safeParse(parsedValue);
            if (!result.success) {
                setError(result.error.errors[0]?.message || "Invalid input");
                return;
            }
        }
        if (allValues.includes(parsedValue) && parsedValue !== value) {
            setError(uniqueError);
            return;
        }

        onSave(parsedValue as T);
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewValue(e.target.value);
        if (error) setError(null);
    };

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newValue]);

    return isEditing ? (
        <>
            <textarea
                ref={textareaRef}
                value={newValue}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus
                className={`border border-outline bg-white text-black max-w-[125px] resize-none ${className}`}
                style={{ height: 'auto', minHeight: '50px' }}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
        </>
    ) : (
        <div className="font-medium" onClick={() => setIsEditing(true)}>
            {newValue || placeholder}
        </div>
    );
}

export default EditableCell;