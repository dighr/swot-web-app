import React from "react";
import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getUser } from "../../reducers/user";
import { handleServerMessages } from "../../reducers/notifications";

export default function ProfileLogin(props) {
	const form = useRef(null);
	const history = useHistory();
	const [messages, setMessages] = useState({});
	const dispatch = useDispatch();

	const handleSubmitResponse = (data) => {
		if (data.success === true) {
			// history wouldnt work well because SideBar doesnt rerender
			history.push("/");
			// window.location.reload();
			dispatch(getUser());
		}
		// setMessages(data.messages);
		dispatch(handleServerMessages(data.messages));
	};

	const handleChange = () => {
		setMessages({});
	};

	useEffect(() => {
		$(form.current).ajaxForm((data) => {
			handleSubmitResponse(data);
		});

		// return cleanup method
		return () => {
			$(form.current).off();
		};
	}, []);

	return (
		<>
			<h1 className="content-title">Log In</h1>

			<form ref={form} role="form" action="/api/auth" method="post">
				<section className="content-window">
					<section>
						<div className="flex-group">
							<label
								htmlFor="sender-email"
								className="control-label line"
							>
								<input
									className="form-control email"
									id="signin-email"
									placeholder="you@mail.com"
									name="email"
									type="email"
									onChange={() => {
										handleChange();
									}}
								/>
								<span class="label">Email:</span>
							</label>
							<label
								htmlFor="user-pass"
								className="control-label line"
							>
								<input
									type="password"
									className="form-control"
									placeholder="Password"
									name="password"
									id="password"
									onChange={() => {
										handleChange();
									}}
								/>
								<span class="label">Password:</span>
							</label>
						</div>
					</section>
				</section>

				<section className="content-window">
					<section>
						<div className="submission-wrap">
							<input
								type="submit"
								className="button blue"
								value="Log In"
							/>
							<Link to="/forgotpassword" className="button reset">
								<span>Forgot Password</span>
							</Link>
						</div>
					</section>
				</section>
			</form>
		</>
	);
}
