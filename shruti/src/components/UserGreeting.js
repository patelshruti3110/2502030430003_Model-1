import { useAuth } from "../context/AuthContext";

function UserGreeting() {
  const { user } = useAuth();

  if (!user?.name) return null;

  return (
    <section className="greeting-card slide-down">
      <span className="avatar">{getInitials(user.name)}</span>
      <div>
        <p className="page-kicker">Signed in workspace</p>
        <h1 className="greeting-card__title">Welcome back, {user.name}</h1>
        <p className="greeting-card__meta">
          {user.email ? `${user.email} - ` : ""}Build. Showcase. Get Hired.
        </p>
      </div>
    </section>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
}

export default UserGreeting;
