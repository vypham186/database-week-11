import React from "react";

// Define Issue type
type Issue = {
  id: number;
  status: string;
  owner: string;
  created: Date;
  effort: number;
  completionDate?: Date;
  title: string;
  priority: string;
};

// --------------------
// Helper Function
// --------------------
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const borderedStyle: React.CSSProperties = {
  border: "1px solid silver",
  padding: 6,
};

const formContainerStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "16px",
  marginTop: "20px",
  backgroundColor: "#f9f9f9",
};

const formRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginBottom: "12px",
};

const inputStyle: React.CSSProperties = {
  padding: "10px",
  border: "1px solid #bbb",
  borderRadius: "6px",
  width: "100%",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#2f6fed",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

// --------------------
// IssueRow
// --------------------
class IssueRow extends React.Component<{
  issue: Issue;
  deleteIssue: (id: number) => void;
}> 
{
  render() {
    const { issue } = this.props;

    return (
      <tr>
        <td style={borderedStyle}>{issue.id}</td>
        <td style={borderedStyle}>{issue.status}</td>
        <td style={borderedStyle}>{issue.owner}</td>
        <td style={borderedStyle}>{formatDate(issue.created)}</td>
        <td style={borderedStyle}>{issue.effort}</td>
        <td style={borderedStyle}>
          {issue.completionDate ? formatDate(issue.completionDate) : ""}
        </td>
        <td style={borderedStyle}>{issue.title}</td>
        <td style={borderedStyle}>{issue.priority}</td>

        {/* Actions Column */}
        <td style={borderedStyle}>
          <button onClick={() => this.props.deleteIssue(issue.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

// --------------------
// IssueTable
// --------------------
class IssueTable extends React.Component<{
  issues: Issue[];
  deleteIssue: (id: number) => void;
}> 
{
  render() {
    const issueRows = this.props.issues.map((issue) => (
      <IssueRow
        key={issue.id}
        issue={issue}
        deleteIssue={this.props.deleteIssue}
      />
    ));

    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={borderedStyle}>Id</th>
            <th style={borderedStyle}>Status</th>
            <th style={borderedStyle}>Owner</th>
            <th style={borderedStyle}>Created</th>
            <th style={borderedStyle}>Effort</th>
            <th style={borderedStyle}>Completion Date</th>
            <th style={borderedStyle}>Title</th>
            <th style={borderedStyle}>Priority</th>
            <th style={borderedStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>{issueRows}</tbody>
      </table>
    );
  }
}

// --------------------
// IssueFilter
// --------------------
class IssueFilter extends React.Component {
  render() {
    return <div></div>;
  }
}

// --------------------
// IssueAdd
// --------------------
type IssueAddProps = {
  addIssue: (issue: Issue) => void;
};

type IssueAddState = {
  owner: string;
  title: string;
  effort: string;
  completionDate: string;
  priority: string;
  error: string;
};

class IssueAdd extends React.Component<IssueAddProps, IssueAddState> {
  constructor(props: IssueAddProps) {
    super(props);
    this.state = {
      owner: "",
      title: "",
      effort: "",
      completionDate: "",
      priority: "Low",
      error: "",
    };
  }

  /* Part 3 Task 3 Part 1 a */
  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>  {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<
      IssueAddState,
      keyof IssueAddState
    >);
  };

  validateForm = (): string => {
  const { owner, title, effort } = this.state;

  if (!owner.trim() || owner.trim().length < 3) {
    return "Owner must not be empty and must be at least 3 characters.";
  }

  if (!title.trim() || title.trim().length < 5) {
    return "Title must not be empty and must be at least 5 characters.";
  }

  if (!effort.trim()) {
    return "Effort must not be empty.";
  }

  const effortNumber = Number(effort);
  if (Number.isNaN(effortNumber) || effortNumber <= 0) {
    return "Effort must be a positive number.";
  }

  return "";
};

  /* Part 3 Task 2 */
handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const validationError = this.validateForm();
  if (validationError) {
    this.setState({ error: validationError });
    return;
  }

  const newIssue: Issue = {
    id: 0,
    status: "Open",
    owner: this.state.owner.trim(),
    created: new Date(),
    effort: Number(this.state.effort),
    completionDate: this.state.completionDate
      ? new Date(this.state.completionDate)
      : undefined,
    title: this.state.title.trim(),
    priority: this.state.priority,
  };

  this.props.addIssue(newIssue);

  this.setState({
    owner: "",
    title: "",
    effort: "",
    completionDate: "",
    priority: "Low",
    error: "",
  });
};

  /* Part 3 Task 3 Part 1 b add onChange */
render() {
  return (
    <div style={formContainerStyle}>
      <h3>Add New Issue</h3>

      {this.state.error && (
        <p style={{ color: "red", marginTop: 0 }}>{this.state.error}</p>
      )}

      <form onSubmit={this.handleSubmit}>
        <div style={formRowStyle}>
          <input
            style={inputStyle}
            name="owner"
            placeholder="Owner"
            value={this.state.owner}
            onChange={this.handleChange}
          />
          <input
            style={inputStyle}
            name="title"
            placeholder="Title"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <input
            style={inputStyle}
            name="effort"
            type="number"
            placeholder="Effort"
            value={this.state.effort}
            onChange={this.handleChange}
          />
          <input
            style={inputStyle}
            name="completionDate"
            type="date"
            value={this.state.completionDate}
            onChange={this.handleChange}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Add Issue
        </button>
      </form>
    </div>
  );
}
}

// --------------------
// IssueList
// --------------------
type IssueListState = {
  issues: Issue[];
};

class IssueList extends React.Component<{}, IssueListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      issues: [
        {
          id: 1,
          status: "Open",
          owner: "John",
          created: new Date("2016-08-15"),
          effort: 5,
          completionDate: undefined,
          title: "Error in console when clicking Add",
          priority: "High",
        },
        {
          id: 2,
          status: "Assigned",
          owner: "Emma",
          created: new Date("2016-08-16"),
          effort: 14,
          completionDate: new Date("2016-08-30"),
          title: "Missing bottom border on panel",
          priority: "Low",
        },
      ],
    };
  }

/* Part 3 Task 1 */
addIssue = (issue: Issue) => {
  const currentIds = this.state.issues.map((i) => i.id);
  const newId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;

  const updatedIssue = { ...issue, id: newId };

/* Part 3 Task 4 add console.log for addIssue */
  console.log("Before addIssue setState, old state snapshot:", this.state);

  this.setState((prevState) => ({
    issues: [...prevState.issues, updatedIssue],
  }));

  console.log("After addIssue setState, still old snapshot:", this.state);
};

/* Part 3 Task 2*/
deleteIssue = (id: number) => {
/* Part 3 Task 4 add console.log for deleteIssue */ 
  console.log("Before deleteIssue setState, old state snapshot:", this.state);

  this.setState((prevState) => ({
    issues: prevState.issues.filter((issue) => issue.id !== id),
  }));

  console.log("After deleteIssue setState, still old snapshot:", this.state);
};

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />

        <p>Total Issues: {this.state.issues.length}</p>

        <IssueTable
          issues={this.state.issues}
          deleteIssue={this.deleteIssue}
        />

        <hr />

        <IssueAdd addIssue={this.addIssue} />
      </React.Fragment>
    );
  }
}

export default IssueList;


