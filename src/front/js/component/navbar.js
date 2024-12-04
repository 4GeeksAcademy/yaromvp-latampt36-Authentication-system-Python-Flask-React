import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const {store, actions} = useContext(Context)
	
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
					{
						store.token ? (
							<button onClick={() => actions.clearToken()} className="btn btn-danger ms-2">Close Session</button>
						) : (
							<Link to="/login">
								<button className="btn btn-primary ms-2">Log In</button>
							</Link>
						)
					}
				</div>
			</div>
		</nav>
	);
};
