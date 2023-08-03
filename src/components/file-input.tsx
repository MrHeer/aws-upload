import React, { useCallback } from "react";
import { Input } from "./ui/input";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | "onChange" | "type"> {
  value?: File,
  onChange?: (file?: File) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, ...props }, ref) => {

    const onFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.files?.[0]);
    }, [onChange]);

    return (
      <Input
        ref={ref}
        onChange={onFileChange}
        type='file'
        {...props}
      />
    )
  }
)
FileInput.displayName = "FileInput"

export default FileInput
