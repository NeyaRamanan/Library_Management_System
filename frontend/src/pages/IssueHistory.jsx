import { useEffect, useState } from "react";
import api from "../services/api";

function IssueHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api
      .get("/books/history")
      .then((res) => setHistory(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Issue History</h1>

      {history.map((item) => (
        <div
          key={item.issue_id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <h3>{item.book_title}</h3>

          <p>
            <strong>User:</strong> {item.user_name}
          </p>

          <p>
            <strong>Issue Date:</strong>
            {" "}
            {item.issue_date?.substring(0, 10)}
          </p>

          <p>
            <strong>Due Date:</strong>
            {" "}
            {item.due_date?.substring(0, 10)}
          </p>

          <p>
            <strong>Status:</strong>
            {" "}
            {item.status}
          </p>
        </div>
      ))}
    </div>
  );
}

export default IssueHistory;