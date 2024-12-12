# Dockerfile for the backend
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file and install the dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the port on which the application will run
EXPOSE 5000

# Command to run the Flask application
CMD ["python", "app.py"]