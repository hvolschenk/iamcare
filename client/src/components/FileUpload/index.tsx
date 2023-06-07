import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText, {
  FormHelperTextProps as MUIFormHelperTextProps,
} from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { InputBaseComponentProps } from '@mui/material/InputBase';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import Preview from './Preview';

export interface FileUploadProps {
  allowedTypes: string[];
  FormHelperTextProps?: MUIFormHelperTextProps;
  helperText: string;
  inputProps: InputBaseComponentProps;
  label: string;
  labelUploadButton: string;
  onChange(files: File[]): void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  allowedTypes,
  FormHelperTextProps,
  helperText,
  inputProps,
  label,
  labelUploadButton,
  onChange,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const inputElementRef = React.useRef<HTMLInputElement | null>(null);

  const theme = useTheme();
  const isBreakpointLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isBreakpointMd = useMediaQuery(theme.breakpoints.up('md'));

  const columnCount = React.useMemo<number>(() => {
    if (isBreakpointLg) {
      return 6;
    }
    if (isBreakpointMd) {
      return 4;
    }
    return 2;
  }, [isBreakpointLg, isBreakpointMd]);

  const inputAccept = React.useMemo<string>(
    () => allowedTypes.join(','),
    [allowedTypes],
  );

  const onAddButtonClick = React.useCallback(() => {
    if (inputElementRef.current) {
      inputElementRef.current.click();
    }
  }, [inputElementRef]);

  const onFileRemove = React.useCallback(
    (index: number) => {
      setFiles((currentFiles) =>
        currentFiles.filter(
          (currentFile, currentFileIndex) => currentFileIndex !== index,
        ),
      );
    },
    [setFiles],
  );

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      (event) => {
        if (event.target.files && event.target.files.length > 0) {
          setFiles((currentFiles) => [
            ...currentFiles,
            ...Array.from(event.target.files!),
          ]);
        }
      },
      [setFiles],
    );

  React.useEffect(() => {
    onChange(files);
  }, [files, onChange]);

  return (
    <FormControl component="fieldset" fullWidth margin="normal">
      <FormLabel component="legend">{label}</FormLabel>

      {/* Having to specify the gap like this is horrendous. No direct theme support here. */}
      <ImageList cols={columnCount} gap={parseInt(theme.spacing(1), 10)}>
        {files.map((file, index) => (
          <ImageListItem
            data-testid="file-upload__uploaded-item"
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            sx={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Preview file={file} />
            <ImageListItemBar
              actionIcon={
                <IconButton
                  data-testid={`file-upload__uploaded-item__remove--${index}`}
                  onClick={() => onFileRemove(index)}
                >
                  <CloseIcon />
                </IconButton>
              }
              position="top"
              title={file.name}
            />
          </ImageListItem>
        ))}
        <ImageListItem>
          <input
            accept={inputAccept}
            multiple
            onChange={onInputChange}
            ref={inputElementRef}
            style={{ display: 'none' }}
            type="file"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...inputProps}
          />
          <Button
            color="primary"
            data-testid="file-upload__add"
            onClick={onAddButtonClick}
            size="small"
            startIcon={<AddIcon />}
            sx={{ marginY: 'auto' }}
            variant="contained"
          >
            {labelUploadButton}
          </Button>
        </ImageListItem>
      </ImageList>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormHelperText {...FormHelperTextProps}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default FileUpload;
