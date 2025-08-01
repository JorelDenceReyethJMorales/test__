import { useEffect, useState } from "react";

function TESDASelection({ selected, onChange }) {
    const options = [
        { id: "tesda", label: "TESDA Certificate", desc: "For TESDA Record of Candidate for Graduation" },
        { id: "custom", label: "Custom Template", desc: "Create your custom template" },
    ];

    const [fileMap, setFileMap] = useState({
        tesda: null,
        custom: null,
    });

    useEffect(() => {
        fetch("http://localhost:5000/api/templates")
            .then(res => res.json())
            .then(data => {
                const updated = { tesda: null, custom: null };
                if (data.tesda) {
                    updated.tesda = {
                        name: data.tesda.name,
                        isDefault: true,
                        url: `http://localhost:5000${data.tesda.url}`,
                    };
                }
                setFileMap(updated);
            });
    }, []);

    const currentFile = fileMap[selected];

    return (
        <form className="flex flex-col gap-4">
            {/* Template options */}
            {options.map((opt) => (
                <div
                    key={opt.id}
                    className={`radioSelect ${selected === opt.id ? "radioSelect--selected" : ""}`}
                >
                    <input
                        type="radio"
                        name="template"
                        id={opt.id}
                        value={opt.id}
                        className="accent-[#a361ef]"
                        checked={selected === opt.id}
                        onChange={() => onChange(opt.id)}
                    />
                    <label htmlFor={opt.id} className="flex flex-col">
                        <h3 className="text-xl">{opt.label}</h3>
                        <p className="text-xs">{opt.desc}</p>
                    </label>
                </div>
            ))}

            {/* File preview only (optional) */}
            {currentFile && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-medium">{currentFile.name}</span>
                </div>
            )}
        </form>
    );
}

export default TESDASelection;
