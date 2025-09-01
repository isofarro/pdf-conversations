import { useEffect, useState } from 'react';
import type { UploadedFile } from '../../../api/openai/types';

type SelectFileProps = {
  files: UploadedFile[];
  currentFile?: UploadedFile;
  onSelect: (fileId: string) => void;
  isBusy: boolean;
};

export const SelectFile = ({
  files,
  currentFile,
  onSelect,
  isBusy,
}: SelectFileProps) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('');

  useEffect(() => {
    setSelectedFileId(currentFile?.id || '');
  }, [currentFile]);

  if (files.length === 0) {
    console.log('No files available for selection.');
    return <div></div>;
  }

  return (
    <div className="select-file">
      <label htmlFor="fileSelect" className="sr-only">
        Select a file:
      </label>
      <select
        id="fileSelect"
        value={selectedFileId}
        onChange={(e) => {
          const fileId = e.target.value;
          setSelectedFileId(fileId);
          onSelect(fileId);
        }}
        disabled={isBusy}
      >
        <option value="" disabled>
          -- Choose a file --
        </option>
        {files.map((file) => (
          <option key={file.id} value={file.id}>
            {file.filename}
          </option>
        ))}
      </select>
    </div>
  );
};
