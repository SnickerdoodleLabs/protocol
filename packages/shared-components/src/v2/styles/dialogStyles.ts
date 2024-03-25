import { Theme, makeStyles, darken } from "@material-ui/core/styles";

interface DialogStylesProps {
  maxWidth?: number;
}

export const useDialogStyles = makeStyles((theme: Theme) => ({
  dialog: {
    "& .MuiDialogTitle-root": {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.cardBgColor,
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1.5),
        paddingBottom: theme.spacing(2),
      },
    },
    "& .MuiDialogContent-root": {
      backgroundColor: darken(theme.palette.cardBgColor, 0.0175),
      borderTop: `1px solid ${darken(theme.palette.borderColor, 0.15)}`,
      borderBottom: `1px solid ${darken(theme.palette.borderColor, 0.15)}`,
      padding: theme.spacing(4),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1),
      },
    },
    "& .MuiDialogActions-root": {
      backgroundColor: theme.palette.cardBgColor,
      padding: theme.spacing(4),
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(1),
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
      },
    },
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: (props: DialogStylesProps) => props.maxWidth ?? 640,
      [theme.breakpoints.down("xs")]: {
        margin: 8,
      },
    },
    "& .MuiDialog-paperFullWidth": {
      [theme.breakpoints.down("xs")]: {
        width: "unset",
        minWidth: "98%",
      },
    },
  },
}));
