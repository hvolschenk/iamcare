import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText, {
  FormHelperTextProps as MUIFormHelperTextProps,
} from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { InputBaseComponentProps } from '@mui/material/InputBase';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import { Image } from '~/src/types/Image';

import ImageUploadImage from './Image';

export interface ImageUploadProps {
  allowedTypes: string[];
  FormHelperTextProps?: MUIFormHelperTextProps;
  helperText: string;
  inputProps: InputBaseComponentProps;
  label: string;
  labelUploadButton: string;
  onChange(files: (File | Image)[]): void;
  values: Image[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  allowedTypes,
  FormHelperTextProps,
  helperText,
  inputProps,
  label,
  labelUploadButton,
  onChange,
  values,
}) => {
  /**
   * The values between `files` and `removedFiles`
   * as well as the values between `values` and `removedValues` are repeated.
   * This is to be able to keep the original order set by `files` and `values`.
   */
  const [files, setFiles] = React.useState<File[]>([]);
  const [removedFiles, setRemovedFiles] = React.useState<File[]>([]);
  const [removedValues, setRemovedValues] = React.useState<Image[]>([]);

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

  const tileSize = React.useMemo(
    () => parseInt(theme.spacing(1), 10) * 20,
    [theme],
  );

  // The dependency array here purposefully DOES NOT contain `values`.
  // The `onChange` call will update `values`
  // and this will cause an infinite loop
  React.useEffect(() => {
    const allFiles = files.filter((file) => !removedFiles.includes(file));
    const allValues = values.filter((value) => !removedValues.includes(value));
    onChange([...allValues, ...allFiles]);
  }, [files, onChange, removedFiles, removedValues]);

  const onAddButtonClick = React.useCallback(() => {
    if (inputElementRef.current) {
      inputElementRef.current.click();
    }
  }, [inputElementRef]);

  const onFileRemove = React.useCallback(
    (file: File) => {
      setRemovedFiles((currentRemovedFiles) => [...currentRemovedFiles, file]);
    },
    [setRemovedFiles],
  );

  const onFileRestore = React.useCallback(
    (file: File) => {
      setRemovedFiles((currentRemovedFiles) =>
        currentRemovedFiles.filter(
          (currentRemovedFile) => currentRemovedFile !== file,
        ),
      );
    },
    [setRemovedFiles],
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

  const onValueRemove = React.useCallback(
    (value: Image) => {
      setRemovedValues((currentRemovedValues) => [
        ...currentRemovedValues,
        value,
      ]);
    },
    [setRemovedValues],
  );

  const onValueRestore = React.useCallback(
    (image: Image) => {
      setRemovedValues((currentRemovedValues) =>
        currentRemovedValues.filter(
          (currentRemovedValue) => currentRemovedValue !== image,
        ),
      );
    },
    [setRemovedValues],
  );

  return (
    <FormControl component="fieldset" fullWidth margin="normal">
      <FormLabel component="legend">{label}</FormLabel>

      <ImageList
        cols={columnCount}
        // Having to specify the gap like this is horrendous.
        // No direct theme support here.
        gap={parseInt(theme.spacing(1), 10)}
        rowHeight={tileSize}
      >
        {values.map((value, index) => (
          <ImageUploadImage
            file={value}
            isRemoved={removedValues.indexOf(value) > -1}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onImageRemove={() => onValueRemove(value)}
            onImageRestore={() => onValueRestore(value)}
          />
        ))}
        {files.map((file, index) => (
          <ImageUploadImage
            file={file}
            isRemoved={removedFiles.indexOf(file) > -1}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onImageRemove={() => onFileRemove(file)}
            onImageRestore={() => onFileRestore(file)}
          />
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
            sx={{
              height: tileSize,
              marginY: 'auto',
              width: tileSize,
            }}
            variant="outlined"
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

export default ImageUpload;
