import { useState, useEffect } from "react";
import { createLink, getLinks } from "./api";
import "./App.css";
import { API_URL } from "./api.js";
console.log(API_URL); // should print http://localhost:5000

function App() {
  const [target, setTarget] = useState("");
  const [slug, setSlug] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await getLinks();
      setLinks(data);
    } catch {
      setError("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const newLink = await createLink({ target, slug });
      setSuccess(`Created short link: ${window.location.origin}/${newLink.slug}`);
      setTarget("");
      setSlug("");
      fetchLinks();
    } catch (err) {
      setError(err.message || "Error creating link");
    }
  };

  const handleCopy = (slug) => {
    const shortUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(shortUrl);
    setSuccess(`Copied: ${shortUrl}`);
  };

  return (
    <div className="container">
      <h1>Mini URL Shortener</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="url"
          placeholder="Enter target URL"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <h2>All Links</h2>
      {loading ? (
        <p>Loading...</p>
      ) : links.length === 0 ? (
        <p>No links yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Slug</th>
              <th>Target</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Copy</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link._id}>
                <td>{link.slug}</td>
                <td>
                  <a href={link.target} target="_blank" rel="noreferrer">
                    {link.target}
                  </a>
                </td>
                <td>{link.clicks}</td>
                <td>{new Date(link.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleCopy(link.slug)}>Copy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
