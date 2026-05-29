import {alpha, ThemeOptions} from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

// Centralized color tokens — exported so components can reference them directly
export const C = {
  ink: '#1C1A08',
  gold: '#FAC505',
  goldDark: '#7A5C00',
  bgDefault: '#EDF0F7',
  bgPaper: '#FFFFFF',
  bgSurface: '#F8F9FC',
  bgSurfaceWarm: '#F8F5E8',
  bgDrawer: '#FAFBFC',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textDisabled: '#D1D5DB',
  divider: 'rgba(0, 0, 0, 0.07)',
  error: '#DC2626',
  warning: '#F59E0B',
  info: '#2563EB',
  success: '#16A34A',
  accentGrey: '#c9cfd9'
} as const;

// Shared left-accent stripe used on elevated surfaces (cards, calendar popper).
// Uses ink rather than gold so it doesn't read as a "selected/focused" cue, which gold signals on inputs.
const accentBorder = `2px solid ${C.accentGrey}`;

// Custom MUI theme — https://mui.com/customization/default-theme/
export const theme: ThemeOptions = {
  // Brand color system: ink (near-black) as primary, gold as accent/contrast
  palette: {
    mode: 'light',
    primary: {main: C.ink, contrastText: C.gold},
    secondary: {main: C.gold},
    background: {paper: C.bgPaper, default: C.bgDefault},
    text: {primary: C.textPrimary, secondary: C.textSecondary, disabled: C.textDisabled},
    error: {main: C.error},
    warning: {main: C.warning},
    info: {main: C.info},
    success: {main: C.success},
    divider: C.divider
  },
  // Global default — most components override this to tighter values
  shape: {
    borderRadius: 16
  },
  // Compact type scale for dense data UIs; button text-transform disabled globally
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: {fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em'},
    h2: {fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em'},
    h3: {fontWeight: 600, fontSize: '0.875rem', letterSpacing: 0},
    body1: {fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.6},
    button: {textTransform: 'none', fontWeight: 600, letterSpacing: 0}
  },
  components: {
    // Cards — used by Table and other content sections: flat elevation with an ink left accent border
    MuiCard: {
      defaultProps: {elevation: 0},
      styleOverrides: {
        root: {
          background: C.bgPaper,
          borderLeft: accentBorder,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          transition: 'box-shadow 0.25s ease',
          '&:hover': {boxShadow: '0 8px 28px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04)'}
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {padding: '16px 20px', borderBottom: `1px solid ${alpha(C.textPrimary, 0.06)}`},
        title: {fontWeight: 600, fontSize: '0.9rem', color: C.textPrimary}
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {padding: '16px 20px', '&:last-child': {paddingBottom: '16px'}}
      }
    },
    // NavBar — gold bottom border, uppercase app title style
    MuiAppBar: {
      defaultProps: {elevation: 0},
      styleOverrides: {
        root: ({theme}) => ({
          borderBottom: `2px solid ${theme.palette.secondary.main}`,
          '& .MuiTypography-h1': {
            color: theme.palette.primary.contrastText,
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }
        })
      }
    },
    // Loads Material Icons font; sets a fluid base font size that scales with viewport width
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        html { font-size: clamp(12px, 0.85vw, 16px); }
      `
    },
    // SideBar drawer panel — borderless, light background, right-side depth shadow
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: C.bgDrawer,
          border: 'none',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)'
        }
      }
    },
    // Tab — gold active indicator, compact 44px touch target
    MuiTabs: {
      styleOverrides: {
        root: {borderBottom: `1px solid ${C.divider}`, minHeight: 44},
        indicator: {height: 3, borderRadius: '3px 3px 0 0', backgroundColor: C.gold}
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          fontWeight: 500,
          fontSize: '0.85rem',
          padding: '8px 20px',
          color: C.textSecondary,
          '&.Mui-selected': {color: C.textPrimary, fontWeight: 700}
        }
      }
    },
    // Dropdown — multi-select value chips: compact, gold-tinted, square-cornered
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          fontWeight: 600,
          height: 24,
          borderRadius: '6px',
          backgroundColor: alpha(C.gold, 0.12),
          color: C.goldDark
        }
      }
    },
    // Form field labels — used by Dropdown, InputText, Slider, Autocomplete
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: C.textSecondary,
          '&.Mui-focused': {color: C.textPrimary}
        }
      }
    },
    // SideBar nav items — rounded, gold-tinted selected state
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '&.Mui-selected': {backgroundColor: alpha(C.gold, 0.12)}
        }
      }
    },
    // Dropdown option rows — inset, rounded, gold-tinted selected state
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          margin: '2px 6px',
          fontSize: '0.875rem',
          minHeight: 36,
          '&.Mui-selected': {
            backgroundColor: alpha(C.gold, 0.12),
            fontWeight: 600,
            '&:hover': {backgroundColor: alpha(C.gold, 0.2)}
          },
          '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'}
        }
      }
    },
    // Outlined text input — used by InputText, Dropdown, Autocomplete, Slider: gold border on focus
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          backgroundColor: C.bgPaper,
          '& .MuiOutlinedInput-notchedOutline': {borderColor: 'rgba(0, 0, 0, 0.12)'},
          '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: 'rgba(0, 0, 0, 0.3)'},
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: C.gold,
            borderWidth: '2px'
          }
        }
      }
    },
    // Button — flat shadow by default; subtle lift on contained variant hover
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '8px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {boxShadow: 'none'}
        },
        contained: {
          '&:hover': {boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'}
        }
      }
    },
    // SideBar collapse toggle FAB
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          '&:hover': {boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'}
        }
      }
    },
    // Used by SideBar collapsed icon labels and IconButton
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: C.textPrimary,
          padding: '6px 12px'
        }
      }
    },
    // Alert (Snackbar) — white background with a colored left border per severity; all 4 standard variants
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '12px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          alignItems: 'center'
        },
        standardError: {
          backgroundColor: C.bgPaper,
          borderLeft: `3px solid ${C.error}`,
          color: C.textPrimary,
          '& .MuiAlert-icon': {color: C.error}
        },
        standardWarning: {
          backgroundColor: C.bgPaper,
          borderLeft: `3px solid ${C.warning}`,
          color: C.textPrimary,
          '& .MuiAlert-icon': {color: C.warning}
        },
        standardInfo: {
          backgroundColor: C.bgPaper,
          borderLeft: `3px solid ${C.info}`,
          color: C.textPrimary,
          '& .MuiAlert-icon': {color: C.info}
        },
        standardSuccess: {
          backgroundColor: C.bgPaper,
          borderLeft: `3px solid ${C.success}`,
          color: C.textPrimary,
          '& .MuiAlert-icon': {color: C.success}
        },
        message: {fontSize: '0.875rem', fontWeight: 500, padding: 0},
        icon: {padding: 0, marginRight: '12px', alignItems: 'center'}
      }
    },
    // NavBar separator
    MuiDivider: {
      styleOverrides: {
        root: {borderColor: C.divider}
      }
    },
    // Calendar date picker — rounded popper with gold accent border, consistent with Card style
    MuiPickersPopper: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          borderLeft: accentBorder
        }
      }
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {borderRadius: '16px'}
      }
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {fontSize: '0.875rem', fontWeight: 600, color: C.textPrimary}
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: 500,
          transition: 'background-color 0.15s ease',
          '&:hover': {backgroundColor: alpha(C.gold, 0.12)},
          '&.Mui-selected': {
            backgroundColor: C.ink,
            color: C.gold,
            fontWeight: 700,
            '&:hover': {backgroundColor: C.ink, opacity: 0.88},
            '&:focus': {backgroundColor: C.ink}
          },
          // Today's date: gold border only, no fill — keeps it subtle when not selected
          '&.MuiPickersDay-today:not(.Mui-selected)': {
            borderColor: C.gold,
            fontWeight: 700
          }
        }
      }
    },
    MuiPickersYear: {
      styleOverrides: {
        yearButton: {
          borderRadius: '8px',
          fontSize: '0.875rem',
          '&.Mui-selected': {
            backgroundColor: C.ink,
            color: C.gold,
            fontWeight: 700,
            '&:hover': {backgroundColor: C.ink, opacity: 0.88}
          }
        }
      }
    },
    // Slider — gold track and thumb with a translucent focus halo; used by Slider
    MuiSlider: {
      styleOverrides: {
        root: {color: C.gold, height: 4},
        thumb: {width: 16, height: 16, boxShadow: `0 0 0 4px ${alpha(C.gold, 0.16)}`},
        rail: {opacity: 0.25},
        valueLabel: {backgroundColor: C.textPrimary, borderRadius: '6px', fontSize: '0.75rem'}
      }
    },
    // Form group labels and helper text — used by Slider and Dropdown
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: C.textSecondary,
          '&.Mui-focused': {color: C.textPrimary}
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {fontSize: '0.75rem', marginTop: '4px', color: C.textMuted}
      }
    },
    // Toggle — no text transform, gold selected state; used by Toggle
    MuiToggleButtonGroup: {
      defaultProps: {size: 'small'}
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.8rem',
          padding: '5px 14px',
          '&.Mui-selected': {
            fontWeight: 700,
            backgroundColor: alpha(C.gold, 0.15),
            color: C.goldDark,
            '&:hover': {backgroundColor: alpha(C.gold, 0.22)}
          }
        }
      }
    },
    // --- Table (used by Table) ---
    MuiTable: {
      defaultProps: {size: 'small'} // compact row density
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px 16px',
          borderColor: 'rgba(0, 0, 0, 0.06)',
          // First column is sticky and acts as a row header
          '&:first-of-type': {position: 'sticky', left: 0, zIndex: 1, backgroundColor: C.bgSurface}
        },
        head: {
          fontWeight: 600,
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: C.textSecondary,
          backgroundColor: C.bgSurface,
          borderBottom: `2px solid ${C.gold}`, // gold separator between header and body rows
          whiteSpace: 'nowrap',
          '&:first-of-type': {zIndex: 3} // stacks above sticky body cells during horizontal scroll
        },
        body: {
          fontSize: '0.875rem',
          color: C.textPrimary,
          '&:first-of-type': {
            // Sticky row-header cell: visually separated from the scrollable columns
            backgroundColor: C.bgSurface,
            fontWeight: 600,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)'
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {backgroundColor: alpha(C.gold, 0.05)},
          // Warm tint on the sticky first cell so it stays visually distinct from bgSurface on hover
          '&:hover > td:first-of-type': {backgroundColor: C.bgSurfaceWarm},
          '&:last-child > td, &:last-child > th': {borderBottom: 0}
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          flexShrink: 0,
          borderTop: `1px solid ${C.divider}`,
          backgroundColor: C.bgSurface
        },
        toolbar: {
          minHeight: '40px !important',
          padding: '4px 8px 4px 16px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          rowGap: '2px'
        },
        spacer: {display: 'none'}, // remove default spacer so controls stay right-aligned
        selectLabel: {fontSize: '0.75rem', fontWeight: 500, color: C.textMuted, margin: 0},
        displayedRows: {fontSize: '0.75rem', fontWeight: 600, color: C.textSecondary, margin: 0},
        select: {
          fontSize: '0.75rem',
          fontWeight: 600,
          color: C.textPrimary,
          borderRadius: '6px',
          padding: '2px 20px 2px 6px !important'
        },
        actions: {
          marginLeft: '4px',
          '& .MuiIconButton-root': {
            padding: '4px',
            borderRadius: '6px',
            color: C.textMuted,
            transition: 'background-color 0.15s ease, color 0.15s ease',
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: alpha(C.gold, 0.1),
              color: C.textPrimary
            },
            '&.Mui-disabled': {color: C.textDisabled}
          }
        }
      }
    }
  }
};

// Design tokens for the CsvUploader component — colours, borders, and backgrounds
export const uploaderTheme = {
  dropZone: {
    border: `1.5px dashed ${alpha(C.textPrimary, 0.15)}`,
    borderHover: `1.5px dashed ${alpha(C.textPrimary, 0.3)}`,
    borderActive: `1.5px dashed ${C.gold}`,
    bg: C.bgPaper,
    bgHover: alpha(C.gold, 0.02),
    bgActive: alpha(C.gold, 0.05),
    iconColor: C.textMuted,
    iconColorActive: C.goldDark,
    linkColor: C.goldDark
  },
  fileEntry: {
    bg: C.bgSurface,
    border: `1px solid ${alpha(C.textPrimary, 0.07)}`,
    progressBg: alpha(C.gold, 0.2),
    progressBar: C.gold
  },
  actions: {
    downloadHoverColor: C.goldDark,
    downloadHoverBg: alpha(C.gold, 0.08),
    deleteHoverColor: C.error,
    deleteHoverBg: alpha(C.error, 0.08)
  }
} as const;
