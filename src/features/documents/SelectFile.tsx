import { useState } from 'react';

type SelectFileProps = {
  onSelect: (file: File) => void;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SelectFile = ({ onSelect }: SelectFileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setIsUpdated(true);
    }
  };

  const handleSelect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) {
      alert('No file selected');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    onSelect(file);
    setIsUpdated(false);
  };

  return (
    <form
      action="http://localhost:8080/upload"
      method="post"
      encType="multipart/form-data"
      className="upload-form"
    >
      <label htmlFor="fileInput" className="sr-only">
        Select a file to upload (max 10MB):{' '}
      </label>
      <input name="myFile" type="file" onChange={handleChange} />
      <button type="submit" onClick={handleSelect} disabled={!isUpdated}>
        Upload
      </button>
    </form>
  );
};
