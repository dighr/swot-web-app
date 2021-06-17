import React, { Component } from "react";
import { useState } from "react";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import FlashMessages from "../elements/FlashMessages";

export default function ProfileForgotPassword(props) {
	const form = useRef(null);
	const [messages, setMessages] = useState({});

	const handleSubmitResponse = (data) => {
		setMessages(data.messages);
	};

	const handleChange = () => {
		setMessages({});
	};

	useEffect(() => {
		$(form.current).ajaxForm((data) => {
			handleSubmitResponse(data);
		});
		return () => {
			$(form.current).off();
		};
	}, []);

	return (
		<>
			<h1 className="content-title">Forgot Password</h1>

			<form ref={form} role="form" action="/forgotpassword" method="post">
				<section className="content-window">
					<header>
						<div>Enter the email you're using for next steps.</div>
					</header>
					<section>
						<div className="flex-group">
							<label
								htmlFor="email"
								className="control-label line"
							>
								<input
									onChange={() => {
										handleChange();
									}}
									className="form-control email"
									id="email"
									placeholder="mail@example.com"
									name="email"
									type="email"
								/>
								<span className="label">Enter Your Email</span>
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
								value="Reset"
							/>
							<Link to="/signin" className="button reset">
								<span>Log in</span>
							</Link>
						</div>
					</section>
				</section>
			</form>
		</>
	);
}
