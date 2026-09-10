import os
import sys
import uvicorn

backendDir = os.path.dirname(os.path.abspath(__file__))
if backendDir not in sys.path:
    sys.path.insert(0, backendDir)

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
