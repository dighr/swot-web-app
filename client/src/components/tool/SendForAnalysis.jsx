import React from "react";
import FormSelectSearch from "../elements/FormSelectSearch";
// Styles
import { withStyles, makeStyles } from "@material-ui/core/styles";
// Slider
import Slider from "@material-ui/core/Slider";
// Accordion
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionExpandMoreIcon from "@material-ui/icons/ExpandMore";
// Date Picker
import TextField from "@material-ui/core/TextField";
const dateFormat = "YYYY-MM-DD";
// Tool Tip
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) => ({
	root: {
		width: 300 + theme.spacing(3) * 2,
	},
	margin: {
		height: theme.spacing(3),
	},
}));

const FromSlider_HouseholdDuration_Hours = [
	{ value: 3 },
	{ value: 6 },
	{ value: 9 },
	{ value: 12 },
	{ value: 15 },
	{ value: 18 },
	{ value: 21 },
	{ value: 24 },
];

const SliderThumbBoxShadow =
	"0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const FormSlider = withStyles({
	root: {
		color: "#4069b1",
		height: 10,
		padding: "15px 0",
	},
	thumb: {
		height: "2.6rem",
		width: "2.6rem",
		backgroundColor: "#4069b1",
		boxShadow: SliderThumbBoxShadow,
		marginTop: "-1rem",
		marginLeft: "-1.3rem",
		"&:focus, &:hover, &$active": {
			transform: "scale(1.1)",
			boxShadow:
				"0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
			// Reset on touch devices, it doesn't add specificity
			"@media (hover: none)": {
				boxShadow: SliderThumbBoxShadow,
			},
		},
	},
	active: {},
	track: {
		height: 10,
	},
	rail: {
		height: 10,
		opacity: 0.5,
		backgroundColor: "#bfbfbf",
	},
	mark: {
		backgroundColor: "#bfbfbf",
		height: 15,
		width: 2,
		marginTop: -5,
		marginLeft: -1,
	},
	markActive: {
		opacity: 1,
		backgroundColor: "currentColor",
	},
})(Slider);

const Accordion = withStyles({
	root: {
		"&:before": {
			display: "none",
		},
		"&$expanded": {
			margin: "20px 30px 40px",
		},
	},
	expanded: {
		margin: 0,
	},
})(MuiAccordion);

const AccordionSummary = withStyles({
	root: {
		borderBottom: "1px solid #dde6ed",
		margin: 0,
	},
	content: {
		margin: 0,
		"&$expanded": {
			margin: 0,
		},
	},
	expanded: {
		margin: 0,
	},
	expandIcon: {
		padding: "0 12px 0 0",
	},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(() => ({
	root: {
		padding: "0",
		flexDirection: "column",
	},
}))(MuiAccordionDetails);

// Guides
const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 380,
		border: "2px solid #dadde9",
		padding: "20px 30px",
		boxShadow: "4px 4px 5px rgb(0, 0, 0, .10)",
	},
}))(Tooltip);
export default class SendForAnalysis extends React.Component {
	constructor(props) {
		super(props);
		this.analyzeForm = React.createRef();
		this.formPayload = {};
	}

	componentDidMount() {
		this.populateDates();
	}

	handleSubmit(e) {
		e.preventDefault();
		const formData = new FormData();
		const formObj = this.analyzeForm.current;
		const jqFormObj = $(formObj);
		const { fieldsite } = this.formPayload;
		const fieldsiteName = fieldsite.name;
		const startDate = formObj.startDate.value;
		const endDate = formObj.endDate.value;

		formData.append("fieldsite", fieldsite.id);
		formData.append("datasetName", formObj.datasetName.value);
		formData.append("datasetDescription", formObj.datasetDescription.value);
		formData.append("maxDurationHours", formObj.maxDurationHours.value);
		formData.append("confidenceLevel", formObj.confidenceLevel.value);
		formData.append("startDate", startDate);
		formData.append("endDate", endDate);

		let err = false;

		const iter = formData.keys();
		let fieldKey = null;
		while ((fieldKey = iter.next())) {
			if (fieldKey.done) {
				break;
			}
			let fieldValue = formData.get(fieldKey.value);
			if (!fieldValue) {
				this.fieldError(jqFormObj, fieldKey.value);
				err = true;
			}
		}
		if (new Date(startDate) > new Date(endDate)) {
			this.fieldError(jqFormObj, "startDate");
		}
		if (err) {
			return;
		}

		showSpinner();

		fetch("/api/upload/analyze", { method: "POST", body: formData })
			.then((res) =>
				res.json().then((data) => {
					if (res.ok) {
						showConfirmModal(
							`Analyzing ${fieldsiteName} from ${startDate} to ${endDate}.`
						);
					} else {
						logError({ status: data.status, message: data.error });
					}
				})
			)
			.catch((err) => {
				logError(err);
			})
			.finally(() => {
				hideSpinner();
			});
	}

	populateDates() {
		// get current time
		const currTime = new Date();
		// round to second
		// currTime.setTime(Math.floor(currTime / 60000) * 60000);
		$("#startDate")[0].valueAsNumber = $("#endDate")[0].valueAsNumber =
			currTime - currTime.getTimezoneOffset() * 60000;
	}

	fieldError(formElement, name) {
		const input = formElement.find(`[name=${name}][id=${name}]`);
		let label = formElement.find(`label[for=${input.attr("id")}]`);
		if (!label.length) {
			label = input.closest("label");
		}

		shakeElement(input);
		shakeElement(label);

		input.one("input", () => {
			label.removeClass("text-danger");
		});
		label.addClass("text-danger");
	}
	render() {
		return (
			<form
				role="form"
				autoComplete="off"
				ref={this.analyzeForm}
				onSubmit={(e) => {
					this.handleSubmit(e);
				}}
			>
				{/* <h2 className="content-title">Choose a Location</h2> */}

				<section
					id="collect-data"
					className="content-window bleed-edges rich-text"
				>
					<header>
						<div className="content-window-title txt-condensed">
							Step 3. Analysis of Data
						</div>
						<div className="content-window-title-description">
							<p>
								Cras rhoncus leo dui, eu tempus nisl accumsan
								ut. Quisque scelerisque massa tellus, sed
								finibus mauris rhoncus vel. Morbi eleifend nisi
								quis elit pretium placerat.
							</p>
						</div>
					</header>
				</section>

				<section className="content-window">
					<header>
						<div className="content-window-title">Location</div>
						<div className="section-options"></div>
					</header>
					<section>
						<div className="flex-group">
							<label className="space">
								<FormSelectSearch
									options={OptionsResponse}
									icon={true}
								/>
								<span className="label">Country</span>
							</label>
							<label className="space">
								<FormSelectSearch options={OptionsArea} />
								<span className="label">Area</span>
							</label>
							<label className="space">
								<FormSelectSearch options={OptionsFieldsites} />
								<span className="label">Fieldsite</span>
							</label>
						</div>
					</section>
					<footer>
						<span className="txt-icon notice">
							<i>
								<img src="assets/icons/notice.svg" alt="" />
							</i>
							<span>
								Cant find your Area or Fieldsite? ...{" "}
								<a href="/contact">Contact Us</a>
							</span>
						</span>
					</footer>
				</section>

				<h2 className="content-title">Provide a Date Range</h2>

				<section id="date-range" className="content-window">
					<section>
						{/* <!-- --> */}
						<div className="custom-range">
							<span className="custom-range-title">
								<span className="note">
									* Click icon to show calender
								</span>
							</span>
							<div className="flex-group">
								<div className="space">
									<label htmlFor="startDate">
										<span className="datepicker-toggle">
											<span className="datepicker-toggle-button"></span>
											{/* 
                        [pattern="\d{4}-\d{2}-\d{2}"] fallback for text input to normalize YYYY-MM-DD input
                      */}
											<TextField
												id="startDate"
												name="startDate"
												label=""
												type="date"
												defaultValue="YYYY-MM-DD"
												pattern="\d{4}-\d{2}-\d{2}"
												className="datepicker-input"
												InputProps={{
													disableUnderline: true,
												}}
											/>
										</span>
										<span className="label">
											Start Date
										</span>
									</label>
								</div>
								<div>
									<label htmlFor="endDate">
										<span className="datepicker-toggle">
											<span className="datepicker-toggle-button"></span>
											{/* [pattern="\d{4}-\d{2}-\d{2}"] fallback for text input to normalize YYYY-MM-DD input */}
											<TextField
												id="endDate"
												name="endDate"
												label=""
												type="date"
												defaultValue="YYYY-MM-DD"
												pattern="\d{4}-\d{2}-\d{2}"
												className="datepicker-input"
												InputProps={{
													disableUnderline: true,
												}}
											/>
										</span>
										<span className="label">End Date</span>
									</label>
								</div>
							</div>
						</div>
						{/* {/* <!-- --> */}
						<label className="radio">
							<input
								type="radio"
								className="radio-input"
								name="range-option"
								id="range30"
							/>
							<span className="label">Last 30 Days</span>
						</label>{" "}
						&nbsp; &nbsp; &nbsp;
						{/* <!-- --> */}
						<label className="radio">
							<input
								type="radio"
								className="radio-input"
								name="range-option"
								id="range60"
							/>
							<span className="label">Last 60 Days</span>
						</label>
						{/* <!-- --> */}
						<label className="radio block">
							<input
								type="radio"
								className="radio-input"
								name="range-option"
								id="rangeAll"
							/>
							<span className="label">All data Available</span>
						</label>
					</section>

					<footer>
						<HtmlTooltip
							placement="top-start"
							interactive
							TransitionComponent={Fade}
							title={
								<React.Fragment>
									<Typography variant="h5">
										Choosing a Date Range
									</Typography>
									<Typography variant="body1">
										<em>{"And here's"}</em> <b>{"some"}</b>{" "}
										<u>{"amazing content"}</u>.{" "}
										{"It's very engaging. Right?"}
										<br />
										<a href="">Learn more...</a>
									</Typography>
								</React.Fragment>
							}
						>
							<span className="txt-icon guide txt-sm">
								<i>
									<img src="assets/icons/guides.svg" alt="" />
								</i>
								<span>Choosing a Date Range</span>
							</span>
						</HtmlTooltip>
					</footer>
				</section>

				<h2 className="content-title">Options For Analysis</h2>

				<section id="household-duration" className="content-window">
					<header>
						<div className="content-window-title">
							Duration of Household Storage and Use (Units in
							Hours)
						</div>
						<div className="section-options"></div>
					</header>
					<section>
						<div className="range">
							<label
								htmlFor="HouseholdDuration"
								className="labels"
							>
								{FromSlider_HouseholdDuration_Hours.map(
									(hour) => (
										<span key={hour.value}>
											<span>{hour.value}</span>
										</span>
									)
								)}
							</label>
							<FormSlider
								name="household-duration"
								aria-label="Household Duration"
								defaultValue={3}
								marks={FromSlider_HouseholdDuration_Hours}
								valueLabelDisplay="on"
								min={3}
								max={24}
								step={3}
								valueLabelDisplay={"off"}
							/>
						</div>
					</section>

					<footer>
						<HtmlTooltip
							placement="top-start"
							interactive
							TransitionComponent={Fade}
							title={
								<React.Fragment>
									<Typography variant="h5">
										How should I determine the storage time?
									</Typography>
									<Typography variant="body1">
										<em>{"And here's"}</em> <b>{"some"}</b>{" "}
										<u>{"amazing content"}</u>.{" "}
										{"It's very engaging. Right?"}
									</Typography>
								</React.Fragment>
							}
						>
							<span className="txt-icon guide txt-sm">
								<i>
									<img src="assets/icons/guides.svg" alt="" />
								</i>
								<span>
									How should I determine the storage time?
								</span>
							</span>
						</HtmlTooltip>
					</footer>
				</section>

				<Accordion id="confidence-level" className="content-window">
					<AccordionSummary
						className="header"
						expandIcon={<MuiAccordionExpandMoreIcon />}
					>
						<div className="content-window-title">
							Modelling Confidence Level (Optional)
						</div>
						<div className="section-options"></div>
					</AccordionSummary>

					<AccordionDetails>
						<section className="section">
							{/* {/* <!-- --> */}
							<label
								htmlFor="mediumDecayScenario"
								className="radio block"
							>
								<input
									type="radio"
									className="radio-input"
									name="DecayScenario"
									id="mediumDecayScenario"
								/>
								<span className="label">
									Medium Decay Scenario
								</span>
							</label>

							{/* <!-- --> */}
							<label
								htmlFor="BalancedDecayScenario"
								className="radio block"
							>
								<input
									type="radio"
									className="radio-input"
									name="DecayScenario"
									id="BalancedDecayScenario"
								/>
								<span className="label">
									Optimum / Balanced Decay Scenario
								</span>
							</label>

							{/* <!-- --> */}
							<label
								htmlFor="MaximumDecayScenario"
								className="radio block"
							>
								<input
									type="radio"
									className="radio-input"
									name="DecayScenario"
									id="MaximumDecayScenario"
								/>
								<span className="label">
									Maximum Decay Scenario
								</span>
							</label>
						</section>

						<footer className="footer">
							<HtmlTooltip
								placement="top-start"
								interactive
								TransitionComponent={Fade}
								title={
									<React.Fragment>
										<Typography variant="h5">
											Which scenario should I choose?
										</Typography>
										<Typography variant="body1">
											<em>{"And here's"}</em>{" "}
											<b>{"some"}</b>{" "}
											<u>{"amazing content"}</u>.{" "}
											{"It's very engaging. Right?"}
										</Typography>
									</React.Fragment>
								}
							>
								<span className="txt-icon guide txt-sm">
									<i>
										<img
											src="assets/icons/guides.svg"
											alt=""
										/>
									</i>
									<span>Which scenario should I choose?</span>
								</span>
							</HtmlTooltip>
						</footer>
					</AccordionDetails>
				</Accordion>

				<section id="" className="content-window">
					<section>
						<div className="submission-wrap">
							<input
								type="submit"
								value="Run Analysis"
								className="button green"
								readOnly
							/>
							<input
								type="reset"
								value="Reset Fields"
								className="button"
								readOnly
							/>
						</div>
					</section>

					<footer>
						<span className="txt-icon notice">
							<i>
								<img src="assets/icons/notice.svg" alt="" />
							</i>
							<span>Make sure all fields are filled out</span>
						</span>
					</footer>
				</section>
			</form>
		);
	}
}
