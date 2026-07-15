import GuestDashboard from "../components/GuestDashboard";
import NewUserDashboard from "../components/NewUserDashboard";
import ReturningDashboard from "../components/ReturningDashboard";

/*
Possible values:
"guest"
"new"
"returning"
*/

const userType = "returning";

export default function Dashboard() {
  switch (userType) {
    case "guest":
      return <GuestDashboard />;

    case "new":
      return <NewUserDashboard />;

    case "returning":
      return <ReturningDashboard />;

    default:
      return <GuestDashboard />;
  }
}