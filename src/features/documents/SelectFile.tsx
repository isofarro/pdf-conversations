import { useState } from "react";

type SelectFileProps = {
    onSelect: (file: string) => void;
}

export const SelectFile = ({ onSelect }: SelectFileProps) => {
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSelect = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!file) {
            alert("No file selected");
            return;
        }
        onSelect(file.name);
        e.preventDefault();
    };

    return (
        <form action="http://localhost:8080/upload" method="post" encType="multipart/form-data">
            <input name="myFile" type="file" onChange={handleChange} />
            <button type="submit" onClick={handleSelect}>Upload</button>
        </form>
    )
}
