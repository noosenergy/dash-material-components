import React, {useState, useCallback, useRef, useEffect} from 'react';
import {Box, Typography, CircularProgress, IconButton, Chip, Button, Tooltip} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SendIcon from '@mui/icons-material/Send';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import {alpha} from '@mui/material/styles';
import Papa from 'papaparse';
import {C, uploaderTheme} from '../utils/theme';
import type {CsvUploaderProps, FileOutput} from '../components/inputs/CsvUploader';

// ── Internal types ────────────────────────────────────────────────────────────

type ParseStatus = 'parsing' | 'success' | 'error';

// Raw row from PapaParse — only alive during the parsing step
type RawRow = Record<string, string | number | boolean | null>;

// Internal per-file state; raw File reference dropped after parsing
type FileEntry = {
  id: string;
  name: string;
  sizeBytes: number;
  status: ParseStatus;
  errorMessage?: string;
  /** Populated only when status === 'success'; dropped on error */
  parsedData?: FileOutput;
};

// Return contract for window.DashCsvParsers functions.
// Flat (non-discriminated) to stay compatible with strictNullChecks: false.
type ParserResult = {
  success: boolean;
  data?: RawRow[];
  fields?: string[];
  errorMessage?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeId = (): string => Math.random().toString(36).slice(2);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

/** Transpose row-oriented PapaParse output to column-major layout */
function toColumnar(rows: RawRow[], fields: string[]): FileOutput['data'] {
  return fields.map((field) => rows.map((row) => row[field] ?? null));
}

function downloadCsv(output: FileOutput): void {
  const rows = Array.from({length: output.n_rows}, (_, ri) =>
    output.columns.map((_, ci) => output.data[ci][ri])
  );
  const csv = Papa.unparse({fields: output.columns, data: rows});
  const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8;'}));
  const dot = output.name.lastIndexOf('.');
  const a = document.createElement('a');
  a.href = url;
  a.download =
    dot >= 0
      ? `${output.name.slice(0, dot)}-noos-parsed${output.name.slice(dot)}`
      : `${output.name}-noos-parsed`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── StackedDownloadIcon ───────────────────────────────────────────────────────
// Three overlapping download icons to signal "download multiple files"

const StackedDownloadIcon = ({fontSize = 18}: {fontSize?: number}) => (
  <Box
    sx={{
      position: 'relative',
      width: fontSize + 6,
      height: fontSize,
      overflow: 'visible',
      flexShrink: 0
    }}
  >
    <FileDownloadOutlinedIcon
      sx={{fontSize, position: 'absolute', left: -3, top: 3, opacity: 0.3}}
    />
    <FileDownloadOutlinedIcon
      sx={{fontSize, position: 'absolute', left: 0, top: 0, opacity: 0.6}}
    />
    <FileDownloadOutlinedIcon
      sx={{fontSize, position: 'absolute', left: 3, top: -3, opacity: 1}}
    />
  </Box>
);

// ── CsvUploader ───────────────────────────────────────────────────────────────

const CsvUploader = ({
  id = 'csv-uploader',
  labelText,
  multiple = false,
  maxSizeMb = 50,
  parserId = null,
  margin = 2,
  width = '100%',
  disabled = false,
  nSubmits = 0,
  variant = 'full',
  setProps
}: CsvUploaderProps) => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dz = uploaderTheme.dropZone;
  const ua = uploaderTheme.actions;

  // Refs to track latest values without triggering re-renders (used in auto-upload effect)
  const nSubmitsRef = useRef(nSubmits);
  nSubmitsRef.current = nSubmits;
  const prevSuccessCountRef = useRef(0);

  // ── Auto-upload effect ────────────────────────────────────────────────────
  // In 'auto-upload' mode, push data to Dash each time a new file parses successfully

  useEffect(() => {
    if (files.length === 0) {
      prevSuccessCountRef.current = 0;
      return;
    }
    if (variant !== 'auto-upload') return;

    const successFiles = files.filter((f) => f.status === 'success' && f.parsedData);
    if (successFiles.length <= prevSuccessCountRef.current) return;

    prevSuccessCountRef.current = successFiles.length;
    setProps({
      nSubmits: nSubmitsRef.current + 1,
      contents: successFiles.map((f) => f.parsedData!)
    });
    nSubmitsRef.current += 1;
  }, [files, variant]);

  // ── Parsing ──────────────────────────────────────────────────────────────

  const parseFile = useCallback(
    (file: File, entryId: string) => {
      Papa.parse<RawRow>(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // auto-cast numbers; reduces transfer size, aids PyArrow type inference
        complete: ({data: rows, meta}) => {
          const fields = meta.fields || [];

          let finalRows = rows;
          let finalFields = fields;

          // Optional custom parser registered in window.DashCsvParsers
          if (parserId) {
            const parserFn: ((r: RawRow[], f: string[]) => ParserResult) | undefined = (
              window as Window & {
                DashCsvParsers?: Record<string, (r: RawRow[], f: string[]) => ParserResult>;
              }
            ).DashCsvParsers?.[parserId];

            if (!parserFn) {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === entryId
                    ? {
                        ...f,
                        status: 'error' as const,
                        errorMessage: `Parser "${parserId}" not found in window.DashCsvParsers`
                      }
                    : f
                )
              );
              return;
            }

            const result = parserFn(rows, fields);
            if (!result.success) {
              const errorMessage = result.errorMessage || 'Parse error';
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === entryId ? {...f, status: 'error' as const, errorMessage} : f
                )
              );
              return;
            }
            finalRows = result.data || rows;
            finalFields = result.fields || fields;
          }

          const parsedData: FileOutput = {
            name: file.name,
            columns: finalFields,
            data: toColumnar(finalRows, finalFields),
            n_rows: finalRows.length,
            n_cols: finalFields.length
          };

          setFiles((prev) =>
            prev.map((f) =>
              f.id === entryId ? {...f, status: 'success' as const, parsedData} : f
            )
          );
        },
        error: (error) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entryId ? {...f, status: 'error' as const, errorMessage: error.message} : f
            )
          );
        }
      });
    },
    [parserId]
  );

  // ── File ingestion ────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (fileList: FileList) => {
      const candidates = multiple ? Array.from(fileList) : [fileList[0]];

      candidates.forEach((file) => {
        if (!file) return;
        const id = makeId();

        if (!file.name.toLowerCase().endsWith('.csv')) {
          setFiles((prev) => [
            ...(multiple ? prev : []),
            {
              id,
              name: file.name,
              sizeBytes: file.size,
              status: 'error',
              errorMessage: 'Not a CSV file'
            }
          ]);
          return;
        }

        if (file.size > maxSizeMb * 1_048_576) {
          setFiles((prev) => [
            ...(multiple ? prev : []),
            {
              id,
              name: file.name,
              sizeBytes: file.size,
              status: 'error',
              errorMessage: `Exceeds ${maxSizeMb} MB limit`
            }
          ]);
          return;
        }

        if (multiple) {
          const duplicate = files.find((f) => f.name === file.name);
          if (duplicate) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === duplicate.id
                  ? {
                      id: duplicate.id,
                      name: file.name,
                      sizeBytes: file.size,
                      status: 'parsing' as const
                    }
                  : f
              )
            );
            parseFile(file, duplicate.id);
            return;
          }
        }

        // Register entry as 'parsing', then kick off the async parse
        setFiles((prev) => [
          ...(multiple ? prev : []),
          {id, name: file.name, sizeBytes: file.size, status: 'parsing'}
        ]);
        parseFile(file, id);
      });
    },
    [multiple, maxSizeMb, parseFile, files]
  );

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled) addFiles(e.dataTransfer.files);
    },
    [disabled, addFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleBrowse = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ''; // allow re-selecting the same file
  };

  const handleDelete = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleDeleteAll = useCallback(() => setFiles([]), []);

  const handleSubmit = () => {
    const output = files
      .filter((f) => f.status === 'success' && f.parsedData)
      .map((f) => f.parsedData!);
    setProps({nSubmits: nSubmits + 1, contents: output});
  };

  const handleDownload = useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id);
      if (file?.parsedData) downloadCsv(file.parsedData);
    },
    [files]
  );

  const handleDownloadAll = useCallback(() => {
    files
      .filter((f) => f.parsedData)
      .forEach((f, i) => setTimeout(() => downloadCsv(f.parsedData!), i * 200));
  }, [files]);

  // ── Derived state ─────────────────────────────────────────────────────────

  const successCount = files.filter((f) => f.status === 'success').length;
  const isParsing = files.some((f) => f.status === 'parsing');
  const canSubmit = successCount > 0 && !isParsing && !disabled;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box id={id} m={margin} width={width}>
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        multiple={multiple}
        style={{display: 'none'}}
        onChange={handleInputChange}
      />

      {labelText && (
        <Typography
          variant="body2"
          sx={{mb: 1, fontWeight: 500, fontSize: '0.875rem', color: C.textSecondary}}
        >
          {labelText}
        </Typography>
      )}

      {/* Drop zone */}
      <Box
        onClick={handleBrowse}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          py: 3,
          px: 2,
          borderRadius: '12px',
          border: isDragOver ? dz.borderActive : dz.border,
          backgroundColor: isDragOver ? dz.bgActive : dz.bg,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border 0.2s ease, background-color 0.2s ease',
          '&:hover': disabled ? {} : {border: dz.borderHover, backgroundColor: dz.bgHover}
        }}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 36,
            color: isDragOver ? dz.iconColorActive : dz.iconColor,
            transition: 'color 0.2s ease'
          }}
        />
        <Typography
          variant="body2"
          sx={{color: disabled ? C.textDisabled : C.textSecondary, textAlign: 'center'}}
        >
          {multiple ? 'Drag & drop CSV files here, or ' : 'Drag & drop a CSV file here, or '}
          <Box
            component="span"
            sx={{color: disabled ? C.textDisabled : dz.linkColor, fontWeight: 700}}
          >
            browse
          </Box>
        </Typography>
        <Typography variant="caption" sx={{color: C.textMuted}}>
          {`.csv · max ${maxSizeMb} MB${multiple ? '' : ' · single file'}`}
        </Typography>
      </Box>

      {/* File list */}
      {files.length > 0 && (
        <Box sx={{mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75}}>
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onDelete={() => handleDelete(file.id)}
              onDownload={() => handleDownload(file.id)}
            />
          ))}
        </Box>
      )}

      {/* Action bar — visible once files are loaded */}
      {files.length > 0 && (
        <Box
          sx={{
            mt: 1.5,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {/* Download all — compact icon button, multi-file only */}
          {multiple && successCount > 0 && (
            <Tooltip title="Download all">
              <span>
                <IconButton
                  size="small"
                  onClick={handleDownloadAll}
                  disabled={isParsing || disabled}
                  sx={{
                    color: C.textMuted,
                    '&:hover': {color: ua.downloadHoverColor, backgroundColor: ua.downloadHoverBg}
                  }}
                >
                  <StackedDownloadIcon fontSize={18} />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {/* Delete all */}
          <Tooltip title="Delete all">
            <span>
              <IconButton
                size="small"
                onClick={handleDeleteAll}
                disabled={disabled}
                sx={{
                  color: C.textMuted,
                  '&:hover': {color: ua.deleteHoverColor, backgroundColor: ua.deleteHoverBg}
                }}
              >
                <DeleteSweepOutlinedIcon sx={{fontSize: 18}} />
              </IconButton>
            </span>
          </Tooltip>

          {/* Upload button — hidden in 'auto-upload' and 'download-only' variants */}
          {variant === 'full' && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleSubmit}
              disabled={!canSubmit}
              sx={{display: 'flex', alignItems: 'center', gap: 0.5, ml: 0.5}}
            >
              {`Upload${
                successCount > 0 ? ` ${successCount} file${successCount > 1 ? 's' : ''}` : ''
              }`}
              <SendIcon sx={{fontSize: 15}} />
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

// ── FileRow ───────────────────────────────────────────────────────────────────

const FileRow = ({
  file,
  onDelete,
  onDownload
}: {
  file: FileEntry;
  onDelete: () => void;
  onDownload: () => void;
}) => {
  const ft = uploaderTheme.fileEntry;
  const ua = uploaderTheme.actions;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: '10px',
        backgroundColor: ft.bg,
        border: ft.border,
        minWidth: 0
      }}
    >
      <InsertDriveFileOutlinedIcon sx={{fontSize: 18, color: C.textMuted, flexShrink: 0}} />

      <Box sx={{flex: 1, minWidth: 0}}>
        <Typography
          variant="body2"
          noWrap
          sx={{fontWeight: 600, fontSize: '0.8rem', color: C.textPrimary}}
        >
          {file.name}
        </Typography>
        <Typography variant="caption" sx={{color: C.textMuted}}>
          {formatBytes(file.sizeBytes)}
        </Typography>
        {file.status === 'error' && file.errorMessage && (
          <Typography variant="caption" noWrap sx={{color: C.error, display: 'block'}}>
            {file.errorMessage}
          </Typography>
        )}
      </Box>

      <StatusBadge file={file} />

      {file.status === 'success' && (
        <IconButton
          size="small"
          title="Download"
          onClick={onDownload}
          sx={{
            color: C.textMuted,
            flexShrink: 0,
            '&:hover': {color: ua.downloadHoverColor, backgroundColor: ua.downloadHoverBg}
          }}
        >
          <FileDownloadOutlinedIcon sx={{fontSize: 16}} />
        </IconButton>
      )}

      <IconButton
        size="small"
        title="Remove"
        onClick={onDelete}
        sx={{
          color: C.textMuted,
          flexShrink: 0,
          '&:hover': {color: ua.deleteHoverColor, backgroundColor: ua.deleteHoverBg}
        }}
      >
        <DeleteOutlineIcon sx={{fontSize: 16}} />
      </IconButton>
    </Box>
  );
};

// ── StatusBadge ───────────────────────────────────────────────────────────────

const StatusBadge = ({file}: {file: FileEntry}) => {
  if (file.status === 'parsing') {
    return (
      <Chip
        label={
          <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
            <CircularProgress size={10} thickness={5} sx={{color: 'inherit'}} />
            Parsing…
          </Box>
        }
        size="small"
        sx={{
          height: 22,
          backgroundColor: alpha(C.info, 0.1),
          color: C.info,
          fontWeight: 700,
          fontSize: '0.7rem'
        }}
      />
    );
  }

  if (file.status === 'success') {
    return (
      <Chip
        label={
          <Box sx={{display: 'flex', alignItems: 'center', gap: 0.4}}>
            <CheckCircleOutlineIcon sx={{fontSize: 14}} />
            Ready
          </Box>
        }
        size="small"
        sx={{
          height: 22,
          backgroundColor: alpha(C.success, 0.1),
          color: C.success,
          fontWeight: 700,
          fontSize: '0.7rem'
        }}
      />
    );
  }

  return (
    <Chip
      label={
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.4}}>
          <ErrorOutlineIcon sx={{fontSize: 14}} />
          Error
        </Box>
      }
      size="small"
      sx={{
        height: 22,
        backgroundColor: alpha(C.error, 0.1),
        color: C.error,
        fontWeight: 700,
        fontSize: '0.7rem',
        cursor: 'help'
      }}
    />
  );
};

export default CsvUploader;
