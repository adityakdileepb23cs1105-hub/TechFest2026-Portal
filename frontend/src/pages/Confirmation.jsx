import { Link, useLocation } from "react-router-dom";

// Shown after a successful registration (lab manual step 13)
function Confirmation() {
  const location = useLocation();
  const name = location.state?.name;

  return (
    <div className="page">
      <h1>Thank you{name ? `, ${name}` : ""}!</h1>
      <p>You have been registered successfully.</p>
      <Link to="/events">Browse events</Link>
    </div>
  );
}

export default Confirmation;
