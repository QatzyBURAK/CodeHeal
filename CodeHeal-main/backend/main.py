from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ast
import networkx as nx

app = FastAPI()

# 1. Data Validation: Bob must send data in this format
class CodeRequest(BaseModel):
    code: str

# 2. The Core Engine: AST to Graph
class CodeGraphBuilder(ast.NodeVisitor):
    def __init__(self):
        self.graph = nx.DiGraph()
        self.current_func = None

    def visit_FunctionDef(self, node):
        # Add function as a node
        self.graph.add_node(node.name)
        prev_func = self.current_func
        self.current_func = node.name
        self.generic_visit(node)
        self.current_func = prev_func

    def visit_Call(self, node):
        # Draw edges between functions
        if isinstance(node.func, ast.Name) and self.current_func:
            self.graph.add_edge(self.current_func, node.func.id)
        self.generic_visit(node)

# 3. The API Endpoint
@app.post("/analyze")
def analyze_code(request: CodeRequest):
    if not request.code:
        raise HTTPException(status_code=400, detail="No code provided")
        
    try:
        # Parse the string into an Abstract Syntax Tree
        tree = ast.parse(request.code)
        builder = CodeGraphBuilder()
        builder.visit(tree)
        
        if len(builder.graph.nodes) == 0:
            return {"status": "success", "bottleneck": "none", "message": "No functions found in this file."}
            
        # The Math: Centrality Calculation
        # degree_centrality checks which node has the most connections (edges)
        centrality = nx.degree_centrality(builder.graph)
        bottleneck = max(centrality, key=centrality.get)
        
        return {
            "status": "success",
            "bottleneck_node": bottleneck,
            "centrality_score": centrality[bottleneck],
            "message": f"Critical bottleneck detected in: {bottleneck}"
        }
    except Exception as e:
        # We must return 500 error properly so Bob doesn't crash completely
        raise HTTPException(status_code=500, detail=str(e))