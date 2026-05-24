

https://github.com/user-attachments/assets/442e8698-0a5e-4587-b849-9af50b4919b4


# ReadMe

## Overview

This project consists of a Python Notebook for backend processing, an API interface for documentation and testing, and a frontend application built with HTML, CSS, and JavaScript. Follow the steps below to set up and run the project.

## Prerequisites

- Python 3.x
- Jupyter Notebook
- VSCode (or any other code editor)
- Live Server extension for VSCode

## Setup Instructions

### Step 0: Create and Activate a Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Step 0.1: Install Required Python Packages

```bash
pip install numpy torch umap-learn fastapi scikit-learn uvicorn nest-asyncio
```

### Step 1: Configure Directory Path in Python Notebook

1. Open the Python Notebook provided in the project.
2. Locate the cell where you need to add your directory path.
3. Modify the path in the cell to match the directory where your project files are stored.
   ```python
   # Example: Modify this line with your directory path
   directory_path = '/path/to/your/directory'
   ```

### Step 2: Start the API Interface

1. Ensure you have all necessary dependencies installed for running the API.
   ```bash
   pip install -r requirements.txt
   ```
2. Run the Python Notebook to start the server.
3. Open your browser and navigate to the following URL to access the API documentation and testing interface:
   ```
   http://127.0.0.1:8000/docs#/
   ```

### Step 3: Launch the Frontend Application

1. Open the folder containing your HTML, CSS, and JavaScript files in VSCode.
2. Use the Live Server extension to start a live server.
   - Right-click on your `index.html` file and select `Open with Live Server`.
3. If your live server runs on a different port than the default, you need to adjust the CORS settings in the Python Notebook:
   ```python
   # Example: Adjust the origins if your live server port is different
   origins = [
       "http://127.0.0.1:5500",  # Default port
       "http://127.0.0.1:YOUR_PORT_NUMBER"  # Replace with your port number
   ]
   ```

## Additional Information

- **API Documentation:** The API documentation provides detailed information about available endpoints and allows you to test them directly from the browser.
- **Live Server Port:** The default port for the Live Server extension in VSCode is 5500. If your live server runs on a different port, ensure to update the CORS settings in the Python Notebook accordingly.

## Troubleshooting

- **Server Not Starting:** Ensure you have all dependencies installed and that there are no syntax errors in your Python Notebook.
- **CORS Issues:** If you encounter CORS issues, double-check the `origins` list in the Python Notebook to ensure it includes the correct port for your live server.

## Conclusion

By following these steps, you should be able to run the project successfully. If you encounter any issues, refer to the troubleshooting section or consult the documentation provided with the project.

Happy Coding!
