import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../../styles/Navbar.css";

function Navbar({patientInfo}) {
	const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
	};

	return (
		<header>
			<h3 className="black_logo">LOGO</h3>
			<nav className="informationBar" ref={navRef}>
				<p className="name">Patient Name: {patientInfo.patientName}</p>
				<p className="age" >Age : {parseInt(patientInfo.patientAge.replace(/\D/g, ''), 10)}</p>
				<p className="patientId">Patient ID : {patientInfo.patientId}</p>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button>
		</header>
	);
}

export default Navbar;