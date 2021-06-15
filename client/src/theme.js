import { createMuiTheme } from "@material-ui/core";

export default createMuiTheme({
	palette: {
		primary: {
			main: "#4069b1",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#f3c22b",
			contrastText: "#ffffff",
		},
	},
	overrides: {
		MuiAutocomplete: {
			root: {
				padding: 0,
				borderRadius: 0,
				"&& $inputRoot": {
					paddingLeft: "0px",
					paddingRight: "0px !important",
				},
				"&&&& $input": {
					paddingLeft: "10px",
					paddingRight: "40px",
				},
				"&&& $endAdornment": {
					right: "20px",
				},
				popupIndicator: {
					marginLeft: "10px",
				},
			},
		},
		MuiButton: {
			root: {},
		},
		MuiCheckbox: {},
	},
});
