import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../img/logo.png";
import { UilSearch } from "@iconscout/react-unicons";
import "./LogoSearch.css";

const LogoSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(`/explore`);
    }
  };

  return (
    <div className="LogoSearch">
      <Link to="/home">
        <img src={Logo} alt="logo" style={{ cursor: "pointer", transition: "transform 0.2s ease" }} />
      </Link>
      <form className="Search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="#Explore or search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="s-icon" onClick={handleSearch} style={{ cursor: "pointer" }}>
          <UilSearch />
        </div>
      </form>
    </div>
  );
};

export default LogoSearch;
