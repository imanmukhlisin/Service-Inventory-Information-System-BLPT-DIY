import { StrictMode, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./app/AuthContext";
import { router } from "./app/router";
import "./index.css";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "40px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            fontFamily: "monospace",
          }}
        >
          <h2
            style={{ borderBottom: "1px solid #c62828", paddingBottom: "10px" }}
          >
            Runtime UI Error
          </h2>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
            {this.state.error?.toString()}
          </pre>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "13px",
              backgroundColor: "rgba(255,255,255,0.7)",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
