// ScrollableCheckboxList.jsx
import React from 'react';

interface ScrollableCheckboxListProps<T> {
    items: T[];
    checkedItems: T[];
    onChange: (item: T) => void;
    getKey: (item: T) => string | number;
    renderItem: (item: T) => React.ReactNode;
}

const ScrollableCheckboxList = <T,>({
    items,
    checkedItems,
    onChange,
    getKey,
    renderItem,
}: ScrollableCheckboxListProps<T>) => {
    return (
        <div className="max-h-48 overflow-y-auto border p-4 mb-4">
            {items.map((item) => (
                <div
                    key={getKey(item)}
                    className={`flex items-center mb-2 cursor-pointer p-2 transition-colors ${
                        checkedItems.some((r) => getKey(r) === getKey(item)) ? 'bg-primary' : 'hover:bg-primary'
                    }`}
                    onClick={() => onChange(item)}
                >
                    <input
                        type="checkbox"
                        checked={checkedItems.some((r) => getKey(r) === getKey(item))}
                        onChange={() => onChange(item)}
                        className="mr-2 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
};

export default ScrollableCheckboxList;
