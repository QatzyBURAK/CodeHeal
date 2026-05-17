import ast
import re
import networkx as nx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any

app = FastAPI(title="CodeHeal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    code: str
    language: str = "python"


class FixRequest(BaseModel):
    code: str
    issues: List[Any] = []


# ── Graph builder for bottleneck detection ──────────────────────────────────

class GraphBuilder(ast.NodeVisitor):
    def __init__(self):
        self.graph = nx.DiGraph()
        self._stack: list[str] = []

    def visit_FunctionDef(self, node):
        self.graph.add_node(node.name)
        self._stack.append(node.name)
        self.generic_visit(node)
        self._stack.pop()

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_Call(self, node):
        if self._stack and isinstance(node.func, ast.Name):
            self.graph.add_edge(self._stack[-1], node.func.id)
        self.generic_visit(node)


# ── Issue detector ───────────────────────────────────────────────────────────

class IssueDetector(ast.NodeVisitor):
    def __init__(self):
        self.issues: list[dict] = []
        self._func_stack: list[str] = []

    @property
    def _in_func(self):
        return self._func_stack[-1] if self._func_stack else None

    def visit_FunctionDef(self, node):
        self._func_stack.append(node.name)
        self.generic_visit(node)
        self._func_stack.pop()

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_Import(self, node):
        if self._in_func:
            for alias in node.names:
                self.issues.append({
                    "line": node.lineno,
                    "type": "CODE QUALITY",
                    "severity": "MED",
                    "description": f"Import '{alias.name}' inside function — should be at module top",
                    "fix": "Move import to top of file",
                })

    def visit_Call(self, node):
        func = node.func

        # time.sleep()
        if (isinstance(func, ast.Attribute) and func.attr == "sleep"
                and isinstance(func.value, ast.Name) and func.value.id == "time"):
            self.issues.append({
                "line": node.lineno,
                "type": "PERFORMANCE",
                "severity": "HIGH",
                "description": "time.sleep() wastes execution time",
                "fix": "Remove time.sleep() call entirely",
            })

        # print() inside function
        if isinstance(func, ast.Name) and func.id == "print" and self._in_func:
            self.issues.append({
                "line": node.lineno,
                "type": "BUG",
                "severity": "MED",
                "description": f"print() in '{self._in_func}()' — caller receives None instead of value",
                "fix": "Use return instead of print",
            })

        self.generic_visit(node)

    def visit_Assign(self, node):
        # f = open(...) without context manager
        if isinstance(node.value, ast.Call):
            call = node.value
            if isinstance(call.func, ast.Name) and call.func.id == "open":
                self.issues.append({
                    "line": node.lineno,
                    "type": "BUG",
                    "severity": "HIGH",
                    "description": "File opened without context manager — file handle may never be closed",
                    "fix": "Use 'with open(...) as f:' context manager",
                })
        self.generic_visit(node)

    def visit_Constant(self, node):
        # Hardcoded absolute paths
        if isinstance(node.value, str):
            val = node.value
            if len(val) > 3 and (val.startswith("/") or (len(val) > 2 and val[1] == ":")):
                if "/" in val or "\\" in val:
                    self.issues.append({
                        "line": node.lineno,
                        "type": "BUG",
                        "severity": "HIGH",
                        "description": f"Hardcoded path '{val[:50]}' — crashes on other machines",
                        "fix": "Use relative path or os.path / environment variable",
                    })

        # Magic numbers (exclude common safe values)
        SAFE = {0, 1, -1, 2, 10, 42, 100, 255, 1000}
        if isinstance(node.value, int) and node.value not in SAFE and node.value > 50:
            self.issues.append({
                "line": node.lineno,
                "type": "CODE QUALITY",
                "severity": "LOW",
                "description": f"Magic number {node.value} with no explanation",
                "fix": "Define as a named constant with a descriptive name",
            })

        self.generic_visit(node)


def _cyclomatic(node: ast.AST) -> int:
    branches = (ast.If, ast.For, ast.While, ast.ExceptHandler,
                ast.With, ast.Assert, ast.comprehension)
    return 1 + sum(1 for n in ast.walk(node) if isinstance(n, branches))


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "service": "CodeHeal API"}


@app.post("/analyze")
def analyze_code(request: CodeRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="No code provided")

    try:
        tree = ast.parse(request.code)
    except SyntaxError as e:
        raise HTTPException(status_code=422, detail=f"Syntax error at line {e.lineno}: {e.msg}")

    # Bottleneck via call graph centrality
    builder = GraphBuilder()
    builder.visit(tree)

    bottleneck = {"function": "main", "centrality": 0.0, "complexity": 1}
    if builder.graph.nodes:
        centrality = nx.degree_centrality(builder.graph)
        bn_name = max(centrality, key=centrality.get)
        func_node = next(
            (n for n in ast.walk(tree)
             if isinstance(n, ast.FunctionDef) and n.name == bn_name),
            None,
        )
        bottleneck = {
            "function": bn_name,
            "centrality": round(centrality[bn_name], 2),
            "complexity": _cyclomatic(func_node) if func_node else 1,
        }

    # Issue detection
    detector = IssueDetector()
    detector.visit(tree)
    issues = detector.issues

    high = sum(1 for i in issues if i["severity"] == "HIGH")
    med  = sum(1 for i in issues if i["severity"] == "MED")
    low  = sum(1 for i in issues if i["severity"] == "LOW")

    return {
        "issues": issues,
        "summary": {"total": len(issues), "high": high, "med": med, "low": low},
        "bottleneck": bottleneck,
    }


@app.post("/fix")
def fix_code(request: FixRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="No code provided")

    code = request.code

    # Remove time.sleep() lines
    code = re.sub(r"[ \t]*time\.sleep\([^)]*\)[ \t]*\n?", "", code)

    # f = open(...) → with open(...) as f:\n    pass
    def _fix_open(m):
        indent, var, args = m.group(1), m.group(2), m.group(3)
        return f"{indent}with open({args}) as {var}:\n{indent}    pass  # TODO: add file operations"

    code = re.sub(
        r"^([ \t]*)(\w+)\s*=\s*open\(([^)]+)\)[ \t]*$",
        _fix_open,
        code,
        flags=re.MULTILINE,
    )

    return {"fixed_code": code}
