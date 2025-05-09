# FROM python:3.13-slim
# WORKDIR /app
# COPY . .
# RUN pip install --no-cache-dir -r requirements.txt
# CMD ["python", "main.py"]


FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Copy dependencies first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app files
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
